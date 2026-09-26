<script lang="ts">
  import Icon from './Icon.svelte';
  import { toneFor } from '$lib/ui/tones';

  let {
    title,
    fullTitle = title,
    takeLabel,
    writer = '',
    videoModel = '',
    status = '',
    videoUrl = '',
    thumbnailUrl = '',
    isNewest = false,
    playOnHover = false,
    selected = false,
    density = 'full',
    onselect,
  }: {
    title: string;
    fullTitle?: string;
    takeLabel: string;
    writer?: string;
    videoModel?: string;
    status?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    isNewest?: boolean;
    playOnHover?: boolean;
    selected?: boolean;
    density?: 'full' | 'thumb';
    onselect?: () => void;
  } = $props();

  let video = $state<HTMLVideoElement | null>(null);
  let playing = $state(false);
  let duration = $state(0);

  const timecode = $derived(
    duration ? `${Math.floor(duration / 60)}:${String(Math.round(duration % 60)).padStart(2, '0')}` : '',
  );

  function togglePlay(event: MouseEvent) {
    event.stopPropagation();
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
      playing = true;
    } else {
      video.pause();
      playing = false;
    }
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onselect?.();
    }
  }
</script>

<div
  class="clip"
  class:is-selected={selected}
  class:thumb={density === 'thumb'}
  role="button"
  tabindex="0"
  title={fullTitle}
  onclick={() => onselect?.()}
  onkeydown={keydown}
  onmouseenter={() => { if (playOnHover && video) { void video.play().catch(() => {}); playing = true; } }}
  onmouseleave={() => { if (playOnHover && video && !video.paused) { video.pause(); playing = false; } }}
>
  <div class="clip-frame">
    {#if videoUrl}
      <video
        bind:this={video}
        src={videoUrl}
        poster={thumbnailUrl || undefined}
        muted
        playsinline
        loop
        preload="metadata"
        onloadedmetadata={(e) => (duration = e.currentTarget.duration || 0)}
      ></video>
    {:else if thumbnailUrl}
      <img src={thumbnailUrl} alt={title} loading="lazy" />
    {/if}
    <div class="clip-shade" aria-hidden="true"></div>

    <div class="clip-top">
      <span class="clip-top-tags">
        <span class="stag">{takeLabel}</span>
        {#if isNewest}<span class="stag tone-warm">Newest take</span>{/if}
      </span>
      {#if timecode}<span class="clip-time">{timecode}</span>{/if}
    </div>

    {#if density === 'thumb'}
      <div class="clip-bottom-tags">
        {#if writer}<span class="stag tone-{toneFor(writer)}">{writer}</span>{/if}
        {#if videoModel}<span class="stag tone-{toneFor(videoModel)}">{videoModel}</span>{/if}
      </div>
    {:else if videoUrl}
      <div class="clip-actions">
        <button type="button" class="sbtn sbtn-primary" onclick={togglePlay} title={playing ? 'Pause take' : 'Play take'}>
          <Icon name={playing ? 'pause' : 'play'} filled />
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>
      </div>
    {/if}
  </div>

  {#if density === 'full'}
    <div class="clip-body">
      <div class="clip-title-row">
        <span class="t-card">{title}</span>
        {#if status}<span class="stag tone-{toneFor(status)}">{status}</span>{/if}
      </div>
      <div class="clip-tags">
        {#if writer}<span class="stag tone-{toneFor(writer)}">{writer}</span>{/if}
        {#if videoModel}<span class="stag tone-{toneFor(videoModel)}">{videoModel}</span>{/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .clip {
    min-width: 0;
    overflow: hidden;
    border-radius: 8px;
    background: #0e0e0e;
    text-align: left;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s ease;
  }

  .clip:hover {
    background: #161616;
  }

  .clip-frame {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #161616;
  }

  .clip-frame video,
  .clip-frame img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Thumbnails show selection with light: the chosen take is lit, the rest dimmed. */
  .clip.thumb .clip-frame video,
  .clip.thumb .clip-frame img {
    filter: brightness(0.55) saturate(0.8);
    transition: filter 0.2s ease;
  }

  .clip.thumb:hover .clip-frame video,
  .clip.thumb:hover .clip-frame img,
  .clip.thumb.is-selected .clip-frame video,
  .clip.thumb.is-selected .clip-frame img {
    filter: none;
  }

  .clip-shade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 50%, rgba(0, 0, 0, 0.3));
  }

  .clip-top {
    position: absolute;
    top: 10px;
    right: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    pointer-events: none;
  }

  .clip-top-tags,
  .clip-bottom-tags,
  .clip-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .clip-time {
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 8px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.7);
    color: var(--dc-text-muted);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  .clip-bottom-tags {
    position: absolute;
    right: 8px;
    bottom: 8px;
    left: 8px;
    pointer-events: none;
  }

  .clip-actions {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .clip-body {
    padding: 12px;
  }

  .clip-title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
  }

  .clip-tags {
    margin-top: 8px;
  }
</style>
