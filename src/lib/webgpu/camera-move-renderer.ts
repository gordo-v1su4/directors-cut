type CanvasEntry = {
  canvas: HTMLCanvasElement;
  context: any;
  uniform: any;
  bindGroup: any;
  type: number;
  active: boolean;
};

const shader = /* wgsl */ `
struct Params { data: vec4f }
@group(0) @binding(0) var<uniform> params: Params;

struct Out { @builtin(position) position: vec4f, @location(0) uv: vec2f }
@vertex fn vs(@builtin(vertex_index) i: u32) -> Out {
  var pos = array<vec2f, 3>(vec2f(-1., -1.), vec2f(3., -1.), vec2f(-1., 3.));
  var out: Out; out.position = vec4f(pos[i], 0., 1.); out.uv = pos[i] * .5 + .5; return out;
}
fn line(p: vec2f, a: vec2f, b: vec2f) -> f32 {
  let pa = p-a; let ba = b-a; let h = clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h);
}
fn ring(p: vec2f, c: vec2f, r: f32) -> f32 { return abs(length(p-c)-r); }
fn pathPoint(kind: f32, t: f32) -> vec2f {
  if (kind < .5) { return mix(vec2f(-.72,0.), vec2f(.28,0.), t); }
  if (kind < 1.5) { return mix(vec2f(.28,0.), vec2f(-.72,0.), t); }
  if (kind < 2.5) { let a=mix(3.55,1.25,t); return vec2f(cos(a),sin(a))*.48; }
  if (kind < 3.5) { let a=mix(1.25,3.55,t); return vec2f(cos(a),sin(a))*.48; }
  if (kind < 4.5) { return mix(vec2f(.7,-.18),vec2f(-.7,-.18),t); }
  if (kind < 5.5) { return mix(vec2f(-.55,.62),vec2f(.08,-.12),t); }
  if (kind < 6.5) { return mix(vec2f(-.22,-.62),vec2f(-.22,.58),t); }
  if (kind < 7.5) { let a=mix(3.4,1.1,t); return vec2f(cos(a)*.52,sin(a)*.38 + mix(-.18,.22,t)); }
  if (kind < 8.5) { return mix(vec2f(-.7,-.28),vec2f(.12,.12),t); }
  if (kind < 9.5) { return mix(vec2f(-.68,-.05),vec2f(.15,.02),t)+vec2f(sin(t*29.)*.018,cos(t*23.)*.025); }
  if (kind < 10.5) { return mix(vec2f(0.,.68),vec2f(0.,.08),t); }
  return mix(vec2f(-.68,-.25),vec2f(.48,-.25),t);
}
fn pathDistance(p: vec2f, kind: f32) -> f32 {
  var d=10.; var prev=pathPoint(kind,0.);
  for(var i=1;i<40;i++){ let q=pathPoint(kind,f32(i)/39.); d=min(d,line(p,prev,q)); prev=q; }
  return d;
}
@fragment fn fs(in: Out) -> @location(0) vec4f {
  var p=(in.uv*2.-1.); p.x*=params.data.z;
  let kind=params.data.y; let phase=fract(params.data.x*.13 + kind*.071);
  let cam=pathPoint(kind,phase); let subject=vec2f(.28,.02);
  var color=vec3f(.025,.026,.03);
  let gridx=abs(fract((p.x+.025)*5.)-.5); let gridy=abs(fract((p.y+.025)*5.)-.5);
  let grid=1.-smoothstep(.48,.5,min(gridx,gridy)); color+=vec3f(.055,.057,.064)*grid;
  let pd=pathDistance(p,kind); color=mix(color,vec3f(.42,.43,.47),1.-smoothstep(.012,.022,pd));
  let sight=line(p,cam,subject); color=mix(color,vec3f(.19,.20,.22),1.-smoothstep(.005,.012,sight));
  let sr=length(p-subject); color=mix(color,vec3f(.92,.92,.93),1.-smoothstep(.055,.07,sr));
  let cr=length(p-cam); color=mix(color,vec3f(.96,.65,.16),1.-smoothstep(.045,.065,cr));
  let nose=line(p,cam,mix(cam,subject,.22)); color=mix(color,vec3f(1.,.78,.3),1.-smoothstep(.018,.03,nose));
  let vignette=smoothstep(1.25,.35,length(p*.68)); color*=.62+.38*vignette;
  return vec4f(color,1.);
}`;

class CameraMoveRenderer {
  supported = false;
  private device: any = null;
  private pipeline: any = null;
  private format: any = null;
  private entries = new Set<CanvasEntry>();
  private frame = 0;
  private startedAt = performance.now();
  private initializing: Promise<void> | null = null;

  async init() {
    if (this.supported) return;
    if (this.initializing) return this.initializing;
    this.initializing = this.setup();
    return this.initializing;
  }

  private async setup() {
    const gpu = (navigator as any).gpu;
    if (!gpu) return;
    const adapter = await gpu.requestAdapter();
    if (!adapter) return;
    this.device = await adapter.requestDevice();
    this.format = gpu.getPreferredCanvasFormat();
    const module = this.device.createShaderModule({ code: shader });
    this.pipeline = this.device.createRenderPipeline({
      layout: 'auto', vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fs', targets: [{ format: this.format }] },
      primitive: { topology: 'triangle-list' }
    });
    this.supported = true;
    this.frame = requestAnimationFrame((time) => this.render(time));
  }

  register(canvas: HTMLCanvasElement, type: number) {
    if (!this.supported) return null;
    const context = canvas.getContext('webgpu') as any;
    if (!context) return null;
    context.configure({ device: this.device, format: this.format, alphaMode: 'opaque' });
    const uniform = this.device.createBuffer({ size: 16, usage: (globalThis as any).GPUBufferUsage.UNIFORM | (globalThis as any).GPUBufferUsage.COPY_DST });
    const bindGroup = this.device.createBindGroup({ layout: this.pipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: uniform } }] });
    const entry: CanvasEntry = { canvas, context, uniform, bindGroup, type, active: true };
    this.entries.add(entry);
    return entry;
  }

  setActive(entry: CanvasEntry | null, active: boolean) { if (entry) entry.active = active; }
  unregister(entry: CanvasEntry | null) { if (entry) { this.entries.delete(entry); entry.uniform.destroy(); } }

  private render(time: number) {
    const seconds = (time - this.startedAt) / 1000;
    const encoder = this.device.createCommandEncoder();
    let drew = false;
    for (const entry of this.entries) {
      if (!entry.active) continue;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(entry.canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(entry.canvas.clientHeight * ratio));
      if (entry.canvas.width !== width || entry.canvas.height !== height) { entry.canvas.width = width; entry.canvas.height = height; }
      this.device.queue.writeBuffer(entry.uniform, 0, new Float32Array([seconds, entry.type, width / height, 0]));
      const pass = encoder.beginRenderPass({ colorAttachments: [{ view: entry.context.getCurrentTexture().createView(), clearValue: { r: .02, g: .02, b: .024, a: 1 }, loadOp: 'clear', storeOp: 'store' }] });
      pass.setPipeline(this.pipeline); pass.setBindGroup(0, entry.bindGroup); pass.draw(3); pass.end(); drew = true;
    }
    if (drew) this.device.queue.submit([encoder.finish()]);
    this.frame = requestAnimationFrame((next) => this.render(next));
  }
}

export const cameraMoveRenderer = new CameraMoveRenderer();
