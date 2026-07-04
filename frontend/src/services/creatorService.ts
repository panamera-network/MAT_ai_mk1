// frontend/src/services/creatorService.ts
// Client for MAT-AI-OS's /creator/projects endpoints (port 8000) — Creator
// Workspace projects, built entirely on the existing Capability Registry.
// Output previews (image/video/audio) reuse the existing
// /capabilities/output/{job_id} route — no new file-serving endpoint.

const OS_BASE = 'http://localhost:8000'
const CREATOR_BASE = `${OS_BASE}/creator`

export type ProjectType = 'youtube' | 'tiktok' | 'shorts' | 'general'
export type ProjectStatus = 'draft' | 'in_progress' | 'ready' | 'published'
export type OutputKind = 'script' | 'voice' | 'image' | 'video' | 'music'

export interface CreatorOutput {
  output: OutputKind
  capability: string
  job_id: string
  status: string // completed | failed | pending | running
  output_path: string | null
  output_url: string | null
  result_text: string | null
  error: string | null
  created_at: string
}

export interface CreatorPendingJob {
  output: OutputKind
  capability: string
  job_id: string
  status: string
}

export interface CreatorProject {
  project_id: string
  user_id: string
  title: string
  type: ProjectType
  status: ProjectStatus
  goal: string
  requested_outputs: OutputKind[]
  scripts: { job_id: string; text: string | null; created_at: string }[]
  assets: { output: OutputKind; job_id: string; path: string | null; url: string | null }[]
  outputs: CreatorOutput[]
  jobs: CreatorPendingJob[]
  created_at: string
  updated_at: string
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${CREATOR_BASE}${path}`)
  if (!res.ok) {
    let detail = `Creator API ${res.status} on ${path}`
    try {
      const payload = await res.json()
      if (payload.detail) detail = String(payload.detail)
    } catch {
      /* keep generic message */
    }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${CREATOR_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let detail = `Creator API ${res.status} on ${path}`
    try {
      const payload = await res.json()
      if (payload.detail) detail = String(payload.detail)
    } catch {
      /* keep generic message */
    }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

export function fetchCreatorProjects(): Promise<{ projects: CreatorProject[] }> {
  return getJson('/projects')
}

export function fetchCreatorProject(id: string): Promise<CreatorProject> {
  return getJson(`/projects/${encodeURIComponent(id)}`)
}

export function createCreatorProject(title: string, type: ProjectType, goal = ''): Promise<CreatorProject> {
  return postJson('/projects', { title, type, goal })
}

export function runCreatorProject(id: string, goal: string, requestedOutputs: OutputKind[]): Promise<CreatorProject> {
  return postJson(`/projects/${encodeURIComponent(id)}/run`, { goal, requested_outputs: requestedOutputs })
}

/** Preview/download URL for a completed capability job (image/video/audio). */
export function capabilityOutputUrl(jobId: string): string {
  return `${OS_BASE}/capabilities/output/${encodeURIComponent(jobId)}`
}
