<script lang="ts">
  import { goto } from '$app/navigation';
  import { onDestroy, onMount } from 'svelte';
  import { buildCanonicalConceptBrief, QUICK_START_PRESETS, resolveProjectTitle, suggestTitleOptions, type CaptureHandoffMode } from '$lib/create/brief';
  import { callBridgeTool, bridgeHealth } from '$lib/bridge/types';
  import { loadLatestArtifacts } from '$lib/data/comparisons';
  import type {
    CreateComparisonRunInput,
    CreateComparisonRunOutput,
    GetConceptCaptureStatusOutput,
    PrepareConceptCaptureOutput,
    RunConceptCaptureOutput,
  } from '$lib/bridge/types';

  type CreateMode = 'create' | 'ingest';

  let mode = $state<CreateMode>('create');
  let projectTitle = $state('');
  let idea = $state('');
  let ingestPrompt = $state('');
  let ingestFile = $state<File | null>(null);
  let ingestUrl = $state('');
  let ingestReady = $state(false);
  let ingestBusy = $state(false);
  let format = $state('trailer');
  let duration = $state('12');
  let targetSora = $state(true);
  let includeAudio = $state(true);
  let handoffMode = $state<CaptureHandoffMode>('automated');
  let referenceName = $state('');
  let referenceUrl = $state('');
  let request = $state('');
  let copied = $state(false);
  let sampleIndex = $state(0);
  let sampleSource = $state('');
  let titleManuallyEdited = $state(false);
  let busy = $state(false);
  let error = $state('');
  let bridgeConnected = $state(false);
  let automatedRun = $state<CreateComparisonRunOutput | null>(null);
  let capturePrepared = $state<PrepareConceptCaptureOutput | null>(null);
  let captureRunning = $state(false);
  let captureStatus = $state<GetConceptCaptureStatusOutput | null>(null);
  let pollTimer: ReturnType<typeof setInterval> | undefined;

  const BRIDGE_URL = import.meta.env.VITE_RAYCAST_BRIDGE_URL ?? 'http://127.0.0.1:8787';
  const BRIDGE_TOKEN = import.meta.env.VITE_RAYCAST_BRIDGE_TOKEN ?? '';
  onMount(() => { void bridgeHealth(BRIDGE_URL).then((connected) => bridgeConnected = connected); });

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

  function applyPreset(preset: (typeof QUICK_START_PRESETS)[number]) {
    idea = preset.idea;
    format = preset.format;
    duration = preset.duration;
    projectTitle = preset.title;
    titleManuallyEdited = false;
    sampleSource = preset.label;
    request = '';
    automatedRun = null;
    capturePrepared = null;
    captureRunning = false;
    captureStatus = null;
    error = '';
  }

  function selectTitle(option: string) {
    projectTitle = option;
    titleManuallyEdited = true;
  }

  function useSamplePrompt() {
    const family = targetSora ? 'sora' : 'both';
    const eligible = SAMPLE_PROMPTS.filter((sample) => sample.family === family);
    const pool = eligible.length ? eligible : SAMPLE_PROMPTS;
    const sample = pool[sampleIndex % pool.length];
    idea = sample.text;
    sampleSource = sample.source;
    format = sample.format;
    duration = sample.duration;
    titleManuallyEdited = false;
    projectTitle = suggestTitleOptions(sample.text, sample.format, sample.source)[0] ?? '';
    sampleIndex += 1;
    request = '';
    automatedRun = null;
    capturePrepared = null;
    captureRunning = false;
    captureStatus = null;
    error = '';
  }

  function handleReference(event: Event) {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    if (referenceUrl) URL.revokeObjectURL(referenceUrl);
    referenceName = file.name;
    referenceUrl = URL.createObjectURL(file);
  }

  function handleIngestFile(event: Event) {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    if (ingestUrl) URL.revokeObjectURL(ingestUrl);
    ingestFile = file;
    ingestUrl = URL.createObjectURL(file);
    ingestReady = false;
  }

  async function ingestProject() {
    if (!ingestFile || !ingestPrompt.trim()) return;
    ingestBusy = true;
    await new Promise((resolve) => setTimeout(resolve, 450));
    ingestReady = true;
    ingestBusy = false;
  }

  function switchMode(nextMode: CreateMode) {
    mode = nextMode;
    error = '';
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
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = undefined;
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

  function startPolling(runId: string) {
    stopPolling();
    pollTimer = setInterval(() => {
      refreshCaptureStatus(runId)
        .then((status) => {
          if (status && (status.capture_job_status === 'complete' || status.ready_for_projects)) {
            captureRunning = false;
            stopPolling();
          }
        })
        .catch(() => undefined);
    }, 3000);
  }

  async function startConceptRun() {
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
      error = caught instanceof Error ? caught.message : String(caught);
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
  const FORMATS = [
    { value: 'trailer', label: 'Trailer or teaser' },
    { value: 'music video', label: 'Music video' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'short film scene', label: 'Short film scene' },
    { value: 'visual concept', label: 'Visual concept' },
  ];
  const formatLabel = $derived(FORMATS.find((f) => f.value === format)?.label ?? format);
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // A blown-out frame of the latest render lights the room, as on the home page.
  let backdrop = $state('');
  onMount(() => {
    void loadLatestArtifacts(12)
      .then((items) => (backdrop = items.find((item) => item.thumbnail_url)?.thumbnail_url ?? ''))
      .catch(() => undefined);
  });
</script>

<svelte:head><title>Create — Directors Cut</title></svelte:head>

<div class="pitch">
  {#if backdrop}
    <div class="pitch-glow" style:background-image={`url("${backdrop}")`} aria-hidden="true"></div>
  {/if}

  <div class="pitch-wrap">
    <header class="pitch-head">
      <h1>What are we making?</h1>
      <p>
        Write the idea the way you'd pitch it. ChatGPT and Claude each develop their own concept from it,
        and both land in Projects for you to compare.
      </p>
      <div class="modes" role="tablist" aria-label="Project workflow">
        <button type="button" role="tab" aria-selected={mode === 'create'} class:active={mode === 'create'} onclick={() => switchMode('create')}>
          New concept
        </button>
        <button type="button" role="tab" aria-selected={mode === 'ingest'} class:active={mode === 'ingest'} onclick={() => switchMode('ingest')}>
          Import a finished cut
        </button>
      </div>
    </header>

    {#if mode === 'create'}
      <div class="desk">
        <section class="desk-form" aria-label="Concept brief">
          <div class="block">
            <h2 class="block-title">Start from a template</h2>
            <div class="presets">
              {#each QUICK_START_PRESETS as preset (preset.id)}
                <button
                  type="button"
                  class="preset"
                  class:active={sampleSource === preset.label}
                  onclick={() => applyPreset(preset)}
                >
                  <span class="preset-kind">{preset.label}</span>
                  <span class="preset-title">{preset.title.replace(/\s+—.*$/, '')}</span>
                  <span class="preset-idea">{preset.idea}</span>
                </button>
              {/each}
            </div>
          </div>

          <div class="block">
            <div class="block-row">
              <label class="block-title" for="creative-idea">The idea</label>
              <button class="link-btn" type="button" onclick={useSamplePrompt}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4 5 5L8.5 20.5a2.1 2.1 0 0 1-3 0l-2-2a2.1 2.1 0 0 1 0-3L15 4Zm-1 3 3 3M6 3v3M4.5 4.5h3M19 15v4M17 17h4" /></svg>
                Try an example
              </button>
            </div>
            <textarea
              id="creative-idea"
              class="treatment"
              bind:value={idea}
              rows="9"
              placeholder="A 15-second fashion trailer in a rain-soaked motel. One woman, electric-blue light, uneasy handheld camera, ending on a hard title reveal…"
            ></textarea>
            {#if sampleSource}
              <p class="hint">Adapted from {sampleSource}. Try another example for a different starting point.</p>
            {/if}
          </div>

          <div class="block">
            <label class="block-title" for="project-title">Working title</label>
            <input
              id="project-title"
              class="title-input"
              bind:value={projectTitle}
              placeholder="Named from your idea as you type"
              oninput={() => { titleManuallyEdited = true; }}
            />
            {#if titleOptions.length}
              <div class="title-options" role="group" aria-label="Suggested titles">
                {#each titleOptions as option (option)}
                  <button type="button" class:active={projectTitle === option} onclick={() => selectTitle(option)}>{option}</button>
                {/each}
              </div>
            {/if}
          </div>

          <div class="block">
            <h2 class="block-title">Format</h2>
            <div class="formats" role="radiogroup" aria-label="Format">
              {#each FORMATS as option (option.value)}
                <button
                  type="button"
                  role="radio"
                  aria-checked={format === option.value}
                  class:active={format === option.value}
                  onclick={() => (format = option.value)}
                >
                  {option.label}
                </button>
              {/each}
            </div>
            <p class="hint">Every run is 12 seconds for now, targeting Sora 2.</p>
          </div>

          <div class="block">
            <h2 class="block-title">How to run it</h2>
            <div class="choices">
              <label class="choice" class:active={handoffMode === 'automated'}>
                <input type="radio" name="handoff-mode" value="automated" bind:group={handoffMode} />
                <strong>Automated</strong>
                <span>The bridge creates the run and captures ChatGPT and Claude for you.</span>
              </label>
              <label class="choice" class:active={handoffMode === 'manual'}>
                <input type="radio" name="handoff-mode" value="manual" bind:group={handoffMode} />
                <strong>Manual</strong>
                <span>Copy the brief and run it from Raycast yourself.</span>
              </label>
            </div>
          </div>

          <div class="block block-split">
            <label class="toggle">
              <input type="checkbox" bind:checked={includeAudio} />
              <span class="toggle-track" aria-hidden="true"></span>
              <span class="toggle-copy">
                <strong>Sound in the prompt</strong>
                <span>Music, ambience, dialogue and effects are written into the video prompt.</span>
              </span>
            </label>

            <label class="reference" class:filled={!!referenceUrl}>
              <input type="file" accept="image/*" onchange={handleReference} />
              {#if referenceUrl}
                <img src={referenceUrl} alt="Selected visual reference" />
                <span class="toggle-copy">
                  <strong>{referenceName}</strong>
                  <span>Stays on this device for now. Click to swap it.</span>
                </span>
              {:else}
                <span class="reference-plus" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                </span>
                <span class="toggle-copy">
                  <strong>Add a reference image</strong>
                  <span>A character, product, location or mood frame.</span>
                </span>
              {/if}
            </label>
          </div>
        </section>

        <!-- The slate fills in as the brief takes shape. -->
        <aside class="slate-col">
          <div class="slate">
            <div class="slate-sticks" aria-hidden="true"></div>
            <div class="slate-body">
              <p class="slate-label">Production</p>
              <p class="slate-title" class:empty={!idea.trim()}>{idea.trim() ? effectiveTitle : 'Untitled'}</p>
              <dl class="slate-grid">
                <div><dt>Format</dt><dd>{formatLabel}</dd></div>
                <div><dt>Length</dt><dd>12 sec</dd></div>
                <div><dt>Sound</dt><dd>{includeAudio ? 'On' : 'Off'}</dd></div>
                <div><dt>Writers</dt><dd>ChatGPT, Claude</dd></div>
                <div><dt>Camera</dt><dd>Sora 2</dd></div>
                <div><dt>Date</dt><dd>{today}</dd></div>
              </dl>

              <button class="slate-go" type="button" disabled={!canSubmit} onclick={startConceptRun}>
                {busy ? 'Starting…' : handoffMode === 'manual' ? 'Prepare the brief' : 'Start concept run'}
              </button>

              <p class="slate-status">
                <span class="dot" class:live={handoffMode === 'manual' || (bridgeConnected && !!BRIDGE_TOKEN)}></span>
                <span>
                  {#if handoffMode === 'manual'}
                    Next, copy the brief and run “Start Directors Cut Concept Run” in Raycast.
                  {:else if BRIDGE_TOKEN && bridgeConnected}
                    Bridge connected. Answers stream in here as they're captured.
                  {:else if BRIDGE_TOKEN}
                    The bridge is offline. Start it on port 8787 to run automatically.
                  {:else}
                    Automated runs need <code>VITE_RAYCAST_BRIDGE_TOKEN</code> in <code>.env.local</code>. Switch to Manual to go without it.
                  {/if}
                </span>
              </p>
              {#if error}<p class="slate-error" role="alert">{error}</p>{/if}
            </div>
          </div>
        </aside>
      </div>
    {:else}
      <section class="import" aria-labelledby="import-title">
        <h2 id="import-title" class="visually-hidden">Import a finished cut</h2>
        <label class="import-drop" class:filled={!!ingestFile}>
          <input type="file" accept="video/*" onchange={handleIngestFile} />
          {#if ingestFile}
            <video src={ingestUrl} muted controls playsinline aria-label="Selected video preview"></video>
          {:else}
            <span class="reference-plus" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            <strong>Drop a finished video here</strong>
            <span>MP4, WebM or MOV. 16:9 works best.</span>
          {/if}
        </label>

        <div class="import-side">
          {#if ingestFile}
            <p class="import-file"><strong>{ingestFile.name}</strong> {(ingestFile.size / 1024 / 1024).toFixed(1)} MB</p>
          {/if}
          <label class="block-title" for="ingest-prompt">The prompt that made it</label>
          <textarea
            id="ingest-prompt"
            class="treatment"
            bind:value={ingestPrompt}
            rows="9"
            placeholder="Paste the prompt used for this video. It's used to name, sort and describe the project."
          ></textarea>
          <button
            class="slate-go"
            type="button"
            disabled={!ingestFile || !ingestPrompt.trim() || ingestBusy}
            onclick={ingestProject}
          >
            {ingestBusy ? 'Preparing project…' : ingestReady ? 'Project ready' : 'Add to projects'}
          </button>
          {#if ingestReady}
            <p class="slate-status"><span class="dot live"></span><span>Import staged. The prompt will fill in the project card and category.</span></p>
          {:else}
            <p class="hint">You only need the video and its prompt. Everything else can be edited later from the project.</p>
          {/if}
        </div>
      </section>
    {/if}

    {#if automatedRun}
      <section class="result" aria-labelledby="run-title">
        <div class="result-head">
          <div>
            <p class="block-title">Run started</p>
            <h2 id="run-title">{automatedRun.title}</h2>
          </div>
          <button class="btn" type="button" onclick={openProjects}>Open in Projects</button>
        </div>
        <dl class="result-facts">
          <div><dt>Run</dt><dd>{automatedRun.run_id}</dd></div>
          <div><dt>Status</dt><dd>{captureStatus?.run_status ?? automatedRun.run_status}</dd></div>
          <div><dt>Captured</dt><dd>{captureStatus?.captured_valid_count ?? 0} of 2</dd></div>
          <div><dt>Capture</dt><dd>{captureRunning ? 'Running' : captureStatus?.capture_job_status ?? 'Idle'}</dd></div>
        </dl>
        {#if captureStatus}
          <ul class="result-models">
            {#each captureStatus.models as model (model.label)}
              <li data-status={model.status}>
                <strong>{model.label}</strong>
                <span>{model.raycast_agent}</span>
                <span class="result-state">{model.status}</span>
              </li>
            {/each}
          </ul>
        {/if}
        {#if captureStatus?.answers?.length}
          <div class="result-answers">
            {#each captureStatus.answers as answer (answer.answer_id)}
              <article data-status={answer.structure_status}>
                <header><strong>{answer.model_name}</strong><span>{answer.structure_status}</span></header>
                {#if answer.title}<h3>{answer.title}</h3>{/if}
                {#if answer.logline}<p>{answer.logline}</p>{/if}
              </article>
            {/each}
          </div>
        {/if}
        {#if captureRunning}
          <p class="hint">Computer use is driving Raycast: Sora 2 - ChatGPT first, then Sora 2 - Haiku. Answers appear above as they're captured.</p>
        {:else if capturePrepared && !captureStatus?.ready_for_projects}
          <p class="hint">Capture stopped before both answers came back. Check that Raycast is open and has Accessibility access.</p>
        {:else if captureStatus?.ready_for_projects}
          <p class="hint">Both concepts are in. Open Projects to compare and approve them.</p>
        {/if}
      </section>
    {/if}

    {#if request && handoffMode === 'manual'}
      <section class="result" aria-labelledby="brief-title">
        <div class="result-head">
          <div>
            <p class="block-title">Ready for Raycast</p>
            <h2 id="brief-title">Concept brief</h2>
          </div>
          <button class="btn" type="button" onclick={copyRequest}>{copied ? 'Copied' : 'Copy brief'}</button>
        </div>
        <pre class="brief">{request}</pre>
      </section>
    {/if}
  </div>
</div>

<style>
  /*
   * The pitch room. Same language as the home page: black room, colour only
   * from footage (a blown-out frame of the latest render), Instrument Serif
   * for titles, Courier Prime for anything that reads like a script.
   * The slate is the one loud element.
   */
  .pitch {
    --pad: var(--dc-gutter-x);
    --ink: #e7e5e4;
    --ink-2: #bdb7b1;
    --ink-3: #938d87;
    --line: rgba(255, 255, 255, 0.1);
    --line-2: rgba(255, 255, 255, 0.22);
    --raise: #0e0e0e;

    position: relative;
    min-height: 100%;
    padding: clamp(20px, 3vw, 36px) 0 clamp(40px, 6vw, 80px);
    overflow-x: clip;
    background: #000;
    color: var(--ink);
  }

  @media (min-width: 861px) {
    .pitch {
      height: 100%;
      overflow-y: auto;
    }
  }

  .pitch-glow {
    position: absolute;
    inset: -20% -10% auto;
    height: 520px;
    background-position: center;
    background-size: cover;
    filter: blur(110px) saturate(1.4);
    opacity: 0.35;
    pointer-events: none;
    mask-image: linear-gradient(to bottom, #000 30%, transparent);
  }

  .pitch-wrap {
    position: relative;
    max-width: calc(var(--dc-page-max) + 2 * var(--pad));
    margin: 0 auto;
    padding: 0 max(var(--pad), var(--dc-safe-r)) 0 max(var(--pad), var(--dc-safe-l));
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* ── Header ──────────────────────────────────────────────────── */

  .pitch-head h1 {
    margin: 0;
    overflow: hidden;
    font: 400 clamp(28px, 2.6vw, 36px) / 1.15 var(--dc-font-serif);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pitch-head > p {
    max-width: 56ch;
    margin: 6px 0 0;
    color: var(--dc-text-muted);
    font-size: 14px;
    line-height: 1.55;
  }

  .modes {
    display: inline-flex;
    gap: 4px;
    margin-top: 18px;
    padding: 4px;
    border: 0;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.5);
  }

  .modes button {
    min-height: 28px;
    padding: 0 14px;
    border: 0;
    border-radius: 3px;
    background: transparent;
    color: var(--ink-2);
    font-size: 13px;
    font-weight: 550;
    cursor: pointer;
  }

  .modes button:hover {
    color: var(--ink);
  }

  .modes button.active {
    background: rgba(255, 255, 255, 0.7);
    color: #000;
  }

  /* ── Desk: form + slate ──────────────────────────────────────── */

  .desk {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(24px, 3vw, 40px);
    margin-top: clamp(24px, 3vw, 36px);
  }

  @media (min-width: 1000px) {
    .desk {
      grid-template-columns: minmax(0, 1fr) minmax(340px, 400px);
      align-items: start;
    }

    .slate-col {
      position: sticky;
      top: 24px;
    }
  }

  .desk-form {
    display: flex;
    flex-direction: column;
    gap: clamp(22px, 2.6vw, 30px);
    min-width: 0;
  }

  .block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .block-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .block-title {
    margin: 0;
    color: var(--ink);
    font-size: 14px;
    font-weight: 600;
  }

  .hint {
    margin: 0;
    color: var(--ink-2);
    font-size: 13px;
    line-height: 1.5;
  }

  .link-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 28px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: var(--ink-2);
    font-size: 13px;
    cursor: pointer;
  }

  .link-btn:hover {
    color: var(--ink);
  }

  /* Templates, dealt out like pitch cards */
  .presets {
    display: grid;
    grid-auto-columns: minmax(220px, 1fr);
    grid-auto-flow: column;
    gap: 12px;
    margin: 0 calc(-1 * var(--pad));
    padding: 0 var(--pad) 4px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--pad);
    scrollbar-width: none;
  }

  .presets::-webkit-scrollbar {
    display: none;
  }

  /* Beside the slate there's room for all three; no need to bleed or scroll. */
  @media (min-width: 1000px) {
    .presets {
      grid-auto-flow: row;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin: 0;
      padding: 0;
    }
  }

  .preset {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    padding: 18px;
    border: 0;
    border-radius: 6px;
    background: linear-gradient(160deg, #141414, #0a0a0a);
    color: inherit;
    text-align: left;
    cursor: pointer;
    scroll-snap-align: start;
    transition: border-color 0.15s ease, transform 0.15s ease;
  }

  .preset:hover {
    border-color: var(--line-2);
    transform: translateY(-2px);
  }

  .preset.active {
    border-color: transparent;
    background: #1c1c1c;
    box-shadow: inset 0 -3px 0 rgba(255, 255, 255, 0.7);
  }

  .preset-kind {
    color: var(--ink-2);
    font-size: 12px;
  }

  .preset-title {
    overflow: hidden;
    font: 400 20px / 1.15 var(--dc-font-serif);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .preset-idea {
    display: -webkit-box;
    overflow: hidden;
    color: var(--ink-3);
    font-size: 12px;
    line-height: 1.5;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  /* Script-style writing surfaces */
  .treatment {
    box-sizing: border-box;
    width: 100%;
    min-height: 220px;
    padding: clamp(18px, 2.4vw, 28px);
    border: 0;
    border-radius: 6px;
    background: var(--raise);
    color: var(--ink);
    font: 14px / 1.7 var(--dc-font-sans);
    resize: vertical;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .treatment::placeholder,
  .title-input::placeholder {
    color: var(--ink-3);
  }

  .treatment:focus {
    background: #141414;
  }

  .title-input:focus {
    border-bottom-color: rgba(255, 255, 255, 0.4);
  }

  .title-input {
    box-sizing: border-box;
    width: 100%;
    padding: 6px 0 10px;
    border: 0;
    border-bottom: 1px solid var(--line-2);
    background: transparent;
    color: var(--ink);
    font: 400 clamp(22px, 2vw, 28px) / 1.2 var(--dc-font-serif);
    outline: none;
  }

  .title-options,
  .formats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .title-options button,
  .formats button {
    min-height: 28px;
    padding: 0 14px;
    border: 0;
    border-radius: 4px;
    background: #161616;
    color: var(--ink-2);
    font-size: 13px;
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
  }

  .title-options button:hover,
  .formats button:hover {
    background: #222;
    color: var(--ink);
  }

  .title-options button.active,
  .formats button.active {
    background: rgba(255, 255, 255, 0.7);
    color: #000;
  }

  .choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    gap: 12px;
  }

  .choice {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 18px 18px 18px 48px;
    border: 0;
    border-radius: 6px;
    background: var(--raise);
    cursor: pointer;
    transition: border-color 0.15s ease;
  }

  .choice:hover {
    border-color: var(--line-2);
  }

  .choice.active {
    border-color: transparent;
    background: #1a1a1a;
  }

  .choice input {
    position: absolute;
    top: 20px;
    left: 18px;
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: var(--ink);
  }

  .choice strong {
    font-size: 14px;
    font-weight: 600;
  }

  .choice span {
    color: var(--ink-2);
    font-size: 12px;
    line-height: 1.5;
  }

  .block-split {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 12px;
  }

  .toggle,
  .reference {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 88px;
    padding: 16px 18px;
    border: 0;
    border-radius: 6px;
    background: var(--raise);
    cursor: pointer;
    transition: border-color 0.15s ease;
  }

  .toggle:hover,
  .reference:hover {
    border-color: var(--line-2);
  }

  .toggle input,
  .reference input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .toggle-track {
    position: relative;
    flex: 0 0 40px;
    height: 24px;
    border-radius: 12px;
    background: #3f3f46;
    transition: background 0.2s ease;
  }

  .toggle-track::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #d6d3d1;
    transition: transform 0.2s ease;
  }

  .toggle input:checked + .toggle-track {
    background: var(--ink);
  }

  .toggle input:checked + .toggle-track::after {
    background: #000;
    transform: translateX(16px);
  }

  .toggle input:focus-visible + .toggle-track {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
  }

  .toggle-copy {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .toggle-copy strong {
    overflow: hidden;
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toggle-copy span {
    color: var(--ink-2);
    font-size: 12px;
    line-height: 1.45;
  }

  .reference {
    border-style: dashed;
  }

  .reference.filled {
    border-style: solid;
  }

  .reference img {
    flex: 0 0 96px;
    width: 96px;
    aspect-ratio: 16 / 9;
    border-radius: 3px;
    object-fit: cover;
  }

  .reference-plus {
    display: grid;
    flex: 0 0 40px;
    place-items: center;
    height: 40px;
    border: 0;
    border-radius: 50%;
    color: var(--ink);
  }

  .reference-plus svg {
    width: 18px;
    height: 18px;
  }

  /* ── The slate ───────────────────────────────────────────────── */

  .slate {
    overflow: hidden;
    border: 0;
    border-radius: 8px;
    background: #0e0e0e;
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.7);
  }

  /* Clapper sticks */
  .slate-sticks {
    height: 28px;
    background: repeating-linear-gradient(-55deg, rgba(255, 255, 255, 0.7) 0 22px, #000 22px 44px);
  }

  .slate-body {
    padding: 22px 22px 24px;
  }

  .slate-label {
    margin: 0;
    color: var(--ink-3);
    font-size: 12px;
  }

  .slate-title {
    margin: 6px 0 0;
    overflow: hidden;
    font: 400 clamp(24px, 2.2vw, 30px) / 1.15 var(--dc-font-serif);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .slate-title.empty {
    color: var(--ink-3);
  }

  .slate-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3px;
    margin: 20px 0 0;
  }

  .slate-grid div {
    min-width: 0;
    padding: 10px 12px;
    border-radius: 3px;
    background: #161616;
  }

  .slate-grid dt,
  .result-facts dt {
    color: var(--ink-3);
    font-size: 11px;
  }

  .slate-grid dd,
  .result-facts dd {
    margin: 3px 0 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .slate-go {
    width: 100%;
    min-height: 32px;
    margin-top: 20px;
    border: 0;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.7);
    color: #000;
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .slate-go:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.8);
  }

  .slate-go:disabled {
    background: #27272a;
    color: #71717a;
    cursor: not-allowed;
  }

  .slate-go:focus-visible,
  .btn:focus-visible,
  .preset:focus-visible,
  .formats button:focus-visible,
  .title-options button:focus-visible,
  .modes button:focus-visible,
  .link-btn:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
  }

  .slate-status {
    display: flex;
    gap: 10px;
    margin: 16px 0 0;
    color: var(--ink-2);
    font-size: 13px;
    line-height: 1.5;
  }

  .slate-status code {
    color: var(--ink);
    font-family: var(--dc-font-mono);
    font-size: 12px;
    overflow-wrap: anywhere;
  }

  .dot {
    flex: 0 0 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: 50%;
    background: #f59e0b;
  }

  .dot.live {
    background: #22c55e;
  }

  .slate-error {
    margin: 12px 0 0;
    color: #fca5a5;
    font-size: 13px;
    line-height: 1.5;
  }

  /* ── Import ──────────────────────────────────────────────────── */

  .import {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(24px, 3vw, 40px);
    margin-top: clamp(40px, 5vw, 72px);
  }

  @media (min-width: 1000px) {
    .import {
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      align-items: start;
    }
  }

  .import-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border: 0;
    border-radius: 8px;
    background: var(--raise);
    color: var(--ink-2);
    font-size: 14px;
    text-align: center;
    cursor: pointer;
  }

  .import-drop strong {
    color: var(--ink);
    font: 400 clamp(20px, 2vw, 26px) / 1.2 var(--dc-font-serif);
  }

  .import-drop.filled {
    border-style: solid;
    background: #000;
  }

  .import-drop input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .import-drop video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .import-side {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .import-side .slate-go {
    margin-top: 4px;
  }

  .import-file {
    margin: 0;
    color: var(--ink-2);
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .import-file strong {
    color: var(--ink);
  }

  /* ── Run results ─────────────────────────────────────────────── */

  .result {
    margin-top: clamp(40px, 5vw, 64px);
    padding: clamp(20px, 2.5vw, 32px);
    border: 0;
    border-radius: 8px;
    background: var(--raise);
  }

  .result-head {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: 16px;
  }

  .result-head h2 {
    margin: 4px 0 0;
    overflow: hidden;
    font: 400 clamp(22px, 2.2vw, 30px) / 1.15 var(--dc-font-serif);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .btn {
    min-height: 28px;
    padding: 0 20px;
    border: 0;
    border-radius: 3px;
    background: transparent;
    color: var(--ink);
    font-size: 14px;
    font-weight: 550;
    cursor: pointer;
  }

  .btn:hover {
    border-color: var(--ink);
  }

  .result-facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr));
    gap: 16px;
    margin: 24px 0 0;
    padding-top: 20px;
    border-top: 1px solid var(--line);
  }

  .result-models {
    display: grid;
    gap: 8px;
    margin: 20px 0 0;
    padding: 0;
    list-style: none;
  }

  .result-models li {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) auto;
    gap: 12px;
    padding: 12px 14px;
    border: 0;
    border-radius: 4px;
    color: var(--ink-2);
    font-size: 13px;
  }

  .result-models strong {
    color: var(--ink);
  }

  .result-state {
    text-transform: capitalize;
  }

  .result-models li[data-status='captured'],
  .result-answers article[data-status='valid'] {
    border-color: rgba(34, 197, 94, 0.5);
  }

  .result-models li[data-status='invalid'],
  .result-answers article[data-status='invalid'] {
    border-color: rgba(248, 113, 113, 0.5);
  }

  .result-answers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .result-answers article {
    padding: 18px;
    border: 0;
    border-radius: 6px;
    background: #000;
  }

  .result-answers header {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    color: var(--ink-2);
    font-size: 13px;
  }

  .result-answers header strong {
    color: var(--ink);
  }

  .result-answers h3 {
    margin: 10px 0 6px;
    font: 400 20px / 1.2 var(--dc-font-serif);
  }

  .result-answers p {
    margin: 0;
    color: var(--ink-2);
    font-size: 14px;
    line-height: 1.55;
  }

  .result .hint {
    margin-top: 16px;
  }

  .brief {
    max-height: 460px;
    margin: 20px 0 0;
    padding: clamp(18px, 2.4vw, 28px);
    overflow: auto;
    border: 0;
    border-radius: 6px;
    background: #000;
    color: #d6d3d1;
    font: 13px / 1.7 var(--dc-font-sans);
    white-space: pre-wrap;
  }

  @media (max-width: 420px) {
    .slate-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .modes {
      display: flex;
    }

    .modes button {
      flex: 1;
      padding: 0 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .preset,
    .toggle-track,
    .toggle-track::after {
      transition: none;
    }
  }
</style>
