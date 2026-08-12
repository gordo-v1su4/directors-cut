<script lang="ts">
  import { onMount } from 'svelte';
  import { cameraMoveRenderer } from '$lib/webgpu/camera-move-renderer';

  let { type, label }: { type: number; label: string } = $props();
  let canvas: HTMLCanvasElement;
  let unavailable = $state(false);

  onMount(() => {
    let disposed = false;
    let entry: ReturnType<typeof cameraMoveRenderer.register> = null;
    let observer: IntersectionObserver | null = null;

    void (async () => {
      if (!cameraMoveRenderer.supported) await cameraMoveRenderer.init();
      if (disposed) return;
      if (!cameraMoveRenderer.supported) { unavailable = true; return; }
      entry = cameraMoveRenderer.register(canvas, type);
      observer = new IntersectionObserver(([item]) => cameraMoveRenderer.setActive(entry, item.isIntersecting), { rootMargin: '120px' });
      observer.observe(canvas);
    })();

    return () => {
      disposed = true;
      observer?.disconnect();
      cameraMoveRenderer.unregister(entry);
    };
  });
</script>

<div class="move-canvas-wrap">
  <canvas bind:this={canvas} aria-label={`${label} animated camera path`}></canvas>
  {#if unavailable}<div class="move-canvas-fallback">WebGPU preview unavailable</div>{/if}
  <div class="move-canvas-key"><span class="camera-dot"></span> camera <span class="subject-dot"></span> subject</div>
</div>

<style>
  .move-canvas-wrap { position: relative; aspect-ratio: 16/9; overflow: hidden; background: #070709; }
  canvas { width: 100%; height: 100%; display: block; }
  .move-canvas-fallback { position: absolute; inset: 0; display: grid; place-items: center; color: var(--dc-text-dim); font-size: 10px; }
  .move-canvas-key { position: absolute; right: 8px; bottom: 7px; display: flex; align-items: center; gap: 5px; padding: 3px 6px; border: 1px solid rgba(255,255,255,.08); border-radius: 999px; background: rgba(0,0,0,.56); color: #71717a; font-size: 8px; text-transform: uppercase; }
  .camera-dot,.subject-dot { width: 5px; height: 5px; border-radius: 50%; background: #f59e0b; }.subject-dot{background:#e4e4e7;margin-left:3px}
</style>
