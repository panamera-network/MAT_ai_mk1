// frontend/src/components/workspace/WorkspaceController.tsx
// Picks the left-panel workspace from the user's persona in MAT-AI-OS's
// identity profile (GET /identity on port 8000): trader gets the full trading
// workspace, other personas get their placeholder. Unknown persona, missing
// identity, or an unreachable backend all fall back to trader.

import { useEffect, useState } from 'react'
import { TradingWorkspace } from './TradingWorkspace'
import { CreatorWorkspace, SMEWorkspace, StudentWorkspace } from './PlaceholderWorkspaces'
import { fetchIdentity, resolvePersona, type Persona } from '@services/identityService'
import type { TradeSuggestion } from '@services/tradingService'

interface WorkspaceControllerProps {
  onSignal: (text: string) => void
  onSuggestion: (suggestion: TradeSuggestion) => void
}

export function WorkspaceController({ onSignal, onSuggestion }: WorkspaceControllerProps): JSX.Element {
  const [persona, setPersona] = useState<Persona | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchIdentity()
      .then((identity) => {
        if (!cancelled) setPersona(resolvePersona(identity))
      })
      .catch(() => {
        // Identity API down → default persona rather than an empty panel
        if (!cancelled) setPersona('trader')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (persona === null) {
    return <div className="workspace-loading">Loading workspace…</div>
  }

  switch (persona) {
    case 'creator':
      return <CreatorWorkspace />
    case 'sme':
      return <SMEWorkspace />
    case 'student':
      return <StudentWorkspace />
    case 'trader':
    default:
      return <TradingWorkspace onSignal={onSignal} onSuggestion={onSuggestion} />
  }
}
