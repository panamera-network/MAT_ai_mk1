// frontend/src/components/workspace/CreatorWorkspace.tsx
// Left-panel Creator workspace: projects sidebar -> goal/output controls ->
// output canvas. Same slot TradingWorkspace occupies, same polling cadence
// (30s) and onSignal-into-chat pattern — talks to MAT-AI-OS's
// /creator/projects endpoints, which themselves just call the existing
// Capability Registry (generate_script/voice/image/video/music).

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  capabilityOutputUrl,
  createCreatorProject,
  fetchCreatorProject,
  fetchCreatorProjects,
  runCreatorProject,
  type CreatorOutput,
  type CreatorPendingJob,
  type CreatorProject,
  type OutputKind,
  type ProjectType,
} from '@services/creatorService'
import './workspace.css'

const REFRESH_MS = 30_000

const PROJECT_TYPES: { id: ProjectType; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'shorts', label: 'Shorts' },
]

const OUTPUT_CARDS: { kind: OutputKind; label: string; icon: string }[] = [
  { kind: 'script', label: 'Script', icon: '📝' },
  { kind: 'image', label: 'Thumbnail / Image', icon: '🖼️' },
  { kind: 'voice', label: 'Voice', icon: '🎙️' },
  { kind: 'video', label: 'Video', icon: '🎬' },
  { kind: 'music', label: 'Music', icon: '🎵' },
]

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  in_progress: 'Running',
  ready: 'Ready',
  published: 'Published',
}

interface CreatorWorkspaceProps {
  onSignal: (text: string) => void
}

export function CreatorWorkspace({ onSignal }: CreatorWorkspaceProps): JSX.Element {
  const [projects, setProjects] = useState<CreatorProject[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selected, setSelected] = useState<CreatorProject | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ProjectType>('general')
  const [creating, setCreating] = useState(false)

  const [goal, setGoal] = useState('')
  const [checked, setChecked] = useState<Set<OutputKind>>(new Set(['script']))
  const [running, setRunning] = useState(false)

  // Dedupe output notifications across polls/direct-run responses — a
  // completed/failed output shouldn't post to chat more than once.
  const notifiedKeysRef = useRef<Set<string>>(new Set())

  // 30s heartbeat — same cadence as TradingWorkspace
  useEffect(() => {
    const id = window.setInterval(() => setRefreshTick((t) => t + 1), REFRESH_MS)
    return () => window.clearInterval(id)
  }, [])

  // Project list
  useEffect(() => {
    let cancelled = false
    fetchCreatorProjects()
      .then((r) => {
        if (cancelled) return
        setProjects(r.projects)
        setError(null)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(`MAT-AI-OS unreachable: ${err.message}`)
      })
    return () => {
      cancelled = true
    }
  }, [refreshTick])

  const emitOutputChanges = useCallback(
    (project: CreatorProject) => {
      for (const o of project.outputs) {
        const key = `${o.job_id}-${o.status}`
        if (notifiedKeysRef.current.has(key)) continue
        notifiedKeysRef.current.add(key)
        if (o.status === 'completed') onSignal(`🎬 ${project.title}: ${o.output} ready`)
        else if (o.status === 'failed') onSignal(`🎬 ${project.title}: ${o.output} failed — ${o.error ?? 'unknown error'}`)
      }
    },
    [onSignal],
  )

  // Selected project detail — on selection change and every tick
  useEffect(() => {
    if (!selectedId) {
      setSelected(null)
      return
    }
    let cancelled = false
    fetchCreatorProject(selectedId)
      .then((project) => {
        if (cancelled) return
        setSelected(project)
        emitOutputChanges(project)
        setError(null)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(`MAT-AI-OS unreachable: ${err.message}`)
      })
    return () => {
      cancelled = true
    }
  }, [selectedId, refreshTick, emitOutputChanges])

  // Seed the run form + notification dedupe whenever the selected project changes
  useEffect(() => {
    setGoal(selected?.goal ?? '')
    setChecked(
      selected && selected.requested_outputs.length > 0 ? new Set(selected.requested_outputs) : new Set(['script']),
    )
    notifiedKeysRef.current = new Set((selected?.outputs ?? []).map((o) => `${o.job_id}-${o.status}`))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.project_id])

  const handleCreate = async () => {
    if (!title.trim() || creating) return
    setCreating(true)
    try {
      const project = await createCreatorProject(title.trim(), type, '')
      setProjects((prev) => [project, ...prev])
      setSelectedId(project.project_id)
      setTitle('')
      setType('general')
      setFormOpen(false)
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setCreating(false)
    }
  }

  const toggleOutput = (kind: OutputKind) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(kind)) next.delete(kind)
      else next.add(kind)
      return next
    })
  }

  const handleRun = async () => {
    if (!selectedId || running || checked.size === 0 || !goal.trim()) return
    setRunning(true)
    try {
      const project = await runCreatorProject(selectedId, goal.trim(), Array.from(checked))
      setSelected(project)
      setProjects((prev) => prev.map((p) => (p.project_id === project.project_id ? project : p)))
      emitOutputChanges(project)
    } catch (err) {
      onSignal(`🎬 Run failed: ${(err as Error).message}`)
    } finally {
      setRunning(false)
    }
  }

  const outputByKind = new Map<OutputKind, CreatorOutput>()
  for (const o of selected?.outputs ?? []) outputByKind.set(o.output, o)
  const pendingByKind = new Map<OutputKind, CreatorPendingJob>()
  for (const j of selected?.jobs ?? []) pendingByKind.set(j.output, j)

  return (
    <div className="creator-workspace">
      <aside className="creator-sidebar">
        <div className="cw-sidebar-head">Creator Projects</div>

        <div className="creator-project-list">
          {projects.map((p) => (
            <button
              key={p.project_id}
              type="button"
              className={`creator-project-row${p.project_id === selectedId ? ' active' : ''}`}
              onClick={() => setSelectedId(p.project_id)}
            >
              <span className="creator-project-title">{p.title}</span>
              <div className="creator-project-meta">
                <span className={`creator-status-badge status-${p.status}`}>{STATUS_LABEL[p.status] ?? p.status}</span>
                <span className="creator-project-type">{p.type}</span>
              </div>
            </button>
          ))}
          {!projects.length && !error && <div className="creator-empty">No projects yet</div>}
        </div>

        {!formOpen && (
          <button type="button" className="creator-new-btn" onClick={() => setFormOpen(true)}>
            + New Project
          </button>
        )}
        {formOpen && (
          <div className="creator-new-form">
            <input placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            <select value={type} onChange={(e) => setType(e.target.value as ProjectType)}>
              {PROJECT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="creator-new-actions">
              <button type="button" onClick={() => void handleCreate()} disabled={creating || !title.trim()}>
                {creating ? 'Creating…' : 'Create'}
              </button>
              <button type="button" className="ghost" onClick={() => setFormOpen(false)} disabled={creating}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </aside>

      <div className="cw-main">
        {error && <div className="ws-error">{error}</div>}

        {!selected ? (
          <div className="cw-empty">Select or create a project to get started.</div>
        ) : (
          <>
            <div className="cw-header">
              <span className="ws-chart-title">{selected.title}</span>
              <span className={`creator-status-badge status-${selected.status}`}>
                {STATUS_LABEL[selected.status] ?? selected.status}
              </span>
            </div>

            <div className="cw-run-panel">
              <textarea
                className="creator-goal-input"
                placeholder="What do you want MAT to create? e.g. 5-minute intro video about MAT.ai"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={running}
              />
              <div className="creator-output-checkboxes">
                {OUTPUT_CARDS.map(({ kind, label }) => (
                  <label key={kind} className="creator-checkbox">
                    <input
                      type="checkbox"
                      checked={checked.has(kind)}
                      onChange={() => toggleOutput(kind)}
                      disabled={running}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="suggest-btn"
                onClick={() => void handleRun()}
                disabled={running || checked.size === 0 || !goal.trim()}
              >
                {running ? '🧠 Running…' : '▶ Run Project'}
              </button>
            </div>

            <div className="creator-card-grid">
              {OUTPUT_CARDS.map(({ kind, label, icon }) => (
                <CreatorOutputCard
                  key={kind}
                  kind={kind}
                  label={label}
                  icon={icon}
                  output={outputByKind.get(kind)}
                  pendingJob={pendingByKind.get(kind)}
                  requested={selected.requested_outputs.includes(kind)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface CreatorCardProps {
  kind: OutputKind
  label: string
  icon: string
  output?: CreatorOutput
  pendingJob?: CreatorPendingJob
  requested: boolean
}

function CreatorOutputCard({ kind, label, icon, output, pendingJob, requested }: CreatorCardProps): JSX.Element {
  const stateClass = output ? `state-${output.status}` : pendingJob ? 'state-pending' : 'state-empty'

  return (
    <div className={`creator-output-card ${stateClass}`}>
      <div className="creator-card-head">
        <span className="creator-card-icon">{icon}</span>
        <span className="creator-card-label">{label}</span>
        {output && <span className={`creator-card-status status-${output.status}`}>{output.status}</span>}
        {!output && pendingJob && <span className="creator-card-status status-pending">pending</span>}
      </div>

      {output?.status === 'failed' && <div className="creator-card-error">{output.error ?? 'Generation failed.'}</div>}

      {output && output.status !== 'failed' && kind === 'script' && (
        <div className="creator-card-script">{output.result_text || '(empty script)'}</div>
      )}

      {output && output.status !== 'failed' && kind !== 'script' && output.output_path && (
        <>
          {kind === 'image' && <img className="creator-card-media" src={capabilityOutputUrl(output.job_id)} alt={kind} />}
          {kind === 'video' && <video className="creator-card-media" src={capabilityOutputUrl(output.job_id)} controls />}
          {(kind === 'voice' || kind === 'music') && (
            <audio className="creator-card-audio" src={capabilityOutputUrl(output.job_id)} controls />
          )}
        </>
      )}

      {output && output.status !== 'failed' && kind !== 'script' && !output.output_path && (
        <div className="creator-card-note">
          {output.output_url ? 'Saved to an external URL (local download failed).' : 'Completed, but no output file was recorded.'}
        </div>
      )}

      {!output && pendingJob && (
        <div className="creator-card-note">⏳ Generating — video/music can take a few minutes.</div>
      )}

      {!output && !pendingJob && <div className="creator-card-empty">{requested ? 'Queued…' : 'Not requested for this run.'}</div>}
    </div>
  )
}
