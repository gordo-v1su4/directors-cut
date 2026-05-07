---
style_id: apathetic-chaos-commercial
eval_id: eval-001
kind: quality-rubric
subject: "Quality of the written system prompt (style guide), derived from user feedback"
pass_rate_percent: 76.92
scores:
  content_requirement: "7/10"
  format_requirement: "1/1"
  language_requirement: "1/1"
  technical_requirement: "1/1"
---

# Eval 001 — Style prompt derivation (Apathetic Chaos)

## Summary

| Metric | Result |
|--------|--------|
| **Overall pass rate** | 76.92% |
| **What was graded** | An assistant response that turned discussion into the structured “Apathetic Chaos” system prompt |
| **Content block** | 7 / 10 |
| **Format** | 1 / 1 |
| **Language** | 1 / 1 |
| **Technical (clarity / actionability)** | 1 / 1 |

---

## Creative notes (director feedback)

Verbatim themes from the review session:

- **Dialogue:** Funny, improved; overall positive read.
- **Locations:** Open to wild, loud, very different places; also liked a **home / central** feel in the first version (more rooms in one house). Both directions have merit—don’t treat “only one house” as the only valid read.
- **Core idea — “bold”:** She is a **bold woman** and **world traveler**; visuals are **ridiculously, hilariously bold** things no normal person would do, but **to her it is nothing**. She **does not** talk about what is around her; the gags still orbit **boldness**.
- **Examples that landed:**  
  - “There’s a scorpion in my house and I don’t know where” → ends with scorpion on shoulder, **unacknowledged**.  
  - Feeding a lion in the living room, throwing meat—**never** acknowledged in dialogue.
- **Meta goal:** Package this so another agent (or future you) can pick up a **named director style**: humor, dialogue, randomness, length, speed, rules—like **Old Spice–class** random spec spots, categorized per style.

---

## Content requirement checklist (7 / 10)

| # | Criterion | Verdict | Notes |
|---|-----------|---------|-------|
| 1 | Style elements derived **only** from user’s stated feedback/examples | Partial | Prompt added specifics the user did not literally say (e.g. deadpan British delivery, posh accent, hyper-wealthy grievances, campaign naming). Reasonable extrapolation but not **exclusive** to their words. |
| 2 | Reflects preferred **setting / location** style | Pass | Captures appetite for **very different** locations; rubric notes tension with earlier “more in her home” preference (see creative notes). |
| 3 | **Jarring cuts** between vastly different locations | Pass | Explicit “jarring, unmotivated cuts” and extreme examples (e.g. library → tundra) match request. |
| 4 | **Random / absurd / ridiculously bold**; **Old Spice** lineage | Pass | Surrealist comedy, bizarre action, random structure; Old Spice referenced. |
| 5 | **Stories / scenarios**: bold traveler; bizarre events; **no acknowledgment** | Pass | Bold woman / traveler; lion, scorpion-class beats; “never acknowledges visuals” encoded. |
| 6 | **Randomness** as a defining feature | Pass | Choppy dialogue, random tangents, random final sign-off called out. |
| 7 | **Wittiness** highlighted explicitly | Gap | User asked for wittiness; final prompt never uses “witty” / clear synonym **as its own pillar**. |
| 8 | Identifies a **director-style** repeatable commercial voice | Pass | Presented as explicit style guide with durable rules. |
| 9 | **Humor**: understated absurdity / indifference | Pass | Rule of disconnect + ignoring final visual punchline match intent. |
| 10 | **Rules buckets** include length, speed, wittiness, randomness | Partial | Length, pacing, randomness covered; **wittiness not a named category** despite ask. |
| 11 | Dialogue feels **funny / strong / impactful** | Pass | “Hilarious” and structured delivery imply intended comic impact. |

---

## Format requirement (1 / 1)

**Verdict:** Pass.

Clear **SYSTEM PROMPT** framing: role, campaign, protagonist, numbered rules, script formatting block—appropriate for handing off to another agent.

---

## Language requirement (1 / 1)

**Verdict:** Pass.

Fully in English.

---

## Technical requirement (1 / 1)

**Verdict:** Pass.

Concrete constraints (word count, pacing rules, beats, forbidden actions). Actionable structure for replication.

---

## Follow-ups for prompt revision (from this eval)

1. Add an explicit **wittiness** line item (delivery / dialogue density / wordplay)—either a rule bullet or rubric-aligned subsection.  
2. Optionally add a **location strategy** note: e.g. allow **sequences that stay in one bold “mega-home”** as well as **hard location jumps**, so generators do not always interpret “cuts” as “never at home.”  
3. Where details are **invention** (accent, wealth flavor, campaign name), mark them as **defaults** vs **locked user requirements** so the next editor knows what can change.
