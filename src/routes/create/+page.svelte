<script lang="ts">
  import Tabs from '$lib/components/Tabs.svelte';
  import { page } from '$app/state';
  import { onDestroy } from 'svelte';
  import { buildCanonicalConceptBrief, QUICK_START_PRESETS, resolveProjectTitle, suggestTitleOptions } from '$lib/create/brief';
  import { loadComparisonRun } from '$lib/data/comparisons';
  import { versionPrompt } from '$lib/data/version-context';
  import { SEEDANCE_MODELS, seedanceModel, seedanceLabel, seedanceWorkingCopy, isLegacySora, type SeedanceModel } from '$lib/create/models';
  import LegacyText from '$lib/components/LegacyText.svelte';
  import { loadPromptCardBySlug } from '$lib/data/loader';
  import Icon from '$lib/components/Icon.svelte';
  import UploadProject from '$lib/components/UploadProject.svelte';
  import Select from '$lib/components/Select.svelte';

  let lane = $state<'prompt' | 'upload'>('prompt');
  let selectedTemplate = $state('');
  function selectTemplate(value: string) {
    if (value === 'surprise') useSamplePrompt();
    else {
      const preset = QUICK_START_PRESETS.find(item => item.id === value);
      if (preset) applyPreset(preset);
    }
    selectedTemplate = '';
  }
  let projectTitle = $state('');
  let idea = $state('');
  let format = $state('trailer');
  let duration = $state('12');
  let includeAudio = $state(true);
  let videoModel = $state<SeedanceModel>('seedance-2.5');
  let sourceOriginal = $state('');
  let sourceLegacy = $state(false);
  let referenceName = $state('');
  let referenceUrl = $state('');
  let request = $state('');
  let copied = $state(false);
  let sampleIndex = $state(0);
  let sampleSource = $state('');
  let recipeTitle = $state('');
  let titleManuallyEdited = $state(false);
  let error = $state('');
  let sourceLoading = $state(false);
  const sourceQuery = $derived(page.url.searchParams.toString());
  $effect(() => {
    const params = new URLSearchParams(sourceQuery);
    videoModel = seedanceModel(params.get('model'));
    const recipe = params.get('recipe');
    const runId = params.get('run');
    if (!recipe && !runId) return;
    let stale = false;
    sourceLoading = true;
    error = '';
    const load = async () => {
      let text = '';
      let title = '';
      let legacy = false;
      let sourceDuration = '12';
      if (recipe) {
        const card = await loadPromptCardBySlug(recipe);
        if (!card) throw new Error('This recipe could not be loaded. Choose it again from Prompts.');
        text = card.prompt_pattern || card.body_excerpt || card.summary;
        if (card.runtime_seconds) sourceDuration = String(card.runtime_seconds);
        title = card.title;
        legacy = isLegacySora([card.model_family, ...card.model_targets, card.title].join(' '));
      } else if (runId) {
        const detail = await loadComparisonRun(runId, undefined, { strict: true });
        if (!detail) throw new Error('This project could not be loaded.');
        title = detail.title;
        const artifact = detail.artifacts.find(item => item.artifact_id === params.get('take'));
        const answer = detail.answers.find(item => item.answer_id === params.get('answer'));
        if (artifact) {
          text = versionPrompt(artifact, new Map(detail.prompts.map(item => [item.prompt_id, item])));
          sourceDuration = text.match(/\b(\d+)(?:-| )second/i)?.[1] ?? String(artifact.duration_seconds ?? 12);
          legacy = isLegacySora([artifact.video_model, artifact.model, artifact.target_model, artifact.provider].join(' '));
        } else if (answer) {
          const pkg = answer.structured_prompt;
          text = pkg && typeof pkg === 'object' && 'sora_prompt' in pkg && typeof pkg.sora_prompt === 'string' ? pkg.sora_prompt : answer.answer_text;
          legacy = isLegacySora(answer.target_model) || !!(pkg && typeof pkg === 'object' && 'sora_prompt' in pkg);
        }
        if (!text.trim()) throw new Error('No saved prompt was found for that take. Start with a new idea below.');
      }
      if (stale) return;
      duration = sourceDuration;
      lane = 'prompt';
      sourceOriginal = text;
      sourceLegacy = legacy || isLegacySora(text);
      idea = seedanceWorkingCopy(text, videoModel);
      recipeTitle = title;
      sampleSource = title;
      projectTitle = seedanceWorkingCopy(title, videoModel);
      titleManuallyEdited = true;
      request = '';
    };
    void load().catch(caught => { if (!stale) error = caught instanceof Error ? caught.message : 'Could not load the source prompt.'; })
      .finally(() => { if (!stale) sourceLoading = false; });
    return () => { stale = true; };
  });

  let titleOptions = $derived(suggestTitleOptions(idea, format, sampleSource));
  let effectiveTitle = $derived(resolveProjectTitle(projectTitle, idea, format, sampleSource));
  let canSubmit = $derived(!!idea.trim() && !sourceLoading);

  $effect(() => {
    if (!idea.trim() || titleManuallyEdited) return;
    const next = titleOptions[0] ?? '';
    if (next && next !== projectTitle) projectTitle = next;
  });

  const SAMPLE_PROMPTS = [
    {
      source: 'Seedance Supernatural Teaser Pattern',
      format: 'trailer',
      duration: '12',
      text: '12-second premium streaming teaser, 16:9, cinematic thriller grade. 0-3s: an isolated cliffside hotel glows beneath an incoming storm as rain moves sideways across an empty terrace and distant thunder rolls. 3-6s: slow push toward a woman in silver eveningwear facing a dark window; her reflection turns toward camera half a beat before she does. 6-9s: a crack races through the pane, every light cuts out, and a red handprint appears on the inside with one sharp bass impact. 9-12s: smash cut to black; AFTER CHECKOUT slams into frame in elegant chrome serif type as the thunder decays into silence. No extra logos, no subtitles, no watermark.',
    },
    {
      source: 'World-Simulator Physics Loop',
      format: 'visual concept',
      duration: '8',
      text: 'An 8-second physically coherent tabletop world inside a dark watchmaker’s studio. A miniature glass city rests inside an open silver pocket watch. Warm steam from a nearby espresso cup drifts across the city, condensing on the towers and gathering into droplets that run down the streets like rivers. The camera makes one slow macro orbit while gears beneath the city turn, streetlights flicker in response, and loose paper fibers lift naturally in the warm air. Amber task lighting and deep black shadows define the scene. In the final second, the largest droplet rolls back into its starting position for a seamless loop. Natural room tone, tiny gear clicks, and soft steam hiss.',
    },
    {
      source: 'Audio-First Micro Documentary',
      format: 'short film scene',
      duration: '15',
      text: 'A 15-second observational documentary scene inside a family-run neon-sign workshop before sunrise. Audio leads from the first frame: transformer hum, rain tapping the skylight, glass tubing clinking, and the short hiss of a blue flame timed exactly to the artisan’s hands. The camera begins wide among stacked signs, moves into a shoulder-level tracking shot as she bends a glowing pink tube, then ends on a macro view of the finished letter flickering alive. Moist concrete, worn tools, realistic handheld movement, cool window light mixed with magenta neon. A calm voice says, “You can hear when the glass is ready.” No subtitles.',
    },
  ];

  const FORMATS = [
    { value: 'trailer', label: 'Trailer or teaser' },
    { value: 'music video', label: 'Music video' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'short film scene', label: 'Short film scene' },
    { value: 'visual concept', label: 'Visual concept' },
  ];
  const formatLabel = $derived(FORMATS.find((f) => f.value === format)?.label ?? format);

  function resetRun() {
    error = '';
    request = '';
    sourceOriginal = '';
    sourceLegacy = false;
  }

  function changeModel(model: string) {
    videoModel = seedanceModel(model);
    idea = seedanceWorkingCopy(idea, videoModel);
    projectTitle = seedanceWorkingCopy(projectTitle, videoModel);
    request = '';
  }

  function applyPreset(preset: (typeof QUICK_START_PRESETS)[number]) {
    idea = preset.idea;
    format = preset.format;
    duration = preset.duration;
    projectTitle = preset.title;
    titleManuallyEdited = true;
    sampleSource = preset.title;
    recipeTitle = '';
    resetRun();
  }

  function useSamplePrompt() {
    const sample = SAMPLE_PROMPTS[sampleIndex % SAMPLE_PROMPTS.length];
    idea = sample.text;
    sampleSource = sample.source;
    format = sample.format;
    duration = sample.duration;
    titleManuallyEdited = false;
    recipeTitle = '';
    projectTitle = suggestTitleOptions(sample.text, sample.format, sample.source)[0] ?? '';
    sampleIndex += 1;
    resetRun();
  }

  function selectTitle(option: string) {
    projectTitle = option;
    titleManuallyEdited = true;
  }

  function handleReference(event: Event) {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    if (referenceUrl) URL.revokeObjectURL(referenceUrl);
    referenceName = file.name;
    referenceUrl = URL.createObjectURL(file);
  }

  function briefInput() {
    return buildCanonicalConceptBrief({
      projectTitle: effectiveTitle,
      idea,
      format,
      duration,
      includeAudio,
      videoModel,
      referenceName: referenceName || undefined,
    });
  }

  function prepareRequest() {
    request = briefInput();
    copied = false;
    error = '';
  }

  async function copyRequest() {
    await navigator.clipboard.writeText(request);
    copied = true;
  }

  onDestroy(() => { if (referenceUrl) URL.revokeObjectURL(referenceUrl); });
</script>

<svelte:head><title>Create · Trailer Feed</title></svelte:head>

<div class="studio-column create">
  <header class="head">
    <div class="head-title">
      <h1 class="t-page">Create a project</h1>
      <span class="dim head-note">Start with an idea or bring videos you already have.</span>
    </div>
    {#if recipeTitle}<span class="stag tone-review recipe-tag">Source: <LegacyText text={recipeTitle} /></span>{/if}
  </header>

  <Tabs id="create" label="Create a project" bind:value={lane} items={[
    { value: 'prompt', label: 'Write a prompt' }, { value: 'upload', label: 'Upload videos' },
  ]} />

  <div class="lane" id="create-upload-panel" role="tabpanel" aria-labelledby="create-upload-tab" hidden={lane !== 'upload'} tabindex="0">
    <UploadProject />
  </div>
  <div class="lane prompt-lane" id="create-prompt-panel" role="tabpanel" aria-labelledby="create-prompt-tab" hidden={lane !== 'prompt'} tabindex="0">
  <div class="desk">
    <section class="form glass-panel" aria-label="Pitch">
      {#if sourceLoading}<p class="hint" role="status">Loading source prompt…</p>{/if}
      {#if sourceLegacy}<p class="legacy-note"><LegacyText text="Sora" /> is unavailable. This is a working copy for {seedanceLabel(videoModel)}; the original is preserved.</p>{/if}
      <div class="template-picker">
        <span class="field-label">Need a starting point?</span>
        <Select label="Prompt examples" bind:value={selectedTemplate} options={[
          { value: '', label: 'Choose an example…' },
          ...QUICK_START_PRESETS.map(preset => ({ value: preset.id, label: `${preset.title} · ${preset.label}` })),
          { value: 'surprise', label: 'Surprise me · From the library' },
        ]} onchange={selectTemplate} />
      </div>
      <div class="field">
        <label class="field-label" for="project-title">Working title</label>
        <input id="project-title" class="sinput" bind:value={projectTitle} placeholder="Named from your idea as you type" oninput={() => (titleManuallyEdited = true)} />
        {#if titleOptions.length && idea.trim()}
          <div class="chips" role="group" aria-label="Suggested titles">
            {#each titleOptions as option (option)}
              <button type="button" class="stag" class:selected={projectTitle === option} onclick={() => selectTitle(option)}><LegacyText text={option} /></button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="field">
        <label class="field-label" for="creative-idea">The idea</label>
        <textarea
          id="creative-idea"
          class="stextarea idea"
          bind:value={idea}
          rows="7"
          placeholder="A 15-second fashion trailer in a rain-soaked motel. One woman, electric-blue light, uneasy handheld camera, ending on a hard title reveal…"
        ></textarea>
        {#if sampleSource}<p class="hint">Adapted from <LegacyText text={sampleSource} />.</p>{/if}
        {#if sourceOriginal}<details class="original-source"><summary>Original source prompt</summary><pre><LegacyText text={sourceOriginal} /></pre></details>{/if}
      </div>

      <div class="field">
        <span class="field-label">Format</span>
        <div class="options" role="radiogroup" aria-label="Format">
          {#each FORMATS as option (option.value)}
            <button type="button" role="radio" class="sbtn" class:sbtn-primary={format === option.value} aria-checked={format === option.value} onclick={() => (format = option.value)}>
              {option.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="field-pair">
        <div class="field">
          <span class="field-label">Video model</span>
          <Select label="Video model" value={videoModel} options={[...SEEDANCE_MODELS]} onchange={changeModel} />
          <p class="hint">Prepare a brief, render in your video tool, then upload the result.</p>
        </div>
        <div class="field">
          <span class="field-label">Sound</span>
          <div class="options" role="radiogroup" aria-label="Sound">
            <button type="button" role="radio" class="sbtn" class:sbtn-primary={includeAudio} aria-checked={includeAudio} onclick={() => (includeAudio = true)}>In the prompt</button>
            <button type="button" role="radio" class="sbtn" class:sbtn-primary={!includeAudio} aria-checked={!includeAudio} onclick={() => (includeAudio = false)}>Picture only</button>
          </div>
          <p class="hint">Music, ambience, dialogue and effects.</p>
        </div>
      </div>

      <label class="reference raised" class:filled={!!referenceUrl}>
        <input type="file" accept="image/*" onchange={handleReference} />
        {#if referenceUrl}
          <img src={referenceUrl} alt="Selected visual reference" />
          <span><strong>{referenceName}</strong><span class="dim">Stays on this device for now. Click to swap it.</span></span>
        {:else}
          <span class="reference-icon"><Icon name="plus" size={16} /></span>
          <span><strong>Add a reference image</strong><span class="dim">A character, product, location or mood frame.</span></span>
        {/if}
      </label>
    </section>

    <aside class="project-preview glass-panel" aria-label="Prompt project details">
      <h2 class="t-section">Project details</h2>
      <div class="preview-title">
        <span class="field-label">Project name</span>
        <strong class:empty={!idea.trim()}><LegacyText text={idea.trim() ? effectiveTitle : 'Untitled project'} /></strong>
      </div>
      <dl class="preview-fields">
        <div><dt>Format</dt><dd>{formatLabel}</dd></div>
        <div><dt>Length</dt><dd>{duration} seconds</dd></div>
        <div><dt>Workflow</dt><dd>Prepare, render, upload</dd></div>
        <div><dt>Video model</dt><dd>{seedanceLabel(videoModel)}</dd></div>
        <div><dt>Sound</dt><dd>{includeAudio ? 'In the prompt' : 'Picture only'}</dd></div>
        <div><dt>Source</dt><dd>{sourceLegacy ? 'Legacy prompt' : 'New prompt'}</dd></div>
      </dl>
      <div class="preview-go">
        <p class="status">Prepare one prompt brief for {seedanceLabel(videoModel)}. No generation is submitted here.</p>
        <button class="sbtn sbtn-primary start" type="button" disabled={!canSubmit} onclick={prepareRequest}><Icon name="sparkles" /> Prepare Seedance brief</button>
      </div>
      {#if error}<p class="error" role="alert">{error}</p>{/if}
    </aside>
  </div>

  {#if request}
    <section class="result glass-panel" aria-labelledby="brief-title">
      <div class="result-head">
        <div>
          <span class="label">Ready for your prompt writer</span>
          <h2 id="brief-title" class="t-section">{seedanceLabel(videoModel)} brief</h2>
        </div>
        <button class="sbtn" type="button" onclick={copyRequest}><Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Copied' : 'Copy brief'}</button>
      </div>
      <pre class="brief">{request}</pre>
    </section>
  {/if}
  </div>
</div>

<style>
  .create {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    padding-top: 24px;
    padding-bottom: 64px;
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px 16px;
  }

  .recipe-tag {
    max-width: 100%;
  }

  .head-title { display:flex; flex-wrap:wrap; align-items:baseline; gap:12px; }
  .head-title .t-page { width:auto; }
  .head-note { font-size:13px; }
  .lane { margin-top:-24px; }
  .legacy-note { margin:0; color:var(--dc-text-muted); font-size:13px; line-height:1.5; }
  .original-source { color:var(--dc-text-muted); font-size:12px; }
  .original-source summary { cursor:pointer; }
  .original-source pre { white-space:pre-wrap; max-height:220px; overflow:auto; font:inherit; line-height:1.6; }
  .lane[hidden] { display:none; }
  .prompt-lane { display:grid; gap:24px; }
  .template-picker { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px; padding-bottom:16px; border-bottom:1px solid var(--dc-border); }

  /* ── Desk: pitch form + project details ─────────────────────────────────── */

  .desk {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 24px;
    align-items: start;
  }

  .form {
    display: grid;
    gap: 20px;
    padding: 20px;
  }

  .field {
    display: grid;
    min-width: 0;
    gap: 8px;
  }

  .field-pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .field-label {
    color: var(--dc-text-muted);
    font-size: 13px;
  }

  .idea {
    font-size: 14px;
    line-height: 1.55;
  }

  .chips,
  .options {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chips .stag {
    max-width: 100%;
  }

  .hint {
    margin: 0;
    color: var(--dc-text-dim);
    font-size: 12px;
    line-height: 1.45;
  }

  .reference {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .reference:hover {
    background: #161616;
  }

  .reference input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .reference > span:last-child {
    display: grid;
    gap: 2px;
    min-width: 0;
    font-size: 12px;
  }

  .reference strong {
    overflow: hidden;
    color: var(--dc-text);
    font-size: 13px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reference-icon {
    display: grid;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    place-items: center;
    border-radius: 6px;
    background: #161616;
  }

  .reference img {
    flex-shrink: 0;
    width: 72px;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 4px;
  }

  .project-preview { display:grid; gap:20px; padding:24px; position:sticky; top:calc(var(--dc-nav-offset) + 16px); }
  .preview-title { display:grid; gap:8px; }
  .preview-title strong { font-size:16px; font-weight:500; overflow-wrap:anywhere; }
  .preview-title .empty { color:var(--dc-text-dim); }
  .preview-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px 16px; margin:0; }
  .preview-fields div { display:grid; gap:8px; }
  .preview-fields dt { color:var(--dc-text-muted); font-size:13px; }
  .preview-fields dd { margin:0; font-size:14px; }
  .preview-go { display:grid; gap:12px; border-top:1px solid var(--dc-border); padding-top:20px; }
  .preview-go .start { min-height:38px; }

  .status {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: var(--dc-text-muted);
    font-size: 12px;
    line-height: 1.4;
  }

  .start {
    padding: 0 20px;
  }

  .error {
    margin: 0;
    color: #f0a8a0;
    font-size: 12px;
  }

  /* ── Results ──────────────────────────────────────────────────── */

  .result {
    display: grid;
    gap: 14px;
    padding: 20px;
  }

  .result-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
  }

  .brief {
    margin: 0;
    color: var(--dc-text-muted);
    font: 13px / 1.6 var(--dc-font-sans);
    white-space: pre-wrap;
  }

  /* ── Tablet and phone ─────────────────────────────────────────── */

  @media (max-width: 900px) {
    .desk {
      grid-template-columns: minmax(0, 1fr);
    }

    .project-preview {
      position: static;
    }
  }

  @media (max-width: 560px) {
    .create {
      gap: 24px;
      padding-top: 16px;
    }


    .field-pair {
      grid-template-columns: minmax(0, 1fr);
    }

    .form,
    .project-preview {
      padding: 16px;
    }
  }

</style>
