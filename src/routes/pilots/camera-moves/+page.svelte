<script lang="ts">
  import CameraMoveCanvas from '$lib/components/CameraMoveCanvas.svelte';
  import { cameraMoves, type CameraMove } from '$lib/data/camera-moves';
  import { specialtyShots } from '$lib/data/specialty-shots';

  let query = $state('');
  let family = $state('All');
  let selected = $state<CameraMove | null>(null);
  let promptModel = $state<'Seedance' | 'LTX-2.3'>('Seedance');
  let copied = $state(false);

  const families = ['All', ...new Set(cameraMoves.map((move) => move.family))];
  let filtered = $derived(cameraMoves.filter((move) => {
    const matchesFamily = family === 'All' || move.family === family;
    const haystack = `${move.name} ${move.family} ${move.description} ${move.intention}`.toLowerCase();
    return matchesFamily && haystack.includes(query.trim().toLowerCase());
  }));
  // Existing alternate prompts remain placeholders while this pilot is exploratory.
  let activePrompt = $derived(selected ? (promptModel === 'Seedance' ? selected.seedancePrompt : selected.soraPrompt) : '');

  function openMove(move: CameraMove) { selected = move; copied = false; }
  function closeMove() { selected = null; copied = false; }
  async function copyPrompt() { await navigator.clipboard.writeText(activePrompt); copied = true; }
</script>

<svelte:head><title>Camera Techniques — Directors Cut</title></svelte:head>

{#if selected}
  <div class="move-dialog-backdrop" role="presentation" onclick={(event) => event.target === event.currentTarget && closeMove()}>
    <div class="move-dialog" role="dialog" aria-modal="true" aria-labelledby="move-title">
      <button class="move-dialog-close" onclick={closeMove} aria-label="Close camera move">×</button>
      <div class="move-dialog-visual"><CameraMoveCanvas type={selected.type} label={selected.name} /></div>
      <div class="move-dialog-body">
        <div class="move-dialog-heading"><div><span>{selected.family} camera move</span><h2 id="move-title">{selected.name}</h2></div><div class="move-specs"><span>{selected.duration}s</span><span>{selected.lens}</span><span>Silent</span></div></div>
        <p class="move-dialog-description">{selected.description}</p>
        <p class="move-intention">Best for: {selected.intention}</p>
        <div class="move-prompt-tabs" role="tablist" aria-label="Prompt model">
          <button class:active={promptModel === 'Seedance'} onclick={() => { promptModel = 'Seedance'; copied = false; }}>Seedance</button>
          <button class:active={promptModel === 'LTX-2.3'} onclick={() => { promptModel = 'LTX-2.3'; copied = false; }}>LTX-2.3</button>
        </div>
        <div class="move-prompt"><p>{activePrompt}</p><button onclick={copyPrompt}>{copied ? 'Copied' : `Copy ${promptModel} prompt`}</button></div>
      </div>
    </div>
  </div>
{/if}

<div class="techniques-page">
  <header class="techniques-header">
    <div><p class="dc-eyebrow">Visual technique library</p><h1>Camera moves, made promptable.</h1><p>Silent procedural previews rendered through one shared WebGPU device. Choose a move, then copy a prompt for Seedance or open-source LTX-2.3.</p></div>
    <div class="techniques-engine"><span class="engine-pulse"></span><strong>Shared GPU engine</strong><small>{cameraMoves.length} live canvases · visible cards only</small></div>
  </header>

  <div class="techniques-toolbar">
    <label class="technique-search"><span>Search</span><input bind:value={query} placeholder="Orbit, reveal, tension…" /></label>
    <div class="family-filter" aria-label="Camera move families">
      {#each families as option}<button class:active={family === option} onclick={() => family = option}>{option}</button>{/each}
    </div>
  </div>

  <div class="techniques-result-bar"><span>{filtered.length} techniques</span><span>Camera path · focal target · prompt</span></div>

  <section class="technique-grid" aria-label="Camera move techniques">
    {#each filtered as move (move.slug)}
      <button class="technique-card" onclick={() => openMove(move)}>
        <CameraMoveCanvas type={move.type} label={move.name} />
        <div class="technique-card-body">
          <div class="technique-card-heading"><div><span>{move.family}</span><h2>{move.name}</h2></div><span class="technique-duration">{move.duration}s</span></div>
          <p>{move.description}</p>
          <div class="technique-card-footer"><span>{move.intention}</span><span>{move.lens} →</span></div>
        </div>
      </button>
    {/each}
  </section>

  <section class="specialty-section" aria-labelledby="specialty-title">
    <div class="specialty-heading">
      <div><p class="dc-eyebrow">Next collection · placeholders</p><h2 id="specialty-title">Specialty shots</h2></div>
      <p>The high-value layer: recognizable effects mapped to capture, generation, and post-production recipes.</p>
    </div>
    <div class="specialty-grid">
      {#each specialtyShots as shot, index (shot.slug)}
        <article class="specialty-card">
          <div class="specialty-visual" aria-hidden="true">
            <span class="specialty-index">{String(index + 1).padStart(2, '0')}</span>
            <div class="specialty-mark"><i></i><i></i><i></i></div>
            <span class="specialty-family">{shot.family}</span>
          </div>
          <div class="specialty-copy">
            <div class="specialty-title-row"><h3>{shot.name}</h3><span class:method-capture={shot.method === 'Capture'} class:method-generate={shot.method === 'Generate'} class:method-edit={shot.method === 'Edit'} class:method-hybrid={shot.method === 'Hybrid'}>{shot.method}</span></div>
            <p>{shot.description}</p>
            <small>{shot.recipe}</small>
          </div>
        </article>
      {/each}
    </div>
  </section>
</div>

<style>
  .techniques-page { height: 100%; overflow-y: auto; padding: 38px clamp(18px,4vw,54px) 70px; }
  .techniques-header { max-width: 1380px; margin: 0 auto 30px; display: flex; align-items: end; justify-content: space-between; gap: 30px; }
  .techniques-header h1 { max-width: 760px; margin: 0; font-size: clamp(34px,5vw,64px); line-height: .96; letter-spacing: -.055em; }
  .techniques-header p:last-child { max-width: 650px; margin: 18px 0 0; color: var(--dc-text-muted); font-size: 13px; line-height: 1.6; }
  .techniques-engine { flex: 0 0 auto; display: grid; grid-template-columns: auto 1fr; align-items: center; column-gap: 8px; padding: 12px 14px; border: 1px solid var(--dc-border); border-radius: 8px; background: var(--dc-bg-elev); }
  .techniques-engine strong { color: var(--dc-text); font-size: 10px; }.techniques-engine small{grid-column:2;color:var(--dc-text-dim);font-size:9px}
  .engine-pulse { grid-row: 1/3; width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 0 4px rgba(245,158,11,.1); }
  .techniques-toolbar { max-width: 1380px; margin: 0 auto; display: flex; align-items: end; justify-content: space-between; gap: 20px; padding-block: 18px; border-block: 1px solid var(--dc-border); }
  .technique-search { width: min(310px,100%); display: flex; flex-direction: column; gap: 6px; }.technique-search span{color:var(--dc-text-dim);font-size:8px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.technique-search input{width:100%;box-sizing:border-box;padding:9px 11px;border:1px solid var(--dc-border);border-radius:6px;background:#0d0d0f;color:var(--dc-text);outline:none;font-size:11px}.technique-search input:focus{border-color:#52525b}
  .family-filter { display: flex; flex-wrap: wrap; justify-content: end; gap: 5px; }.family-filter button{padding:6px 9px;border:1px solid var(--dc-border);border-radius:999px;background:transparent;color:var(--dc-text-dim);font-size:9px;cursor:pointer}.family-filter button:hover,.family-filter button.active{border-color:#52525b;background:#1b1b1e;color:var(--dc-text)}
  .techniques-result-bar { max-width: 1380px; margin: 14px auto 10px; display:flex;justify-content:space-between;color:var(--dc-text-dim);font-size:9px;text-transform:uppercase;letter-spacing:.08em }
  .technique-grid { max-width: 1380px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
  .technique-card { min-width:0;overflow:hidden;padding:0;border:1px solid var(--dc-border);border-radius:8px;background:var(--dc-bg-elev);color:inherit;text-align:left;cursor:pointer;transition:transform .18s ease,border-color .18s ease,background .18s ease}.technique-card:hover,.technique-card:focus-visible{transform:translateY(-2px);border-color:#52525b;background:#151518;outline:none}
  .technique-card-body { padding: 12px; }.technique-card-heading{display:flex;align-items:start;justify-content:space-between;gap:12px}.technique-card-heading span:first-child{color:var(--dc-text-dim);font-size:8px;text-transform:uppercase;letter-spacing:.1em}.technique-card h2{margin:3px 0 0;font-size:16px;letter-spacing:-.025em}.technique-duration{padding:3px 6px;border:1px solid var(--dc-border);border-radius:999px;color:var(--dc-text-muted);font-size:8px}.technique-card-body>p{min-height:38px;margin:11px 0;color:var(--dc-text-muted);font-size:10px;line-height:1.55}.technique-card-footer{display:flex;justify-content:space-between;gap:10px;padding-top:9px;border-top:1px solid var(--dc-border-subtle);color:var(--dc-text-dim);font-size:8px;text-transform:uppercase;letter-spacing:.04em}
  .specialty-section{max-width:1380px;margin:72px auto 0;padding-top:28px;border-top:1px solid var(--dc-border)}.specialty-heading{display:flex;align-items:end;justify-content:space-between;gap:28px;margin-bottom:18px}.specialty-heading h2{margin:0;font-size:clamp(28px,4vw,46px);letter-spacing:-.045em}.specialty-heading>p{max-width:470px;margin:0;color:var(--dc-text-muted);font-size:12px;line-height:1.6}.specialty-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.specialty-card{min-width:0;overflow:hidden;border:1px solid var(--dc-border);border-radius:8px;background:var(--dc-bg-elev)}.specialty-visual{position:relative;aspect-ratio:16/8;overflow:hidden;background:linear-gradient(145deg,#08080a,#161619);border-bottom:1px solid var(--dc-border)}.specialty-visual::before,.specialty-visual::after{content:'';position:absolute;inset:50% auto auto 50%;width:145%;height:1px;background:#2f2f35;transform:translate(-50%,-50%) rotate(-18deg)}.specialty-visual::after{transform:translate(-50%,-50%) rotate(18deg)}.specialty-index{position:absolute;left:10px;top:8px;color:#3f3f46;font-family:var(--dc-font-mono);font-size:10px}.specialty-family{position:absolute;right:9px;bottom:8px;color:#71717a;font-size:7px;letter-spacing:.12em;text-transform:uppercase}.specialty-mark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:5px}.specialty-mark i{display:block;width:7px;height:34px;border:1px solid #71717a;border-radius:99px;transform:skewX(-18deg)}.specialty-mark i:nth-child(2){height:52px;border-color:#d4d4d8}.specialty-mark i:nth-child(3){transform:skewX(18deg)}.specialty-copy{padding:12px}.specialty-title-row{display:flex;align-items:start;justify-content:space-between;gap:8px}.specialty-title-row h3{margin:0;font-size:14px;letter-spacing:-.02em}.specialty-title-row span{padding:3px 5px;border:1px solid #3f3f46;border-radius:999px;color:#a1a1aa;font-size:7px;text-transform:uppercase;letter-spacing:.06em}.specialty-title-row span.method-generate{border-color:#57534e;color:#d6d3d1}.specialty-title-row span.method-edit{border-style:dashed}.specialty-title-row span.method-hybrid{border-color:#52525b;background:#1b1b1e;color:#e4e4e7}.specialty-copy p{min-height:44px;margin:10px 0;color:var(--dc-text-muted);font-size:10px;line-height:1.5}.specialty-copy small{display:block;padding-top:9px;border-top:1px solid var(--dc-border-subtle);color:var(--dc-text-dim);font-size:8px;line-height:1.45}
  .move-dialog-backdrop { position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:22px;background:rgba(0,0,0,.78);backdrop-filter:blur(12px) }
  .move-dialog { position:relative;width:min(1040px,95vw);max-height:92vh;overflow:auto;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(340px,.85fr);border:1px solid #3f3f46;border-radius:10px;background:#0d0d0f;box-shadow:0 28px 90px rgba(0,0,0,.7) }.move-dialog-close{position:absolute;right:10px;top:10px;z-index:2;width:28px;height:28px;border:1px solid rgba(255,255,255,.14);border-radius:50%;background:rgba(0,0,0,.65);color:#fafafa;font-size:18px;cursor:pointer}.move-dialog-visual{min-height:100%;display:grid;align-items:center;background:#050506}.move-dialog-body{padding:32px}.move-dialog-heading{display:flex;justify-content:space-between;align-items:start;gap:18px}.move-dialog-heading>div>span{color:var(--dc-text-dim);font-size:8px;text-transform:uppercase;letter-spacing:.1em}.move-dialog h2{margin:4px 0 0;font-size:31px;letter-spacing:-.045em}.move-specs{display:flex;gap:4px}.move-specs span{padding:4px 6px;border:1px solid var(--dc-border);border-radius:999px;color:var(--dc-text-muted);font-size:8px}.move-dialog-description{margin:20px 0 8px;color:var(--dc-text-muted);font-size:12px;line-height:1.6}.move-intention{margin:0;color:var(--dc-text-dim);font-size:10px}.move-prompt-tabs{display:flex;gap:4px;margin-top:26px}.move-prompt-tabs button{padding:6px 10px;border:1px solid var(--dc-border);background:transparent;color:var(--dc-text-dim);font-size:9px;cursor:pointer}.move-prompt-tabs button.active{background:var(--dc-text);color:var(--dc-bg)}.move-prompt{margin-top:8px;padding:14px;border:1px solid var(--dc-border);border-radius:6px;background:#09090b}.move-prompt p{min-height:115px;margin:0;color:var(--dc-text-muted);font-family:var(--dc-font-mono);font-size:10px;line-height:1.65}.move-prompt button{width:100%;margin-top:14px;padding:9px;border:0;border-radius:4px;background:#fafafa;color:#09090b;font-size:10px;font-weight:700;cursor:pointer}
  @media(max-width:1100px){.specialty-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
  @media(max-width:980px){.technique-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.specialty-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.move-dialog{grid-template-columns:1fr}.move-dialog-visual{min-height:320px}}
  @media(max-width:680px){.techniques-header,.techniques-toolbar,.specialty-heading{align-items:start;flex-direction:column}.family-filter{justify-content:start}.technique-grid,.specialty-grid{grid-template-columns:1fr}.techniques-engine{display:none}.move-dialog-body{padding:24px}.move-dialog-heading{flex-direction:column}.move-dialog-backdrop{padding:8px}}
</style>
