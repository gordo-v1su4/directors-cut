/**
 * Composites two takes on the GPU, frame by frame, straight from their
 * <video> elements (no copies through the CPU).
 *
 *   wipe: take A left of the split, take B right of it, with a soft seam.
 *   diff: take A in dim greyscale with every pixel that differs from take B
 *         lit in warm light, so a director sees at a glance what changed.
 *
 * The videos must be CORS-readable (crossorigin="anonymous"); the media host
 * sends Access-Control-Allow-Origin: *.
 */

const shader = /* wgsl */ `
struct Params { split: f32, mode: f32, aspect: f32, pad: f32 }
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var samp: sampler;
@group(0) @binding(2) var takeA: texture_external;
@group(0) @binding(3) var takeB: texture_external;

struct Out { @builtin(position) position: vec4f, @location(0) uv: vec2f }

@vertex fn vs(@builtin(vertex_index) i: u32) -> Out {
  var pos = array<vec2f, 3>(vec2f(-1., -1.), vec2f(3., -1.), vec2f(-1., 3.));
  var out: Out;
  out.position = vec4f(pos[i], 0., 1.);
  out.uv = vec2f(pos[i].x * .5 + .5, 1. - (pos[i].y * .5 + .5));
  return out;
}

fn luma(c: vec3f) -> f32 { return dot(c, vec3f(.2126, .7152, .0722)); }

@fragment fn fs(in: Out) -> @location(0) vec4f {
  let a = textureSampleBaseClampToEdge(takeA, samp, in.uv).rgb;
  let b = textureSampleBaseClampToEdge(takeB, samp, in.uv).rgb;

  if (params.mode < .5) {
    let feather = .004;
    let t = smoothstep(params.split - feather, params.split + feather, in.uv.x);
    var color = mix(a, b, t);
    // A faint lit seam so the split reads even where the takes match.
    let seam = 1. - smoothstep(0., .0022, abs(in.uv.x - params.split));
    color = mix(color, vec3f(1.), seam * .35);
    return vec4f(color, 1.);
  }

  let d = length(a - b) / 1.732;
  let heat = smoothstep(.04, .32, d);
  let base = vec3f(luma(a) * .42);
  let warm = mix(vec3f(1., .52, .22), vec3f(1., .88, .62), heat);
  return vec4f(mix(base, warm, heat * .9), 1.);
}`;

export type BlendMode = 'wipe' | 'diff';

export class TakeCompositor {
  private constructor(
    private device: any,
    private context: any,
    private pipeline: any,
    private sampler: any,
    private uniform: any,
  ) {}

  static async create(canvas: HTMLCanvasElement): Promise<TakeCompositor | null> {
    const gpu = (navigator as any).gpu;
    if (!gpu) return null;
    try {
      const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (!adapter) return null;
      const device = await adapter.requestDevice();
      const context = canvas.getContext('webgpu') as any;
      if (!context) return null;
      const format = gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: 'opaque' });
      const module = device.createShaderModule({ code: shader });
      const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module, entryPoint: 'vs' },
        fragment: { module, entryPoint: 'fs', targets: [{ format }] },
        primitive: { topology: 'triangle-list' },
      });
      const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });
      const usage = (globalThis as any).GPUBufferUsage;
      const uniform = device.createBuffer({ size: 16, usage: usage.UNIFORM | usage.COPY_DST });
      return new TakeCompositor(device, context, pipeline, sampler, uniform);
    } catch {
      return null;
    }
  }

  /** Draws one frame. Returns false when a video has no frame to give yet. */
  draw(canvas: HTMLCanvasElement, a: HTMLVideoElement, b: HTMLVideoElement, split: number, mode: BlendMode): boolean {
    if (a.readyState < 2 || b.readyState < 2) return false;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    this.device.queue.writeBuffer(this.uniform, 0, new Float32Array([split, mode === 'wipe' ? 0 : 1, width / height, 0]));
    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniform } },
        { binding: 1, resource: this.sampler },
        { binding: 2, resource: this.device.importExternalTexture({ source: a }) },
        { binding: 3, resource: this.device.importExternalTexture({ source: b }) },
      ],
    });

    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: this.context.getCurrentTexture().createView(),
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3);
    pass.end();
    this.device.queue.submit([encoder.finish()]);
    return true;
  }

  destroy() {
    this.uniform.destroy();
    this.context.unconfigure?.();
    this.device.destroy?.();
  }
}
