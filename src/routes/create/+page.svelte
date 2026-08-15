<script lang="ts">
  let projectTitle = $state('');
  let idea = $state('');
  let format = $state('trailer');
  let duration = $state('12');
  let targetSora = $state(true);
  let includeAudio = $state(true);
  let referenceName = $state('');
  let referenceUrl = $state('');
  let request = $state('');
  let copied = $state(false);
  let sampleIndex = $state(0);
  let sampleSource = $state('');

  const SAMPLE_PROMPTS = [
    {
      family: 'seedance',
      source: 'Seedance Supernatural Teaser Pattern',
      format: 'trailer',
      duration: '12',
      text: '12-second premium streaming teaser, 16:9, cinematic thriller grade. 0-3s: an isolated cliffside hotel glows beneath an incoming storm as rain moves sideways across an empty terrace and distant thunder rolls. 3-6s: slow push toward a woman in silver eveningwear facing a dark window; her reflection turns toward camera half a beat before she does. 6-9s: a crack races through the pane, every light cuts out, and a red handprint appears on the inside with one sharp bass impact. 9-12s: smash cut to black; AFTER CHECKOUT slams into frame in elegant chrome serif type as the thunder decays into silence. No extra logos, no subtitles, no watermark.'
    },
    {
      family: 'seedance',
      source: 'Seedance Beat-Sync MV Trio',
      format: 'music video',
      duration: '10',
      text: '10-second vertical fashion music video, 9:16, beat-synced cuts and one deep-red color grade. 0-1s: three dancers hold still beneath a flickering gas-station canopy as the first kick lands. 1-3s: medium close-up on the lead snapping open a chrome fan while the camera punches forward on the beat. 3-5s: wide formation change across rain-black pavement, coats and puddle reflections hitting every kick. 5-7s: insert of boots striking water in crisp rhythmic splashes. 7-10s: crane up to reveal the full neon forecourt; the trio freezes on the last beat as the track ends with a metallic shutter hit. No text or watermark.'
    },
    {
      family: 'sora',
      source: 'Sora World-Simulator Physics Loop',
      format: 'visual concept',
      duration: '8',
      text: 'An 8-second physically coherent tabletop world inside a dark watchmaker’s studio. A miniature glass city rests inside an open silver pocket watch. Warm steam from a nearby espresso cup drifts across the city, condensing on the towers and gathering into droplets that run down the streets like rivers. The camera makes one slow macro orbit while gears beneath the city turn, streetlights flicker in response, and loose paper fibers lift naturally in the warm air. Amber task lighting and deep black shadows define the scene. In the final second, the largest droplet rolls back into its starting position for a seamless loop. Natural room tone, tiny gear clicks, and soft steam hiss.'
    },
    {
      family: 'sora',
      source: 'Sora Audio-First Micro Documentary',
      format: 'short film scene',
      duration: '15',
      text: 'A 15-second observational documentary scene inside a family-run neon-sign workshop before sunrise. Audio leads from the first frame: transformer hum, rain tapping the skylight, glass tubing clinking, and the short hiss of a blue flame timed exactly to the artisan’s hands. The camera begins wide among stacked signs, moves into a shoulder-level tracking shot as she bends a glowing pink tube, then ends on a macro view of the finished letter flickering alive. Moist concrete, worn tools, realistic handheld movement, cool window light mixed with magenta neon. A calm voice says, “You can hear when the glass is ready.” No subtitles.'
    },
    {
      family: 'both',
      source: 'Netflix Teaser — Seedance vs Sora Comparison',
      format: 'trailer',
      duration: '12',
      text: 'Create a 12-second supernatural-thriller teaser set in a luxury coastal hotel during a hurricane evacuation. Begin with an empty chandelier swaying over a flooded lobby, move to a young concierge noticing that every security monitor shows the same unknown guest, then hit one impossible action as all elevator doors open onto black ocean water. End on a hard title reveal: CHECKOUT, centered against wet brushed steel. Premium but unnerving realism, restrained camera movement, cyan emergency light against warm practicals, escalating wind and electrical hum, one moment of total silence before the title impact. Produce a structured timed version for Seedance and a fluid natural-language cinematic version for Sora.'
    }
  ];

  function useSamplePrompt() {
    const family = targetSora ? 'sora' : 'both';
    const eligible = SAMPLE_PROMPTS.filter((sample) => sample.family === family);
    const pool = eligible.length ? eligible : SAMPLE_PROMPTS;
    const sample = pool[sampleIndex % pool.length];
    idea = sample.text;
    sampleSource = sample.source;
    format = sample.format;
    duration = sample.duration;
    sampleIndex += 1;
    request = '';
  }

  function handleReference(event: Event) {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    if (referenceUrl) URL.revokeObjectURL(referenceUrl);
    referenceName = file.name;
    referenceUrl = URL.createObjectURL(file);
  }

  function prepareRequest() {
    request = `PROJECT TITLE
${projectTitle.trim()}

CREATIVE BRIEF
Develop two independent premium ${format} concepts from this idea for a young-adult audience. ChatGPT and Claude will each receive the same brief through Raycast.

${idea.trim()}

DELIVERY
- Exactly one open-ended, high-paced ${duration}-second Sora sizzler prompt per model
- The writing, imagery, action, sound, music, rhythm, and title impact are one integrated video prompt
- World-building may be slightly futuristic, fantasy, period, or pre-AI 2000s when it serves the concept
- Prioritize an immediate hook, emotional discovery, and a sharp plot-turn payoff${includeAudio ? '\n- Include intentional audio, music, ambience, dialogue, and SFX direction inside the prompt' : ''}
- Do not return a shot list, multiple prompt options, or claim a video was generated
${referenceName ? `- Visual reference selected locally: ${referenceName}. Use only its visible composition, character, product, or style cues; do not invent unseen details.` : '- No visual reference supplied.'}

RAYCAST WORKFLOW
Run “Start Directors Cut Concept Run.” Enter the project title as argument 1 and leave argument 2 blank to use this copied brief. The command saves the project, rebuilds the Projects index, and copies the canonical prompt for ChatGPT; capture ChatGPT, then repeat with Claude.`;
    copied = false;
  }

  async function copyRequest() {
    await navigator.clipboard.writeText(request);
    copied = true;
  }
</script>

<svelte:head><title>Create — Directors Cut</title></svelte:head>

<div class="dc-create-page">
  <div class="dc-create-shell">
    <header class="dc-create-header">
      <div><p class="dc-eyebrow">New prompt project</p><h1>What do you want to make?</h1></div>
      <p>Start with a rough idea, paste a detailed treatment, or use the wand for an editable example from the Directors Cut prompt library.</p>
    </header>

    <section class="dc-create-form">
        <label class="dc-field">
          <span>Project title</span>
          <input class="dc-text-input" bind:value={projectTitle} placeholder="Festival After Midnight" />
        </label>

        <div class="dc-field dc-field-idea">
          <div class="dc-field-heading"><label for="creative-idea">Creative idea</label><button class="dc-wand" type="button" onclick={useSamplePrompt} aria-label="Use a sample prompt from the library" title="Use a library sample"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4 5 5L8.5 20.5a2.1 2.1 0 0 1-3 0l-2-2a2.1 2.1 0 0 1 0-3L15 4Zm-1 3 3 3M6 3v3M4.5 4.5h3M19 15v4M17 17h4M18 2v2M17 3h2"/></svg><span>Try an example</span></button></div>
          <div class="dc-idea-wrap"><textarea id="creative-idea" bind:value={idea} rows="8" placeholder="A 15-second fashion trailer in a rain-soaked motel. One woman, electric-blue light, uneasy handheld camera, ending on a hard title reveal..."></textarea></div>
          {#if sampleSource}<span class="dc-sample-source">Adapted from <strong>{sampleSource}</strong> · click the wand again for another</span>{/if}
        </div>

        <div class="dc-create-options">
          <label class="dc-field"><span>Output</span><select bind:value={format}><option value="trailer">Trailer / teaser</option><option value="music video">Music video</option><option value="commercial">Commercial</option><option value="short film scene">Short film scene</option><option value="visual concept">Visual concept</option></select></label>
          <label class="dc-field"><span>Duration</span><select bind:value={duration} disabled><option value="12">12 seconds</option></select></label>
        </div>

        <fieldset class="dc-targets">
          <legend>First vertical slice</legend>
          <label><input type="checkbox" bind:checked={targetSora} disabled /> <span><strong>Sora · 12 seconds</strong><small>ChatGPT and Claude each develop one independent concept through Raycast</small></span></label>
          <label><input type="checkbox" bind:checked={includeAudio} /> <span><strong>Integrated sound</strong><small>Music, ambience, dialogue, rhythm, and SFX stay inside the video prompt</small></span></label>
        </fieldset>

        <label class="dc-reference-drop">
          <input type="file" accept="image/*" onchange={handleReference} />
          {#if referenceUrl}<img src={referenceUrl} alt="Selected visual reference" /><div><strong>{referenceName}</strong><span>Reference stays local until a prompt-agent connection is added.</span></div>{:else}<div class="dc-reference-icon">+</div><div><strong>Add a visual reference</strong><span>Character, product, location, frame, or mood image</span></div>{/if}
        </label>

        <div class="dc-submit-row"><button class="dc-prepare-button" disabled={!projectTitle.trim() || !idea.trim()} onclick={prepareRequest}>Prepare Raycast concept run</button><div class="dc-connection-note"><span class="dc-status-dot"></span><span>Next: copy the brief and run “Start Directors Cut Concept Run” in Raycast. It saves the project and rebuilds the Projects index before either model answer is captured.</span></div></div>
    </section>

    {#if request}
      <section class="dc-request-panel">
        <div class="dc-request-header"><div><span class="dc-column-kicker">Ready for Raycast</span><h2>Canonical concept brief</h2></div><button onclick={copyRequest}>{copied ? 'Copied' : 'Copy for Raycast'}</button></div>
        <pre>{request}</pre>
      </section>
    {/if}
  </div>
</div>

<style>
  .dc-create-page { height: 100%; overflow-y: auto; padding: 34px clamp(18px,4vw,52px) 52px; }
  .dc-create-shell { max-width: 860px; margin: 0 auto; }
  .dc-create-header { padding-bottom: 25px; border-bottom: 1px solid var(--dc-border); }
  .dc-create-header h1 { margin: 0; font-size: clamp(30px,5vw,48px); letter-spacing: -.05em; line-height: 1; }
  .dc-create-header > p { max-width: 650px; margin: 14px 0 0; color: var(--dc-text-muted); font-size: 12px; line-height: 1.6; }
  .dc-create-form { display: flex; flex-direction: column; gap: 18px; padding-top: 26px; }
  .dc-field { display: flex; flex-direction: column; gap: 7px; }
  .dc-field > span, .dc-targets legend, .dc-field-heading label { color: var(--dc-text-muted); font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .dc-field-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .dc-wand { display: flex; align-items: center; gap: 6px; padding: 5px 8px; border: 1px solid var(--dc-border); border-radius: var(--dc-radius); background: var(--dc-bg-elev); color: var(--dc-text-muted); font-size: 9px; cursor: pointer; }
  .dc-wand:hover { border-color: #52525b; color: var(--dc-text); }
  .dc-wand svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.6; }
  .dc-field textarea, .dc-field select, .dc-text-input { width: 100%; box-sizing: border-box; border: 1px solid var(--dc-border); border-radius: var(--dc-radius); background: var(--dc-bg-elev); color: var(--dc-text); outline: none; }
  .dc-text-input { padding: 11px 12px; font-size: 13px; }
  .dc-field textarea { min-height: 190px; padding: 16px; resize: vertical; font-size: 15px; line-height: 1.55; }
  .dc-field select { padding: 9px 10px; font-size: 11px; }
  .dc-field textarea:focus, .dc-field select:focus, .dc-text-input:focus { border-color: #52525b; }
  .dc-sample-source { color: var(--dc-text-dim); font-size: 9px; letter-spacing: 0; text-transform: none; }
  .dc-sample-source strong { color: var(--dc-text-muted); font-weight: 600; }
  .dc-create-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .dc-targets { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin: 0; padding: 0; border: 0; }
  .dc-targets legend { margin-bottom: 8px; }
  .dc-targets label { display: flex; gap: 9px; padding: 12px; border: 1px solid var(--dc-border); border-radius: var(--dc-radius); background: var(--dc-bg-elev); cursor: pointer; min-height: 44px; }
  .dc-targets input { accent-color: #fafafa; }
  .dc-targets span { display: flex; flex-direction: column; gap: 3px; }
  .dc-targets strong { color: var(--dc-text); font-size: 11px; }
  .dc-targets small { color: var(--dc-text-dim); font-size: 9px; line-height: 1.3; }
  .dc-reference-drop { display: flex; align-items: center; gap: 12px; min-height: 74px; padding: 10px; border: 1px dashed #3f3f46; border-radius: var(--dc-radius); background: #0d0d0f; cursor: pointer; }
  .dc-reference-drop input { display: none; }
  .dc-reference-drop img { width: 88px; height: 58px; border-radius: var(--dc-radius); object-fit: cover; }
  .dc-reference-drop > div:not(.dc-reference-icon) { display: flex; flex-direction: column; gap: 3px; }
  .dc-reference-drop strong { color: var(--dc-text); font-size: 11px; }
  .dc-reference-drop span { color: var(--dc-text-dim); font-size: 9px; }
  .dc-reference-icon { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid var(--dc-border); border-radius: 50%; color: var(--dc-text-muted); font-size: 20px; }
  .dc-submit-row { display: grid; grid-template-columns: 220px 1fr; align-items: center; gap: 14px; padding-top: 2px; }
  .dc-prepare-button { min-height: 44px; padding: 12px 16px; border: 0; border-radius: var(--dc-radius); background: var(--dc-text); color: var(--dc-bg); font-size: 12px; font-weight: 750; cursor: pointer; }
  .dc-prepare-button:disabled { background: #27272a; color: #71717a; cursor: not-allowed; }
  .dc-connection-note { display: flex; align-items: flex-start; gap: 8px; color: var(--dc-text-dim); font-size: 9px; line-height: 1.5; }
  .dc-status-dot { flex: 0 0 auto; width: 6px; height: 6px; margin-top: 4px; border-radius: 50%; background: #f59e0b; }
  .dc-request-panel { margin-top: 28px; padding: 18px; border: 1px solid var(--dc-border); border-radius: 8px; background: var(--dc-bg-elev); }
  .dc-request-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid var(--dc-border); }
  .dc-request-header h2 { margin: 4px 0 0; font-size: 15px; }
  .dc-request-header button { padding: 6px 9px; border: 1px solid var(--dc-border); border-radius: 4px; background: transparent; color: var(--dc-text-muted); font-size: 9px; cursor: pointer; }
  .dc-request-panel pre { max-height: 440px; overflow: auto; margin: 16px 0 0; color: var(--dc-text-muted); font-family: var(--dc-font-mono); font-size: 10px; line-height: 1.6; white-space: pre-wrap; }
  @media(max-width:700px){.dc-targets{grid-template-columns:1fr}.dc-submit-row{grid-template-columns:1fr}.dc-create-options{grid-template-columns:1fr}}
</style>
