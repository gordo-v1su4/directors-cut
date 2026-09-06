<script lang="ts">
  import type { ComparisonArtifact } from '$lib/types/comparison';

  let { artifact, onClose }: { artifact: ComparisonArtifact; onClose: () => void } = $props();
  let video: HTMLVideoElement | null = $state(null);
  let duration = $state(0);
  let currentTime = $state(0);
  let playing = $state(false);
  let muted = $state(true);

  /** Vertical drag offset while the sheet is being swiped away. */
  let dragY = $state(0);
  let dragging = $state(false);
  let dragStartY = 0;

  const progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

  const DISMISS_DISTANCE = 110;

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

  /**
   * Swipe-down-to-dismiss on the sheet header. Only the header is draggable so
   * the scrubber and the video surface keep their own gestures.
   */
  function onDragStart(event: PointerEvent) {
    if (event.pointerType === 'mouse') return;
    dragging = true;
    dragStartY = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onDragMove(event: PointerEvent) {
    if (!dragging) return;
    dragY = Math.max(0, event.clientY - dragStartY);
  }

  function onDragEnd() {
    if (!dragging) return;
    dragging = false;
    if (dragY > DISMISS_DISTANCE) onClose();
    else dragY = 0;
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
  <div
    class="dc-hover-player"
    class:dc-dragging={dragging}
    style={`--drag-y: ${dragY}px`}
    role="dialog"
    aria-modal="true"
    aria-label={`Video preview: ${artifact.title}`}
  >
    <header
      class="dc-hover-player-header"
      role="presentation"
      onpointerdown={onDragStart}
      onpointermove={onDragMove}
      onpointerup={onDragEnd}
      onpointercancel={onDragEnd}
    >
      <div class="dc-sheet-grip" aria-hidden="true"></div>
      <div class="dc-hover-player-copy">
        <p class="dc-hover-player-kicker">Video preview</p>
        <h2>{artifact.title}</h2>
        <p class="dc-hover-player-meta">
          {artifact.provider.replace(/_/g, ' ')} · {artifact.artifact_type.replace(/_/g, ' ')}
        </p>
      </div>
      <button class="dc-hover-player-close" onclick={onClose} aria-label="Close preview">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </header>

    <div class="dc-hover-player-stage">
      <video
        bind:this={video}
        src={artifact.media_url}

        autoplay
        muted
        playsinline
        onclick={togglePlayback}
        onloadedmetadata={() => {
          if (video) duration = video.duration;
        }}
        ontimeupdate={() => {
          if (video) currentTime = video.currentTime;
        }}
        onplay={() => (playing = true)}
        onpause={() => (playing = false)}
      ><track kind="captions" /></video>

      {#if !playing}
        <button class="dc-stage-play" onclick={togglePlayback} aria-label="Play video">
          <span class="dc-stage-play-bar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.5v9l8-4.5-8-4.5Z" /></svg>
          </span>
        </button>
      {/if}

      {#if muted}
        <!-- Autoplay must start muted, so unmuting needs its own obvious tap
             target on touch — the header control is too small to find. -->
        <button class="dc-unmute" onclick={toggleMute}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z" /></svg>
          Tap for sound
        </button>
      {/if}
    </div>

    <div class="dc-hover-player-controls">
      <button
        class="dc-transport"
        onclick={togglePlayback}
        aria-label={playing ? 'Pause video' : 'Play video'}
      >
        {#if playing}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6h3v12H7V6Zm7 0h3v12h-3V6Z" /></svg>
        {:else}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.5v9l8-4.5-8-4.5Z" /></svg>
        {/if}
      </button>

      <div class="dc-scrubber-wrap" style={`--progress: ${progress}%`}>
        <div class="dc-scrubber-row">
          <span class="dc-timecode">{formatTime(currentTime)}</span>
          <input
            class="dc-scrubber"
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={currentTime}
            oninput={scrub}
            aria-label="Video timeline"
          />
          <span class="dc-timecode">{formatTime(duration)}</span>
        </div>
      </div>

      <button class="dc-audio-control" onclick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
        {#if muted}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Zm11.5 3a4.5 4.5 0 0 0-2.1-3.8v7.6a4.5 4.5 0 0 0 2.1-3.8ZM16 7.5v9a7 7 0 0 1 0-9Z" /></svg>
        {:else}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z" /></svg>
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .dc-hover-player-backdrop {
    position: fixed;
    inset: 0;
    z-index: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right))
      max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
    background: rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(12px) saturate(0.85);
    animation: backdrop-in 0.16s ease-out;
  }

  .dc-hover-player {
    width: min(900px, 100%);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--dc-radius);
    background: #0a0a0c;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
    animation: player-in 0.18s ease-out;
  }

  .dc-hover-player-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--dc-border-subtle);
  }

  .dc-hover-player-copy {
    min-width: 0;
  }

  .dc-hover-player-kicker {
    margin: 0;
    color: var(--dc-text-dim);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    line-height: 1;
  }

  .dc-hover-player-header h2 {
    margin: 4px 0 0;
    color: var(--dc-text);
    font-size: 13px;
    font-weight: 650;
    line-height: 1.25;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dc-hover-player-meta {
    margin: 2px 0 0;
    color: var(--dc-text-dim);
    font-size: 10px;
    line-height: 1.2;
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dc-hover-player-close {
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--dc-border);
    border-radius: var(--dc-radius);
    background: rgba(255, 255, 255, 0.02);
    color: var(--dc-text-muted);
    cursor: pointer;
  }

  .dc-hover-player-close svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  .dc-hover-player-stage {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #000;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    cursor: pointer;
  }

  .dc-stage-play {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border: 0;
    background: rgba(0, 0, 0, 0.18);
    cursor: pointer;
  }

  .dc-stage-play-bar {
    display: grid;
    place-items: center;
    height: 22px;
    min-width: 52px;
    padding: 0 16px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: var(--dc-radius);
    background: rgba(0, 0, 0, 0.72);
  }

  .dc-stage-play-bar svg {
    width: 10px;
    height: 10px;
    fill: rgba(255, 255, 255, 0.92);
  }

  .dc-hover-player-controls {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: 10px 12px 12px;
    border-top: 1px solid var(--dc-border-subtle);
  }

  .dc-transport,
  .dc-audio-control {
    display: grid;
    place-items: center;
    height: 24px;
    padding: 0 10px;
    border: 1px solid var(--dc-border);
    border-radius: var(--dc-radius);
    background: var(--dc-bg-elev);
    color: var(--dc-text);
    cursor: pointer;
  }

  .dc-transport {
    min-width: 36px;
  }

  .dc-audio-control {
    width: 36px;
    padding: 0;
  }

  .dc-transport svg,
  .dc-audio-control svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }

  .dc-scrubber-wrap {
    min-width: 0;
  }

  .dc-scrubber-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
  }

  .dc-timecode {
    min-width: 34px;
    color: var(--dc-text-dim);
    font-family: var(--dc-font-mono);
    font-size: 10px;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .dc-scrubber-row .dc-timecode:last-child {
    text-align: right;
  }

  .dc-scrubber {
    width: 100%;
    height: 28px;
    margin: 0;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }

  .dc-scrubber::-webkit-slider-runnable-track {
    height: 3px;
    border-radius: var(--dc-radius);
    background: linear-gradient(
      to right,
      #fafafa 0%,
      #fafafa var(--progress, 0%),
      rgba(255, 255, 255, 0.14) var(--progress, 0%),
      rgba(255, 255, 255, 0.14) 100%
    );
  }

  .dc-scrubber::-moz-range-track {
    height: 3px;
    border-radius: var(--dc-radius);
    background: rgba(255, 255, 255, 0.14);
  }

  .dc-scrubber::-moz-range-progress {
    height: 3px;
    border-radius: var(--dc-radius);
    background: #fafafa;
  }

  .dc-scrubber::-webkit-slider-thumb {
    width: 8px;
    height: 12px;
    margin-top: -4.5px;
    appearance: none;
    border: 0;
    border-radius: var(--dc-radius);
    background: #fafafa;
    box-shadow: none;
  }

  .dc-scrubber::-moz-range-thumb {
    width: 8px;
    height: 12px;
    border: 0;
    border-radius: var(--dc-radius);
    background: #fafafa;
    box-shadow: none;
  }

  @keyframes backdrop-in {
    from {
      opacity: 0;
    }
  }

  @keyframes player-in {
    from {
      opacity: 0;
      transform: translateY(6px) scale(0.99);
    }
  }

  /* Drag handle and unmute pill are touch-only affordances. */
  .dc-sheet-grip,
  .dc-unmute {
    display: none;
  }

  @media (max-width: 860px) {
    .dc-hover-player-backdrop {
      align-items: flex-end;
      padding: 0;
      background: rgba(0, 0, 0, 0.82);
    }

    .dc-hover-player {
      width: 100%;
      max-height: 100dvh;
      border-radius: 16px 16px 0 0;
      border-left: 0;
      border-right: 0;
      border-bottom: 0;
      /* Follows the finger during a swipe-to-dismiss. */
      transform: translateY(var(--drag-y, 0px));
      transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
      touch-action: pan-y;
    }

    .dc-hover-player.dc-dragging {
      transition: none;
    }

    .dc-hover-player-header {
      position: relative;
      padding: 16px 14px 12px;
      cursor: grab;
      touch-action: none;
    }

    .dc-sheet-grip {
      display: block;
      position: absolute;
      top: 7px;
      left: 50%;
      width: 38px;
      height: 4px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.28);
      transform: translateX(-50%);
    }

    .dc-hover-player-header h2 {
      font-size: 15px;
    }

    .dc-hover-player-meta {
      font-size: 12px;
    }

    .dc-hover-player-close {
      width: var(--dc-tap);
      height: var(--dc-tap);
      border-radius: 999px;
    }

    .dc-hover-player-close svg {
      width: 18px;
      height: 18px;
    }

    .dc-stage-play-bar {
      height: 60px;
      min-width: 60px;
      padding: 0;
      border-radius: 50%;
    }

    .dc-stage-play-bar svg {
      width: 24px;
      height: 24px;
    }

    .dc-unmute {
      display: inline-flex;
      position: absolute;
      right: 12px;
      bottom: 12px;
      align-items: center;
      gap: 7px;
      min-height: 40px;
      padding: 0 14px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.68);
      backdrop-filter: blur(8px);
      color: #fafafa;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .dc-unmute svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .dc-hover-player-controls {
      gap: 12px;
      padding: 12px 14px;
      padding-bottom: max(14px, var(--dc-safe-b));
    }

    .dc-transport,
    .dc-audio-control {
      height: var(--dc-tap);
      border-radius: 999px;
    }

    .dc-transport { min-width: var(--dc-tap); }
    .dc-audio-control { width: var(--dc-tap); }

    .dc-transport svg,
    .dc-audio-control svg {
      width: 17px;
      height: 17px;
    }

    .dc-timecode { font-size: 12px; min-width: 40px; }

    /* A finger needs a bigger grab area than a mouse pointer. */
    .dc-scrubber { height: 40px; }
    .dc-scrubber::-webkit-slider-runnable-track { height: 5px; }
    .dc-scrubber::-webkit-slider-thumb {
      width: 16px;
      height: 16px;
      margin-top: -5.5px;
      border-radius: 50%;
    }
    .dc-scrubber::-moz-range-track,
    .dc-scrubber::-moz-range-progress { height: 5px; }
    .dc-scrubber::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dc-hover-player-backdrop,
    .dc-hover-player {
      animation: none;
      transition: none;
    }
  }
</style>
