<script lang="ts">
  import type { ComparisonArtifact } from '$lib/types/comparison';

  let {
    artifacts,
    onselect,
  }: {
    artifacts: ComparisonArtifact[];
    onselect: (artifact: ComparisonArtifact) => void;
  } = $props();

  let reel: HTMLElement | null = $state(null);

  /** Ids of clips currently playing, so the play glyph can step aside. */
  let playingIds = $state(new Set<string>());

  function markPlaying(id: string, isPlaying: boolean) {
    const next = new Set(playingIds);
    if (isPlaying) next.add(id);
    else next.delete(id);
    playingIds = next;
  }

  /**
   * Scroll-driven preview: the single most-visible clip plays muted and the
   * rest rewind. This replaces the desktop hover preview, which touch never
   * fires, and keeps exactly one video decoding at a time on a phone.
   */
  $effect(() => {
    if (!reel || typeof IntersectionObserver === 'undefined') return;

    const reduceMotion =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ratios = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let leader: Element | null = null;
        let best = 0.6; // must be mostly on screen to take over
        for (const [frame, ratio] of ratios) {
          if (ratio > best) {
            best = ratio;
            leader = frame;
          }
        }

        for (const frame of ratios.keys()) {
          const video = frame.querySelector('video');
          if (!video) continue;
          if (frame === leader) {
            void video.play().catch(() => {});
          } else if (!video.paused) {
            video.pause();
            video.currentTime = 0;
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] },
    );

    for (const frame of reel.querySelectorAll('.dc-reel-frame')) {
      observer.observe(frame);
    }

    return () => observer.disconnect();
  });
</script>

<div class="dc-reel" bind:this={reel}>
  {#each artifacts as item (item.artifact_id)}
    <button class="dc-reel-item" onclick={() => onselect(item)}>
      <div class="dc-reel-frame">
        {#if item.media_url}
          <video
            src={item.media_url}
            poster={item.thumbnail_url ?? undefined}
            preload="metadata"
            muted
            loop
            playsinline
            disablepictureinpicture
            aria-label={item.title}
            onplay={() => markPlaying(item.artifact_id, true)}
            onpause={() => markPlaying(item.artifact_id, false)}
          ><track kind="captions" /></video>
        {:else if item.thumbnail_url}
          <img src={item.thumbnail_url} alt={item.title} loading="lazy" />
        {/if}
        {#if !playingIds.has(item.artifact_id)}
          <span class="dc-reel-play" aria-hidden="true">
            <span><svg viewBox="0 0 24 24"><path d="M9 7.5v9l8-4.5-8-4.5Z" /></svg></span>
          </span>
        {/if}
        <span class="dc-reel-badge">Tap for sound</span>
      </div>
      <div class="dc-reel-copy">
        <div class="dc-reel-title">{item.title}</div>
        <div class="dc-reel-meta">
          {item.provider.replace(/_/g, ' ')} · {item.artifact_type.replace(/_/g, ' ')}
        </div>
      </div>
    </button>
  {/each}
</div>
