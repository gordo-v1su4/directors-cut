<script lang="ts">
  import { goto } from '$app/navigation';
  import { onDestroy } from 'svelte';
  import { buildCanonicalConceptBrief, QUICK_START_PRESETS, resolveProjectTitle, suggestTitleOptions, type CaptureHandoffMode } from '$lib/create/brief';
  import { callBridgeTool } from '$lib/bridge/types';
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
  let automatedRun = $state<CreateComparisonRunOutput | null>(null);
  let capturePrepared = $state<PrepareConceptCaptureOutput | null>(null);
  let captureRunning = $state(false);
  let captureStatus = $state<GetConceptCaptureStatusOutput | null>(null);
  let pollTimer: ReturnType<typeof setInterval> | undefined;

  const BRIDGE_URL = import.meta.env.VITE_RAYCAST_BRIDGE_URL ?? 'http://127.0.0.1:8787';
  const BRIDGE_TOKEN = import.meta.env.VITE_RAYCAST_BRIDGE_TOKEN ?? '';

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
</script>

<svelte:head><title>Create — Directors Cut</title></svelte:head>

<div class="dc-create-page">
  <div class="dc-create-shell">
    <header class="dc-create-header">
      <div><p class="dc-eyebrow">New prompt project</p><h1>What do you want to make?</h1></div>
      <p>Start with a rough idea. Choose manual Raycast Script Commands or automated capture via Cursor computer use + the bridge.</p>
    </header>

    <div class="dc-create-tabs" role="tablist" aria-label="Project workflow">
      <button class:dc-create-tab-active={mode === 'create'} type="button" role="tab" aria-selected={mode === 'create'} onclick={() => switchMode('create')}>Create</button>
      <button class="dc-create-tab-ingest" class:dc-create-tab-active={mode === 'ingest'} type="button" role="tab" aria-selected={mode === 'ingest'} onclick={() => switchMode('ingest')}>Ingest</button>
    </div>

    {#if mode === 'create'}
    <section class="dc-create-form">
        <div class="dc-quick-starts">
          <span class="dc-quick-starts-label">Quick start</span>
          <div class="dc-quick-start-row">
            {#each QUICK_START_PRESETS as preset (preset.id)}
              <button class="dc-quick-start-chip" type="button" onclick={() => applyPreset(preset)}>{preset.label}</button>
            {/each}
          </div>
        </div>

        <div class="dc-field dc-field-idea">
          <div class="dc-field-heading"><label for="creative-idea">Creative idea</label><button class="dc-wand" type="button" onclick={useSamplePrompt} aria-label="Use a sample prompt from the library" title="Use a library sample"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4 5 5L8.5 20.5a2.1 2.1 0 0 1-3 0l-2-2a2.1 2.1 0 0 1 0-3L15 4Zm-1 3 3 3M6 3v3M4.5 4.5h3M19 15v4M17 17h4M18 2v2M17 3h2"/></svg><span>Try an example</span></button></div>
          <div class="dc-idea-wrap"><textarea id="creative-idea" bind:value={idea} rows="8" placeholder="A 15-second fashion trailer in a rain-soaked motel. One woman, electric-blue light, uneasy handheld camera, ending on a hard title reveal..."></textarea></div>
          {#if sampleSource}<span class="dc-sample-source">Adapted from <strong>{sampleSource}</strong> · click the wand again for another</span>{/if}
        </div>

        <label class="dc-field">
          <span>Project title</span>
          <input
            class="dc-text-input"
            bind:value={projectTitle}
            placeholder="Auto-generated from your idea"
            oninput={() => { titleManuallyEdited = true; }}
          />
          {#if titleOptions.length}
            <div class="dc-title-options">
              {#each titleOptions as option (option)}
                <button
                  class="dc-title-option"
                  class:dc-title-option-active={projectTitle === option}
                  type="button"
                  onclick={() => selectTitle(option)}
                >{option}</button>
              {/each}
            </div>
          {/if}
        </label>

        <div class="dc-create-options">
          <label class="dc-field"><span>Output</span><select bind:value={format}><option value="trailer">Trailer / teaser</option><option value="music video">Music video</option><option value="commercial">Commercial</option><option value="short film scene">Short film scene</option><option value="visual concept">Visual concept</option></select></label>
          <label class="dc-field"><span>Duration</span><select bind:value={duration} disabled><option value="12">12 seconds</option></select></label>
        </div>

        <fieldset class="dc-handoff-mode">
          <legend>Raycast handoff</legend>
          <label class:dc-handoff-active={handoffMode === 'automated'}>
            <input type="radio" name="handoff-mode" value="automated" bind:group={handoffMode} />
            <span><strong>Automated</strong><small>Bridge creates the run · Cursor agent captures ChatGPT + Claude with computer use</small></span>
          </label>
          <label class:dc-handoff-active={handoffMode === 'manual'}>
            <input type="radio" name="handoff-mode" value="manual" bind:group={handoffMode} />
            <span><strong>Manual</strong><small>Copy the canonical brief · run Raycast Script Commands yourself</small></span>
          </label>
        </fieldset>

        <fieldset class="dc-targets">
          <legend>First vertical slice</legend>
          <label><input type="checkbox" bind:checked={targetSora} disabled /> <span><strong>Sora · 12 seconds</strong><small>ChatGPT and Claude each develop one independent concept through Raycast</small></span></label>
          <label><input type="checkbox" bind:checked={includeAudio} /> <span><strong>Integrated sound</strong><small>Music, ambience, dialogue, rhythm, and SFX stay inside the video prompt</small></span></label>
        </fieldset>

        <label class="dc-reference-drop">
          <input type="file" accept="image/*" onchange={handleReference} />
          {#if referenceUrl}<img src={referenceUrl} alt="Selected visual reference" /><div><strong>{referenceName}</strong><span>Reference stays local until a prompt-agent connection is added.</span></div>{:else}<div class="dc-reference-icon">+</div><div><strong>Add a visual reference</strong><span>Character, product, location, frame, or mood image</span></div>{/if}
        </label>

        <div class="dc-submit-row">
          <button class="dc-prepare-button" disabled={!canSubmit} onclick={startConceptRun}>
            {busy ? 'Working…' : handoffMode === 'manual' ? 'Prepare Raycast concept run' : 'Start automated concept run'}
          </button>
          <div class="dc-connection-note">
            <span class="dc-status-dot" class:dc-status-live={!!BRIDGE_TOKEN}></span>
            <span>
              {#if handoffMode === 'manual'}
                Next: copy the brief and run “Start Directors Cut Concept Run” in Raycast.
              {:else if BRIDGE_TOKEN}
                Bridge connected. Automated mode drives Raycast via computer use and streams answers here.
              {:else}
                Set <code>VITE_RAYCAST_BRIDGE_TOKEN</code> in <code>.env.local</code> for automated capture, or switch to Manual.
              {/if}
            </span>
          </div>
        </div>
        {#if error}<p class="dc-create-error">{error}</p>{/if}
    </section>
    {:else}
    <section class="dc-ingest-panel" aria-labelledby="ingest-title">
      <div class="dc-ingest-copy">
        <p class="dc-eyebrow">Existing work</p>
        <h2 id="ingest-title">Bring a finished video into the workspace.</h2>
        <p>Upload the finished cut and its prompt. The project record, category, title, and comparison entry can be enriched from there.</p>
      </div>

      <label class="dc-ingest-drop" class:dc-ingest-drop-ready={!!ingestFile}>
        <input type="file" accept="video/*" onchange={handleIngestFile} />
        {#if ingestFile}
          <video src={ingestUrl} muted controls playsinline aria-label="Selected video preview"></video>
          <div class="dc-ingest-file"><strong>{ingestFile.name}</strong><span>{(ingestFile.size / 1024 / 1024).toFixed(1)} MB · ready to ingest</span></div>
        {:else}
          <span class="dc-ingest-plus">+</span>
          <strong>Drop a finished video here</strong>
          <span>MP4, WebM, or MOV · 16:9 preferred</span>
        {/if}
      </label>

      <label class="dc-field dc-ingest-prompt">
        <span>Original prompt</span>
        <textarea bind:value={ingestPrompt} rows="7" placeholder="Paste the prompt used to make this video. The AI will use it to name, categorize, and describe the project."></textarea>
      </label>

      <div class="dc-ingest-actions">
        <button class="dc-prepare-button" type="button" disabled={!ingestFile || !ingestPrompt.trim() || ingestBusy} onclick={ingestProject}>{ingestBusy ? 'Preparing project…' : ingestReady ? 'Project ready' : 'Analyze and add to projects'}</button>
        <p class="dc-connection-note">Video and prompt are the only required inputs. Metadata can be edited from the comparison table after ingest.</p>
      </div>
      {#if ingestReady}
        <div class="dc-ingest-result"><span class="dc-status-dot dc-status-live"></span><strong>Ingest staged</strong><span>AI enrichment will use the supplied prompt to populate the project card and category.</span></div>
      {/if}
    </section>
    {/if}

    {#if automatedRun}
      <section class="dc-request-panel dc-automated-panel">
        <div class="dc-request-header">
          <div><span class="dc-column-kicker">Automated run created</span><h2>{automatedRun.title}</h2></div>
          <button onclick={openProjects}>Open Projects</button>
        </div>
        <div class="dc-automated-meta">
          <div><span>Run ID</span><strong>{automatedRun.run_id}</strong></div>
          <div><span>Status</span><strong>{captureStatus?.run_status ?? automatedRun.run_status}</strong></div>
          <div><span>Captured</span><strong>{captureStatus?.captured_valid_count ?? 0} / 2 valid</strong></div>
          <div><span>Computer use</span><strong>{captureRunning ? 'running…' : captureStatus?.capture_job_status ?? 'idle'}</strong></div>
        </div>
        {#if captureStatus}
          <ul class="dc-capture-model-list">
            {#each captureStatus.models as model (model.label)}
              <li data-status={model.status}>
                <span>{model.label}</span>
                <span>{model.raycast_agent}</span>
                <span>{model.status}</span>
              </li>
            {/each}
          </ul>
        {/if}
        {#if captureStatus?.answers?.length}
          <div class="dc-captured-answers">
            {#each captureStatus.answers as answer (answer.answer_id)}
              <article data-status={answer.structure_status}>
                <header>
                  <strong>{answer.model_name}</strong>
                  <span>{answer.structure_status}</span>
                </header>
                {#if answer.title}<h3>{answer.title}</h3>{/if}
                {#if answer.logline}<p>{answer.logline}</p>{/if}
              </article>
            {/each}
          </div>
        {/if}
        {#if captureRunning}
          <p class="dc-agent-prompt">Computer use is driving Raycast (<strong>Sora 2 - ChatGPT</strong>, then <strong>Sora 2 - Haiku</strong>). Answers will appear above when captured.</p>
        {:else if capturePrepared && !captureStatus?.ready_for_projects}
          <p class="dc-agent-prompt">Capture finished or stalled. Check Raycast is open and Accessibility is granted to Raycast / Cursor.</p>
        {:else if captureStatus?.ready_for_projects}
          <p class="dc-agent-prompt">Both concepts captured. Open Projects to compare and approve.</p>
        {/if}
      </section>
    {/if}

    {#if request && handoffMode === 'manual'}
      <section class="dc-request-panel">
        <div class="dc-request-header"><div><span class="dc-column-kicker">Ready for Raycast</span><h2>Canonical concept brief</h2></div><button onclick={copyRequest}>{copied ? 'Copied' : 'Copy for Raycast'}</button></div>
        <pre>{request}</pre>
      </section>
    {/if}
  </div>
</div>

<style>
  /* Mobile scrolls the document; desktop keeps the fixed-height workspace. */
  .dc-create-page { padding: 22px var(--dc-page-pad) 44px; }
  @media (min-width: 861px) { .dc-create-page { height: 100%; overflow-y: auto; padding: 34px clamp(18px,4vw,52px) 52px; } }
  .dc-create-shell { max-width: 860px; margin: 0 auto; }
  .dc-create-header { padding-bottom: 25px; border-bottom: 1px solid var(--dc-border); }
  .dc-create-header h1 { margin: 0; font-size: clamp(30px,5vw,48px); letter-spacing: -.05em; line-height: 1; }
  .dc-create-header > p { max-width: 650px; margin: 14px 0 0; color: var(--dc-text-muted); font-size: 12px; line-height: 1.6; }
  .dc-create-form { display: flex; flex-direction: column; gap: 18px; padding-top: 26px; }
  .dc-quick-starts { display: flex; flex-direction: column; gap: 8px; }
  .dc-quick-starts-label { color: var(--dc-text-muted); font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .dc-quick-start-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .dc-quick-start-chip { padding: 8px 10px; border: 1px solid var(--dc-border); border-radius: 999px; background: var(--dc-bg-elev); color: var(--dc-text-muted); font-size: 10px; cursor: pointer; }
  .dc-quick-start-chip:hover { border-color: #71717a; color: var(--dc-text); }
  .dc-title-options { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
  .dc-title-option { padding: 6px 8px; border: 1px solid var(--dc-border); border-radius: 999px; background: #0d0d0f; color: var(--dc-text-dim); font-size: 9px; cursor: pointer; }
  .dc-title-option:hover { border-color: #52525b; color: var(--dc-text-muted); }
  .dc-title-option-active { border-color: #a1a1aa; color: var(--dc-text); }
  .dc-field { display: flex; flex-direction: column; gap: 7px; }
  .dc-field > span, .dc-targets legend, .dc-handoff-mode legend, .dc-field-heading label { color: var(--dc-text-muted); font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
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
  .dc-handoff-mode { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 0; padding: 0; border: 0; }
  .dc-handoff-mode legend { margin-bottom: 8px; }
  .dc-handoff-mode label { display: flex; gap: 9px; padding: 12px; border: 1px solid var(--dc-border); border-radius: var(--dc-radius); background: var(--dc-bg-elev); cursor: pointer; min-height: 44px; }
  .dc-handoff-active { border-color: #71717a; }
  .dc-handoff-mode input { accent-color: #fafafa; }
  .dc-handoff-mode span { display: flex; flex-direction: column; gap: 3px; }
  .dc-handoff-mode strong { color: var(--dc-text); font-size: 11px; }
  .dc-handoff-mode small { color: var(--dc-text-dim); font-size: 9px; line-height: 1.3; }
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
  .dc-connection-note code { font-family: var(--dc-font-mono); color: var(--dc-text-muted); }
  .dc-status-dot { flex: 0 0 auto; width: 6px; height: 6px; margin-top: 4px; border-radius: 50%; background: #f59e0b; }
  .dc-status-live { background: #22c55e; }
  .dc-create-error { margin: 0; color: #f87171; font-size: 11px; line-height: 1.5; }
  .dc-request-panel { margin-top: 28px; padding: 18px; border: 1px solid var(--dc-border); border-radius: 8px; background: var(--dc-bg-elev); }
  .dc-request-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid var(--dc-border); }
  .dc-request-header h2 { margin: 4px 0 0; font-size: 15px; }
  .dc-request-header button { padding: 6px 9px; border: 1px solid var(--dc-border); border-radius: 4px; background: transparent; color: var(--dc-text-muted); font-size: 9px; cursor: pointer; }
  .dc-request-panel pre { max-height: 440px; overflow: auto; margin: 16px 0 0; color: var(--dc-text-muted); font-family: var(--dc-font-mono); font-size: 10px; line-height: 1.6; white-space: pre-wrap; }
  .dc-automated-meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 16px; }
  .dc-automated-meta div { display: flex; flex-direction: column; gap: 4px; padding: 10px; border: 1px solid var(--dc-border); border-radius: var(--dc-radius); background: #0d0d0f; }
  .dc-automated-meta span { color: var(--dc-text-dim); font-size: 9px; text-transform: uppercase; letter-spacing: .08em; }
  .dc-automated-meta strong { color: var(--dc-text); font-size: 11px; word-break: break-word; }
  .dc-capture-model-list { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 6px; }
  .dc-capture-model-list li { display: grid; grid-template-columns: 80px 1fr 80px; gap: 8px; padding: 8px 10px; border: 1px solid var(--dc-border); border-radius: var(--dc-radius); font-size: 10px; color: var(--dc-text-muted); }
  .dc-capture-model-list li[data-status='captured'] { border-color: #166534; }
  .dc-capture-model-list li[data-status='invalid'] { border-color: #991b1b; }
  .dc-captured-answers { display: grid; gap: 10px; margin-top: 16px; }
  .dc-captured-answers article { padding: 12px; border: 1px solid var(--dc-border); border-radius: var(--dc-radius); background: #0d0d0f; }
  .dc-captured-answers article[data-status='valid'] { border-color: #166534; }
  .dc-captured-answers article[data-status='invalid'] { border-color: #991b1b; }
  .dc-captured-answers header { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 6px; font-size: 10px; color: var(--dc-text-muted); text-transform: uppercase; letter-spacing: .06em; }
  .dc-captured-answers h3 { margin: 0 0 6px; font-size: 13px; color: var(--dc-text); }
  .dc-captured-answers p { margin: 0; font-size: 11px; line-height: 1.5; color: var(--dc-text-muted); }
  .dc-agent-prompt { margin: 14px 0 0; color: var(--dc-text-muted); font-size: 11px; line-height: 1.5; }
  @media(max-width:700px){.dc-targets,.dc-handoff-mode{grid-template-columns:1fr}.dc-submit-row,.dc-automated-meta{grid-template-columns:1fr}.dc-create-options{grid-template-columns:1fr}}

  @media (max-width: 860px) {
    .dc-create-header { padding-bottom: 18px; }
    .dc-create-header h1 { font-size: clamp(28px, 8vw, 36px); }
    .dc-create-header > p { font-size: 13px; }

    /* Anything under 16px makes iOS Safari zoom the viewport on focus, which
       leaves the form off-centre and needs a pinch to recover. */
    .dc-field textarea,
    .dc-field select,
    .dc-text-input { font-size: 16px; }
    .dc-field select { min-height: var(--dc-tap); }
    .dc-field textarea { min-height: 150px; }

    /* Chips and toggles need real thumb targets. */
    .dc-quick-start-chip,
    .dc-title-option,
    .dc-wand { min-height: 38px; padding-inline: 13px; font-size: 12px; }
    .dc-quick-start-row { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-inline: calc(var(--dc-page-pad) * -1); padding-inline: var(--dc-page-pad); }
    .dc-quick-start-row::-webkit-scrollbar { display: none; }
    .dc-quick-start-chip { flex: 0 0 auto; }

    .dc-prepare-button { width: 100%; font-size: 15px; }
    .dc-request-header { align-items: flex-start; flex-direction: column; }
    .dc-request-header button { min-height: 38px; padding-inline: 14px; font-size: 12px; }
    .dc-request-panel { padding: 14px; }
    .dc-request-panel pre { max-height: 300px; font-size: 11px; }
    .dc-capture-model-list li { grid-template-columns: 1fr; font-size: 12px; }
    .dc-connection-note { font-size: 11px; }
  }
</style>
