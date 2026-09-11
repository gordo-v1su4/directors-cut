# Directors Cut media direction

## Work carousel

- The dashboard carousel represents one project per slide. Switching projects must preserve the same key-art and detail-panel footprint so the page does not jump vertically.
- Key art and media thumbnails use a **16:9** frame. Images and videos crop with `object-fit: cover`; generated media should be preferred over placeholder art.
- The empty key-art state uses the same sans-serif interface type as the `Answers collected` status and project copy, with restrained uppercase tracking only for the label.
- Long project titles stay on one line in the carousel heading and truncate with an ellipsis. Full creative briefs and long summaries remain in the comparison table rather than expanding the dashboard card.
- Actions are compact: the comparison-table link is primary, while version browsing stays secondary and opens the project media viewer.

## Responsive behavior

- Desktop uses a stable 390px workstage height with a wide 16:9 key-art region and a fixed-width detail panel.
- Mobile stacks the key art above a detail panel, keeps the key-art ratio at 16:9, and uses touch-sized carousel controls without introducing page-wide horizontal overflow.
- The latest media feed may scroll horizontally on mobile; each item remains a 16:9 preview.

## Navigation

Sources and Techniques are intentionally hidden from the shared navigation for now. Their routes and data remain available for a later workspace release.
