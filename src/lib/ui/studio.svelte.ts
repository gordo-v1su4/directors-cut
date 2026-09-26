/**
 * The screening room's shared view of the catalog: every project with its
 * playable takes, the newest take across the studio, and the director's
 * viewing preferences. The nav, Home and Projects all read from here so a
 * take is numbered and labelled the same way on every page.
 */
import { loadComparisonRun, loadComparisonsIndex } from '$lib/data/comparisons';
import { showTitle } from '$lib/data/titles';
import { videoModel } from '$lib/data/version-context';
import type { ComparisonArtifact, ComparisonRunDetail, ComparisonRunSummary } from '$lib/types/comparison';

export interface Take {
  id: string;
  runId: string;
  /** "v3": the take's version, or its place in the project when unnumbered. */
  code: string;
  number: number;
  writer: string;
  model: string;
  selected: boolean;
  isNewest: boolean;
  createdAt: string;
  artifact: ComparisonArtifact;
}

export interface Project {
  runId: string;
  title: string;
  fullTitle: string;
  logline: string;
  status: string;
  created: string;
  summary: ComparisonRunSummary;
  detail: ComparisonRunDetail;
  /** Oldest first, so v1 is the first take and the last is the newest. */
  takes: Take[];
  shotGrids: ComparisonArtifact[];
}

export function isVideo(artifact: ComparisonArtifact) {
  return artifact.artifact_type === 'video_result' || artifact.artifact_type === 'end_video';
}

export function statusLabel(status: string | undefined) {
  const text = (status ?? 'active').replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function modelLabel(artifact: ComparisonArtifact) {
  const model = videoModel(artifact);
  if (model !== 'Model not set') return model;
  if (artifact.provider === 'sora' || artifact.provider === 'direct_sora') return 'Sora 2';
  if (artifact.provider === 'seedance') return 'Seedance';
  return '';
}

export function timecode(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

export function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function loglineOf(detail: ComparisonRunDetail, summary: ComparisonRunSummary) {
  if (detail.logline) return detail.logline;
  for (const answer of detail.answers) {
    const concept = answer.structured_prompt;
    if (concept && typeof concept === 'object' && !Array.isArray(concept) && 'logline' in concept) {
      return String(concept.logline);
    }
  }
  return summary.logline || 'Logline not added yet.';
}

function buildProject(summary: ComparisonRunSummary, detail: ComparisonRunDetail): Project {
  const writers = new Map(detail.answers.map((answer) => [answer.answer_id, answer.model_name || answer.agent_name]));
  const playable = detail.artifacts
    .filter((artifact) => isVideo(artifact) && !!artifact.media_url && artifact.status !== 'pending' && artifact.status !== 'failed')
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  const takes = playable.map((artifact, index): Take => {
    const number = artifact.version_number ?? index + 1;
    return {
      id: artifact.artifact_id,
      runId: summary.run_id,
      code: `v${number}`,
      number,
      writer: artifact.source_model_label || (artifact.answer_id ? writers.get(artifact.answer_id) ?? '' : ''),
      model: modelLabel(artifact),
      selected: artifact.status === 'selected',
      isNewest: false,
      createdAt: artifact.created_at,
      artifact,
    };
  });

  return {
    runId: summary.run_id,
    title: showTitle(detail.title || summary.title),
    fullTitle: detail.title || summary.title,
    logline: loglineOf(detail, summary),
    status: statusLabel(detail.status || summary.status),
    created: summary.created,
    summary,
    detail,
    takes,
    shotGrids: detail.artifacts.filter((artifact) => artifact.artifact_type === 'shot_grid' && !!artifact.media_url),
  };
}

const PREFS_KEY = 'directors-cut-screening-prefs';

function readPrefs(): { heroAutoRotate: boolean; playOnHover: boolean } {
  try {
    const stored = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    return { heroAutoRotate: !!stored.heroAutoRotate, playOnHover: !!stored.playOnHover };
  } catch {
    return { heroAutoRotate: false, playOnHover: false };
  }
}

class Studio {
  projects = $state<Project[]>([]);
  loaded = $state(false);
  heroAutoRotate = $state(false);
  playOnHover = $state(false);

  /** Every take in the studio, newest first. */
  takes = $derived(
    this.projects.flatMap((project) => project.takes).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
  newest = $derived(this.takes[0]);

  private signature = '';
  private loading: Promise<void> | null = null;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const prefs = readPrefs();
      this.heroAutoRotate = prefs.heroAutoRotate;
      this.playOnHover = prefs.playOnHover;
    }
  }

  project(runId: string | null | undefined) {
    return this.projects.find((project) => project.runId === runId);
  }

  setPref(key: 'heroAutoRotate' | 'playOnHover', value: boolean) {
    this[key] = value;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ heroAutoRotate: this.heroAutoRotate, playOnHover: this.playOnHover }));
    } catch {
      /* private mode: the toggle still works for this visit */
    }
  }

  /** Load once; later calls share the same request. */
  ensure() {
    this.loading ??= this.refresh(true);
    return this.loading;
  }

  async refresh(force = false) {
    const index = await loadComparisonsIndex();
    const signature = JSON.stringify(index.runs);
    if (!force && signature === this.signature) return;

    const summaries = index.runs
      .filter((run) => run.status !== 'promoted')
      .sort((a, b) => b.created.localeCompare(a.created));
    const details = await Promise.all(
      summaries.map((summary) => loadComparisonRun(summary.run_id).catch(() => null)),
    );
    const projects = summaries.flatMap((summary, i) => (details[i] ? [buildProject(summary, details[i])] : []));

    const newest = projects.flatMap((project) => project.takes).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (newest) newest.isNewest = true;

    this.projects = projects;
    this.signature = signature;
    this.loaded = true;
  }

  /** Re-read one project after it changed (rename, upload, new take). */
  async reload(runId: string) {
    const summary = this.project(runId)?.summary;
    if (!summary) return this.refresh(true);
    const detail = await loadComparisonRun(runId);
    const fresh = buildProject({ ...summary, title: detail.title, logline: detail.logline }, detail);
    this.projects = this.projects.map((project) => (project.runId === runId ? fresh : project));
    const newestId = this.takes[0]?.id;
    for (const project of this.projects) for (const take of project.takes) take.isNewest = take.id === newestId;
  }
}

export const studio = new Studio();
