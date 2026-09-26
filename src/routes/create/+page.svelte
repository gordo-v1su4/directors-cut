<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { onDestroy, onMount } from 'svelte';
  import { buildCanonicalConceptBrief, QUICK_START_PRESETS, resolveProjectTitle, suggestTitleOptions, type CaptureHandoffMode } from '$lib/create/brief';
  import { callBridgeTool, bridgeHealth } from '$lib/bridge/types';
  import { loadPromptCardBySlug } from '$lib/data/loader';
  import Icon from '$lib/components/Icon.svelte';
  import { toneFor } from '$lib/ui/tones';
  import type {
    CreateComparisonRunInput,
    CreateComparisonRunOutput,
    GetConceptCaptureStatusOutput,
    PrepareConceptCaptureOutput,
    RunConceptCaptureOutput,
  } from '$lib/bridge/types';

  let projectTitle = $state('');
  let idea = $state('');
  let format = $state('trailer');
  let duration = $state('12');
  let includeAudio = $state(true);
  let handoffMode = $state<CaptureHandoffMode>('automated');
  let referenceName = $state('');
  let referenceUrl = $state('');
  let request = $state('');
  let copied = $state(false);
  let sampleIndex = $state(0);
  let sampleSource = $state('');
  let recipeTitle = $state('');
  let titleManuallyEdited = $state(false);
  let busy = $state(false);
  let clapping = $state(false);
  let error = $state('');
  let bridgeConnected = $state(false);
  let automatedRun = $state<CreateComparisonRunOutput | null>(null);
  let capturePrepared = $state<PrepareConceptCaptureOutput | null>(null);
  let captureRunning = $state(false);
  let captureStatus = $state<GetConceptCaptureStatusOutput | null>(null);
  let pollTimer: ReturnType<typeof setTimeout> | undefined;
  let bridgeLost = $state(false);

  const BRIDGE_URL = import.meta.env.VITE_RAYCAST_BRIDGE_URL ?? 'http://127.0.0.1:8787';
  const BRIDGE_TOKEN = import.meta.env.VITE_RAYCAST_BRIDGE_TOKEN ?? '';

  onMount(() => {
    void bridgeHealth(BRIDGE_URL).then((connected) => (bridgeConnected = connected));
  });

  // Prompts → "Use in Create" arrives with the recipe's slug. Follow the URL,
  // so moving between recipes (or back) always shows the matching pitch.
  const recipeSlug = $derived(page.url.searchParams.get('recipe'));
  $effect(() => {
    const slug = recipeSlug;
    if (!slug) {
      recipeTitle = '';
      return;
    }
    let stale = false;
    void loadPromptCardBySlug(slug).then((card) => {
      if (stale || !card) return;
      idea = card.prompt_pattern || card.summary;
      sampleSource = card.title;
      recipeTitle = card.title;
      const uses = card.use_cases.join(' ');
      if (/music/.test(uses)) format = 'music video';
      else if (/product|commercial|\bad\b/.test(uses)) format = 'commercial';
      else if (/teaser|trailer/.test(uses)) format = 'trailer';
      else format = 'visual concept';
      titleManuallyEdited = false;
      resetRun();
    });
    return () => {
      stale = true;
    };
  });

  let titleOptions = $derived(suggestTitleOptions(idea, format, sampleSource));
  let effectiveTitle = $derived(resolveProjectTitle(projectTitle, idea, format, sampleSource));
  let canSubmit = $derived(!!idea.trim() && !busy);

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
      source: 'Sora World-Simulator Physics Loop',
      format: 'visual concept',
      duration: '8',
      text: 'An 8-second physically coherent tabletop world inside a dark watchmaker’s studio. A miniature glass city rests inside an open silver pocket watch. Warm steam from a nearby espresso cup drifts across the city, condensing on the towers and gathering into droplets that run down the streets like rivers. The camera makes one slow macro orbit while gears beneath the city turn, streetlights flicker in response, and loose paper fibers lift naturally in the warm air. Amber task lighting and deep black shadows define the scene. In the final second, the largest droplet rolls back into its starting position for a seamless loop. Natural room tone, tiny gear clicks, and soft steam hiss.',
    },
    {
      source: 'Sora Audio-First Micro Documentary',
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
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const slateNumber = String(new Date().getDate()).padStart(2, '0');

  /**
   * Clear the last run before a new pitch. A capture still in flight keeps
   * its run, status and Projects link; a finished one also stops polling.
   */
  function resetRun() {
    if (busy || captureRunning) return;
    error = '';
    stopPolling();
    request = '';
    automatedRun = null;
    capturePrepared = null;
    captureRunning = false;
    captureStatus = null;
  }

  function applyPreset(preset: (typeof QUICK_START_PRESETS)[number]) {
    idea = preset.idea;
    format = preset.format;
    duration = preset.duration;
    projectTitle = preset.title;
    titleManuallyEdited = false;
    sampleSource = preset.label;
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
      referenceName: referenceName || undefined,
    });
  }

  function prepareRequest() {
    request = briefInput();
    copied = false;
    automatedRun = null;
    captureStatus = null;
    error = '';
  }

  async function copyRequest() {
    await navigator.clipboard.writeText(request);
    copied = true;
  }

  function stopPolling() {
    if (pollTimer) clearTimeout(pollTimer);
    pollTimer = undefined;
    bridgeLost = false;
  }

  async function refreshCaptureStatus(runId: string): Promise<GetConceptCaptureStatusOutput | null> {
    if (!BRIDGE_TOKEN) return null;
    const status = await callBridgeTool<{ run_id: string }, GetConceptCaptureStatusOutput>(
      { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
      'get_concept_capture_status',
      { run_id: runId },
    );
    captureStatus = status;
    return status;
  }

  /** End a capture that stopped: clear the running state and say why. */
  function endCapture(message = '') {
    captureRunning = false;
    stopPolling();
    if (message) error = message;
  }

  /**
   * Follow a capture until it finishes. If the bridge stops answering, keep
   * trying with a growing wait (up to 30 s) and say so; the capture itself
   * may still finish, and its answers appear as soon as the bridge is back.
   */
  function startPolling(runId: string) {
    stopPolling();
    let failures = 0;
    const tick = () => {
      refreshCaptureStatus(runId)
        .then((status) => {
          failures = 0;
          bridgeLost = false;
          if (status && (status.capture_job_status === 'complete' || status.ready_for_projects)) return endCapture();
          // The result panel explains a capture that went idle before finishing.
          if (status?.capture_job_status === 'idle') return endCapture();
          pollTimer = setTimeout(tick, 3000);
        })
        .catch(() => {
          failures += 1;
          if (failures >= 3) bridgeLost = true;
          pollTimer = setTimeout(tick, Math.min(30_000, 3000 * 2 ** Math.min(failures, 4)));
        });
    };
    pollTimer = setTimeout(tick, 3000);
  }

  async function startConceptRun() {
    // The slate claps before anything else happens.
    clapping = true;
    setTimeout(() => (clapping = false), 420);
    error = '';
    busy = true;
    automatedRun = null;
    capturePrepared = null;
    captureRunning = false;
    captureStatus = null;
    request = briefInput();

    try {
      if (handoffMode === 'manual') {
        prepareRequest();
        return;
      }

      if (!BRIDGE_TOKEN) {
        error = 'Automated capture needs VITE_RAYCAST_BRIDGE_TOKEN in .env.local and the bridge running on :8787.';
        return;
      }

      bridgeConnected = await bridgeHealth(BRIDGE_URL);
      if (!bridgeConnected) {
        error = 'The bridge is offline. Start it on port 8787, or switch Run mode to Manual.';
        return;
      }

      const input: CreateComparisonRunInput = {
        title: effectiveTitle,
        question: request,
        capture_mode: 'automated',
        models_requested: ['ChatGPT', 'Claude'],
        target_models: ['sora-2'],
      };

      automatedRun = await callBridgeTool<CreateComparisonRunInput, CreateComparisonRunOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'create_comparison_run',
        input,
      );
      capturePrepared = await callBridgeTool<{ run_id: string }, PrepareConceptCaptureOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'prepare_concept_capture',
        { run_id: automatedRun.run_id },
      );
      captureRunning = true;
      await callBridgeTool<{ run_id: string; prepare_first: boolean }, RunConceptCaptureOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'run_concept_capture',
        { run_id: automatedRun.run_id, prepare_first: false },
      );
      await refreshCaptureStatus(automatedRun.run_id);
      startPolling(automatedRun.run_id);
    } catch (caught) {
      endCapture(caught instanceof Error ? caught.message : String(caught));
    } finally {
      busy = false;
    }
  }

  async function openProjects() {
    const runId = automatedRun?.run_id;
    if (runId) await goto(`/comparisons?run=${encodeURIComponent(runId)}`);
    else await goto('/comparisons');
  }

  onDestroy(stopPolling);
</script>

<svelte:head><title>Create · Directors Cut</title></svelte:head>

<div class="studio-column create">
  <header class="head">
    <div class="head-title">
      <h1 class="t-page">Create</h1>
      <span class="dim head-note">Pitch it once. ChatGPT and Claude each write a take, and both land in Projects.</span>
    </div>
    {#if recipeTitle}<span class="stag tone-review recipe-tag">Loaded recipe: {recipeTitle}</span>{/if}
  </header>

  <section aria-labelledby="templates-title">
    <div class="section-head">
      <h2 id="templates-title" class="t-section">Start from a template</h2>
      <span class="dim section-note">Or write your own below</span>
    </div>
    <div class="templates">
      {#each QUICK_START_PRESETS as preset (preset.id)}
        <button type="button" class="template" class:is-selected={sampleSource === preset.label} onclick={() => applyPreset(preset)}>
          <span class="template-tags">
            <span class="stag">{preset.label}</span>
            <span class="stag tone-review">{FORMATS.find((f) => f.value === preset.format)?.label ?? preset.format}</span>
          </span>
          <span class="t-card">{preset.title.replace(/\s+—.*$/, '')}</span>
          <span class="template-idea">{preset.idea}</span>
        </button>
      {/each}
      <button type="button" class="template" class:is-selected={SAMPLE_PROMPTS.some((s) => s.source === sampleSource)} onclick={useSamplePrompt}>
        <span class="template-tags">
          <span class="stag tone-warm">Example</span>
          <span class="stag">From the library</span>
        </span>
        <span class="t-card">Surprise me</span>
        <span class="template-idea">Load a tested prompt from the recipe library. Click again for another.</span>
      </button>
    </div>
  </section>

  <div class="desk">
    <section class="form glass-panel" aria-label="Pitch">
      <div class="field">
        <label class="field-label" for="project-title">Working title</label>
        <input id="project-title" class="sinput" bind:value={projectTitle} placeholder="Named from your idea as you type" oninput={() => (titleManuallyEdited = true)} />
        {#if titleOptions.length && idea.trim()}
          <div class="chips" role="group" aria-label="Suggested titles">
            {#each titleOptions as option (option)}
              <button type="button" class="stag" class:selected={projectTitle === option} onclick={() => selectTitle(option)}>{option}</button>
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
        {#if sampleSource}<p class="hint">Adapted from {sampleSource}.</p>{/if}
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
          <span class="field-label">Run mode</span>
          <div class="options" role="radiogroup" aria-label="Run mode">
            <button type="button" role="radio" class="sbtn" class:sbtn-primary={handoffMode === 'automated'} aria-checked={handoffMode === 'automated'} onclick={() => (handoffMode = 'automated')}>Automated</button>
            <button type="button" role="radio" class="sbtn" class:sbtn-primary={handoffMode === 'manual'} aria-checked={handoffMode === 'manual'} onclick={() => (handoffMode = 'manual')}>Manual</button>
          </div>
          <p class="hint">{handoffMode === 'automated' ? 'The bridge creates the run and captures both writers.' : 'Copy the brief and run it from Raycast yourself.'}</p>
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

    <!-- The slate fills in as the pitch takes shape, and claps on Start. -->
    <aside class="slate glass-panel" aria-label="Slate">
      <div class="sticks" class:clap={clapping} aria-hidden="true">
        {#each Array(12) as _, i (i)}<span></span>{/each}
      </div>
      <div class="slate-body">
        <div class="slate-top">
          <div class="slate-name">
            <span class="label">Production</span>
            <span class="t-section" class:empty={!idea.trim()}>{idea.trim() ? effectiveTitle : 'Untitled'}</span>
          </div>
          <span class="slate-icon"><Icon name="clapper" size={16} /></span>
        </div>

        <div class="cells">
          <div class="cell raised"><span class="label">Roll / Slate</span><span class="cell-big">A{slateNumber}</span></div>
          <div class="cell raised"><span class="label">Format</span><span class="cell-value">{formatLabel}</span></div>
          <div class="cell raised"><span class="label">Length</span><span class="cell-value">12 sec · {today}</span></div>
        </div>

        <div class="cells cells-2">
          <div class="cell raised">
            <span class="label">Writers room</span>
            <span class="cell-tags"><span class="stag tone-chatgpt">ChatGPT</span><span class="stag tone-claude">Claude</span></span>
          </div>
          <div class="cell raised">
            <span class="label">Camera</span>
            <span class="cell-tags"><span class="stag tone-sora">Sora 2</span><span class="stag">{includeAudio ? 'Sound on' : 'No sound'}</span></span>
          </div>
        </div>

        <div class="slate-go">
          <p class="status">
            <span class="dot" class:live={handoffMode === 'manual' || (bridgeConnected && !!BRIDGE_TOKEN)}></span>
            <span>
              {#if handoffMode === 'manual'}
                Next, copy the brief into Raycast.
              {:else if BRIDGE_TOKEN && bridgeConnected}
                Bridge connected.
              {:else if BRIDGE_TOKEN}
                Bridge offline. Start it on port 8787.
              {:else}
                Automated runs need the bridge token. Switch to Manual to go without it.
              {/if}
            </span>
          </p>
          <button class="sbtn sbtn-primary start" type="button" disabled={!canSubmit} onclick={startConceptRun}>
            <Icon name="play" size={12} filled />
            {busy ? 'Starting…' : handoffMode === 'manual' ? 'Prepare brief' : 'Start'}
          </button>
        </div>
        {#if error}<p class="error" role="alert">{error}</p>{/if}
      </div>
    </aside>
  </div>

  {#if automatedRun}
    <section class="result glass-panel" aria-labelledby="run-title">
      <div class="result-head">
        <div>
          <span class="label">Run started</span>
          <h2 id="run-title" class="t-section">{automatedRun.title}</h2>
        </div>
        <button class="sbtn sbtn-primary" type="button" onclick={openProjects}>Open in Projects <Icon name="up-right" /></button>
      </div>
      <div class="result-tags">
        <span class="stag tone-{toneFor(captureStatus?.run_status ?? automatedRun.run_status)}">{captureStatus?.run_status ?? automatedRun.run_status}</span>
        <span class="stag">{captureStatus?.captured_valid_count ?? 0} of 2 captured</span>
        <span class="stag">{captureRunning ? 'Capturing' : captureStatus?.capture_job_status ?? 'Idle'}</span>
        {#each captureStatus?.models ?? [] as model (model.label)}
          <span class="stag tone-{toneFor(model.label)}">{model.label}: {model.status}</span>
        {/each}
      </div>
      {#if captureStatus?.answers?.length}
        <div class="answers">
          {#each captureStatus.answers as answer (answer.answer_id)}
            <article class="raised answer">
              <span class="stag tone-{toneFor(answer.model_name)}">{answer.model_name}</span>
              {#if answer.title}<h3 class="t-card">{answer.title}</h3>{/if}
              {#if answer.logline}<p class="muted">{answer.logline}</p>{/if}
            </article>
          {/each}
        </div>
      {/if}
      <p class="hint">
        {#if captureRunning && bridgeLost}
          The bridge stopped answering. Still checking; answers appear here once it is back.
        {:else if captureRunning}
          Raycast is capturing ChatGPT first, then Claude. Answers appear here as they land.
        {:else if capturePrepared && !captureStatus?.ready_for_projects}
          Capture stopped before both answers came back. Check that Raycast is open and has Accessibility access.
        {:else if captureStatus?.ready_for_projects}
          Both concepts are in. Open Projects to compare them.
        {/if}
      </p>
    </section>
  {/if}

  {#if request && handoffMode === 'manual'}
    <section class="result glass-panel" aria-labelledby="brief-title">
      <div class="result-head">
        <div>
          <span class="label">Ready for Raycast</span>
          <h2 id="brief-title" class="t-section">Concept brief</h2>
        </div>
        <button class="sbtn" type="button" onclick={copyRequest}><Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Copied' : 'Copy brief'}</button>
      </div>
      <pre class="brief">{request}</pre>
    </section>
  {/if}
</div>

<style>
  .create {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
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

  .head-title,
  .section-head {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 12px;
  }

  .head-title .t-page,
  .section-head .t-section {
    flex-shrink: 0;
    width: auto;
  }

  .head-note,
  .section-note {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .section-head {
    margin-bottom: 12px;
  }

  /* ── Templates ────────────────────────────────────────────────── */

  .templates {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .template {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
    border: 0;
    border-radius: 8px;
    background: #0e0e0e;
    color: var(--dc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .template:hover {
    background: #161616;
  }

  .template-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .template-idea {
    display: -webkit-box;
    overflow: hidden;
    color: var(--dc-text-muted);
    font-size: 13px;
    line-height: 1.4;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  /* ── Desk: pitch form + slate ─────────────────────────────────── */

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

  /* ── Slate ────────────────────────────────────────────────────── */

  .slate {
    position: sticky;
    top: calc(var(--dc-nav-offset) + 16px);
    overflow: hidden;
  }

  .sticks {
    display: flex;
    height: 32px;
    overflow: hidden;
    background: #161616;
    transform-origin: 0 100%;
    transition: transform 0.2s ease;
  }

  .sticks span {
    flex-shrink: 0;
    width: 40px;
    height: 100%;
    transform: skewX(-24deg);
  }

  .sticks span:nth-child(odd) {
    background: rgba(255, 255, 255, 0.7);
  }

  /* Start lifts the sticks and snaps them shut. */
  .sticks.clap {
    animation: clap 0.42s ease;
  }

  @keyframes clap {
    0% { transform: rotate(0); }
    45% { transform: rotate(-9deg); }
    100% { transform: rotate(0); }
  }

  .slate-body {
    display: grid;
    gap: 16px;
    padding: 20px;
  }

  .slate-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .slate-name {
    display: grid;
    min-width: 0;
    gap: 4px;
  }

  .slate-name .empty {
    color: var(--dc-text-dim);
  }

  .slate-icon {
    display: grid;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    place-items: center;
    border-radius: 6px;
    background: #161616;
  }

  .cells {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .cells-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cell {
    display: grid;
    align-content: start;
    gap: 6px;
    min-width: 0;
    padding: 10px 12px;
  }

  .cell-big {
    font: 400 22px / 1 var(--dc-font-serif);
  }

  .cell-value {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cell-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .slate-go {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

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

  .dot {
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6b6560;
  }

  .dot.live {
    background: #9fd4a8;
    box-shadow: 0 0 10px rgba(159, 212, 168, 0.6);
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

  .result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .answers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    gap: 10px;
  }

  .answer {
    display: grid;
    gap: 8px;
    padding: 14px;
  }

  .answer p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
  }

  .brief {
    margin: 0;
    color: var(--dc-text-muted);
    font: 13px / 1.6 var(--dc-font-sans);
    white-space: pre-wrap;
  }

  /* ── Tablet and phone ─────────────────────────────────────────── */

  @media (max-width: 1100px) {
    .templates {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .desk {
      grid-template-columns: minmax(0, 1fr);
    }

    .slate {
      position: static;
    }
  }

  @media (max-width: 560px) {
    .create {
      gap: 24px;
      padding-top: 16px;
    }

    .head-note,
    .section-note {
      display: none;
    }

    .templates {
      display: flex;
      margin-inline: calc(-1 * var(--dc-gutter-x));
      padding-inline: var(--dc-gutter-x);
      overflow-x: auto;
      scrollbar-width: none;
      scroll-snap-type: x mandatory;
    }

    .template {
      flex: 0 0 78%;
      scroll-snap-align: start;
    }

    .field-pair {
      grid-template-columns: minmax(0, 1fr);
    }

    .form,
    .slate-body {
      padding: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sticks.clap {
      animation: none;
    }
  }
</style>
