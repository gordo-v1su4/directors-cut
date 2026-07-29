<script lang="ts">
  import type { ComparisonArtifact } from '$lib/types/comparison';

  let { artifact, onClose }: { artifact: ComparisonArtifact; onClose: () => void } = $props();
  let video: HTMLVideoElement | null = $state(null);
  let duration = $state(0);
  let currentTime = $state(0);
  let playing = $state(false);
  let muted = $state(true);

  function formatTime(value: number) {
    if (!Number.isFinite(value)) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function togglePlayback() {
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function toggleMute() {
    if (!video) return;
    video.muted = !video.muted;
    muted = video.muted;
  }

  function scrub(event: Event) {
    if (!video) return;
    const next = Number((event.currentTarget as HTMLInputElement).value);
    video.currentTime = next;
    currentTime = next;
  }

  function handleBackdrop(event: MouseEvent) {
    if (event.target === event.currentTarget) onClose();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose();
    if (event.key === ' ' && event.target === document.body) {
      event.preventDefault();
      togglePlayback();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="dc-hover-player-backdrop" role="presentation" onclick={handleBackdrop}>
  <div class="dc-hover-player" role="dialog" aria-modal="true" aria-label={`Video preview: ${artifact.title}`}>
    <header>
      <div><span>Video preview</span><h2>{artifact.title}</h2><p>{artifact.provider.replace(/_/g, ' ')} · {artifact.artifact_type.replace(/_/g, ' ')}</p></div>
      <button class="dc-hover-player-close" onclick={onClose} aria-label="Close preview">×</button>
    </header>

    <div class="dc-hover-player-stage">
      <video
        bind:this={video}
        src={artifact.media_url}
        poster={artifact.thumbnail_url}
        autoplay
        muted
        playsinline
        onloadedmetadata={() => { if (video) duration = video.duration; }}
        ontimeupdate={() => { if (video) currentTime = video.currentTime; }}
        onplay={() => playing = true}
        onpause={() => playing = false}
      ><track kind="captions" /></video>
      <button class="dc-stage-toggle" onclick={togglePlayback} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? 'Ⅱ' : '▶'}</button>
    </div>

    <div class="dc-hover-player-controls">
      <button class="dc-play-control" onclick={togglePlayback}>{playing ? 'Pause' : 'Play'}</button>
      <div class="dc-scrubber-wrap">
        <div class="dc-scrubber-keyframes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <input class="dc-scrubber" type="range" min="0" max={duration || 0} step="0.01" value={currentTime} oninput={scrub} aria-label="Video timeline" />
        <div class="dc-timecode"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
      </div>
      <button class="dc-audio-control" onclick={toggleMute}>{muted ? 'Sound on' : 'Mute'}</button>
    </div>
  </div>
</div>

<style>
  .dc-hover-player-backdrop { position: fixed; inset: 0; z-index: 900; display: grid; place-items: center; padding: 28px; background: rgba(0,0,0,.52); backdrop-filter: blur(9px) saturate(.75); animation: backdrop-in .16s ease-out; }
  .dc-hover-player { width: min(900px,92vw); overflow: hidden; border: 1px solid #3f3f46; border-radius: 10px; background: #0c0c0e; box-shadow: 0 28px 90px rgba(0,0,0,.68); animation: player-in .18s ease-out; }
  header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 15px 17px; border-bottom: 1px solid var(--dc-border); }
  header span { color: var(--dc-text-dim); font-size: 8px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
  header h2 { margin: 3px 0 0; color: var(--dc-text); font-size: 14px; font-weight: 650; }
  header p { margin: 3px 0 0; color: var(--dc-text-dim); font-size: 9px; text-transform: capitalize; }
  .dc-hover-player-close { width: 28px; height: 28px; padding: 0; border: 1px solid var(--dc-border); border-radius: 50%; background: transparent; color: var(--dc-text-muted); font-size: 18px; cursor: pointer; }
  .dc-hover-player-stage { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #000; }
  video { width: 100%; height: 100%; object-fit: contain; display: block; }
  .dc-stage-toggle { position: absolute; inset: 0; width: 100%; border: 0; background: transparent; color: transparent; cursor: pointer; }
  .dc-stage-toggle:focus-visible { outline: 1px solid #fafafa; outline-offset: -3px; }
  .dc-hover-player-controls { display: grid; grid-template-columns: 70px minmax(0,1fr) 72px; align-items: start; gap: 14px; padding: 14px 16px 13px; border-top: 1px solid var(--dc-border); }
  .dc-play-control, .dc-audio-control { height: 30px; border: 1px solid var(--dc-border); border-radius: 5px; background: var(--dc-bg-elev-2); color: var(--dc-text); font-size: 9px; cursor: pointer; }
  .dc-scrubber-wrap { position: relative; padding-top: 1px; }
  .dc-scrubber { width: 100%; height: 20px; margin: 0; appearance: none; background: transparent; cursor: ew-resize; }
  .dc-scrubber::-webkit-slider-runnable-track { height: 2px; background: #3f3f46; }
  .dc-scrubber::-webkit-slider-thumb { width: 2px; height: 18px; margin-top: -8px; appearance: none; border: 0; border-radius: 0; background: #fafafa; box-shadow: 0 0 0 3px rgba(250,250,250,.08); }
  .dc-scrubber-keyframes { position: absolute; inset: 6px 1px auto; display: flex; justify-content: space-between; pointer-events: none; }
  .dc-scrubber-keyframes i { width: 1px; height: 7px; background: #52525b; }
  .dc-timecode { display: flex; justify-content: space-between; margin-top: -2px; color: var(--dc-text-dim); font-family: var(--dc-font-mono); font-size: 8px; }
  @keyframes backdrop-in { from { opacity: 0; } }
  @keyframes player-in { from { opacity: 0; transform: translateY(8px) scale(.985); } }
  @media(max-width:620px){.dc-hover-player-backdrop{padding:12px}.dc-hover-player-controls{grid-template-columns:55px minmax(0,1fr);}.dc-audio-control{display:none}}
</style>
