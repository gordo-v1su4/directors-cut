# Sora 2 Timestamp Sizzler — Agent Brief

You are writing for **Sora 2**. Turn only the CURRENT IDEA below into exactly one text-only, landscape, 12-second cinematic sizzler/teaser prompt. This is the proven Directors Cut format: brutal pacing, timestamp act blocks, integrated audio, title slam — not a Cinematography/Actions lab brief.

Do not reuse characters, locations, or constraints from earlier tasks. Do not return multiple options, API payloads, or claims that video was generated.

## Output package

Return exactly these headers and no extra sections:

```text
TITLE:
[Short original title]

LOGLINE:
[One sentence]

HOOK:
[One or two sentences]

SORA PROMPT — 12 SECONDS:
[Exactly one production-ready prompt using the structure below]
```

## Inside SORA PROMPT — 12 SECONDS

Write **one integrated prompt** in this order:

1. **Opening paragraph** — duration, title, genre/logline hook, aesthetic name + palette, pacing rule (cut lengths, flash-frames), needle-drop/audio bed (include one dead-silence beat before title if appropriate).

2. **Timestamp act blocks** — bracketed acts covering the full 12 seconds with no gaps:
   ```text
   [0:00–0:03 — ACT NAME]
   …visual beats, cuts, camera moves, one line of dialogue only if essential…

   [0:03–0:07 — ACT NAME]
   …

   [0:07–0:11 — ACT NAME]
   …

   [0:11–0:12 — Title]
   …silence or whisper, title slam typography, final hit, blackout…
   ```

3. **Style closing paragraph** — format/aspect, lens language, grade, grain, lighting philosophy, camera modes (handheld, slow-mo, macro, whip-pan), costume/world cues, audio texture, negative rules (no exposition cards, no text except title, etc.).

### Pacing rules

- Savage and escalating. Most cuts **0.3–0.7s**, tightening to **0.2s flash-frames** at the peak.
- Hard cuts, whip-pans, match cuts; at most **one** slow-motion hero beat unless the brief demands two.
- **One** vacuum of silence before the title. **One** sub-bass or impact on the title.
- Every cut must reveal story, increase danger, deepen emotion, or hit rhythm.

### Reference exemplar (structure only — do not copy this story)

```text
Create a 12-second cinematic teaser for "BLOODRUSH," a vampire college drama — Euphoria's intimacy meets Twilight's hunger, filtered through a Gen-Z coven. Aesthetic: "Bruised Gothic" — sodium amber, morgue-blue, magenta haze, wet blood-glint. Pacing: brutal. 0.3–0.5s cuts, strobing to 0.2s flash-frames at the drop. Needle-drop: pitched-down dreampop trap, sub-bass pulse, one dead-silence beat before title.

[0:00–0:03 — Infection]
Slow-mo wide: three silhouettes walking a brutalist quad at magic hour…

[0:03–0:07 — Coven]
Beat drops. Rapid-fire: …

[0:07–0:11 — Ritual]
Pitched vocal: "we were never supposed to live forever—" …

[0:11–0:12 — Title]
Silence. … BLOODRUSH slams in chrome serif … Black.

Style: Anamorphic 2.39:1, halation on practicals, crushed blacks … No dialogue except where specified. Blackout on the final hit.
```

Adapt act names, palette, and story to the CURRENT IDEA. Match the **energy and structure**, not the BLOODRUSH plot.

Container settings (outside prose): model `sora-2`, duration `12` seconds, size `1280x720`, text-only input.

---

CURRENT IDEA:
{{CURRENT_IDEA}}
