/**
 * Reactive media queries.
 *
 * CSS handles nearly all of the responsive work, but a phone should not *load*
 * desktop-only media just to hide it — `display: none` still lets the browser
 * fetch video metadata. Use this to keep those trees out of the DOM.
 */
export function mediaQuery(query: string) {
  let matches = $state(
    typeof matchMedia === 'undefined' ? false : matchMedia(query).matches,
  );

  $effect(() => {
    if (typeof matchMedia === 'undefined') return;
    const list = matchMedia(query);
    const update = () => (matches = list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  });

  return {
    get matches() {
      return matches;
    },
  };
}

/** Matches the `861px` breakpoint the stylesheet uses to switch to desktop. */
export function isDesktop() {
  return mediaQuery('(min-width: 861px)');
}
