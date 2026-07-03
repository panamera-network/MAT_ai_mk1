// frontend/src/components/chat/TradeSuggestionCard.tsx
// Trade suggestion card rendered inside the chat stream. Self-contained:
// Approve/Reject call the OS trading API directly and the card tracks its
// own outcome state, so ChatPanel stays dumb.

import { useState } from 'react'
import { approveSuggestion, rejectSuggestion, type TradeSuggestion } from '@services/tradingService'

interface TradeSuggestionCardProps {
  suggestion: TradeSuggestion
}

export function TradeSuggestionCard({ suggestion }: TradeSuggestionCardProps): JSX.Element {
  const [status, setStatus] = useState(suggestion.status)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const isLong = suggestion.direction === 'long'

  const approve = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const result = await approveSuggestion(suggestion.id)
      if (result.execution.ok) {
        setStatus('approved')
        setMessage(`Executed — ticket ${result.execution.ticket} @ ${result.execution.executed_price}`)
      } else {
        setStatus('failed')
        setMessage(`Broker rejected: ${result.execution.error}`)
      }
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const reject = async () => {
    setBusy(true)
    setMessage(null)
    try {
      await rejectSuggestion(suggestion.id, 'Rejected from chat card')
      setStatus('rejected')
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="trade-suggestion-card">
      <div className="tsc-head">
        <span className={`tsc-direction ${isLong ? 'up' : 'down'}`}>{isLong ? '▲ LONG' : '▼ SHORT'}</span>
        <span className="tsc-symbol">{suggestion.symbol}</span>
        {suggestion.confidence !== undefined && <span className="tsc-confidence">{suggestion.confidence}%</span>}
      </div>

      <div className="tsc-levels">
        <div className="tsc-level">
          <span>Entry</span>
          <strong>{suggestion.entry}</strong>
        </div>
        <div className="tsc-level">
          <span>SL</span>
          <strong className="down">{suggestion.sl}</strong>
        </div>
        <div className="tsc-level">
          <span>TP</span>
          <strong className="up">{suggestion.tp}</strong>
        </div>
        <div className="tsc-level">
          <span>Vol</span>
          <strong>{suggestion.volume}</strong>
        </div>
      </div>

      {suggestion.reason && <div className="tsc-reason">{suggestion.reason}</div>}

      {status === 'pending' ? (
        <div className="tsc-actions">
          <button type="button" className="tsc-btn approve" disabled={busy} onClick={() => void approve()}>
            {busy ? '…' : '✓ Approve'}
          </button>
          <button type="button" className="tsc-btn reject" disabled={busy} onClick={() => void reject()}>
            ✕ Reject
          </button>
        </div>
      ) : (
        <div className={`tsc-status ${status}`}>
          {status === 'approved' && '✅ Approved & executed'}
          {status === 'rejected' && '🚫 Rejected'}
          {status === 'failed' && '⚠️ Execution failed'}
        </div>
      )}

      {message && <div className="tsc-message">{message}</div>}
    </div>
  )
}
