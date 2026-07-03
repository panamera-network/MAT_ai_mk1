// frontend/src/components/workspace/StrategyPanel.tsx
// Sidebar toggle list for engine strategy plugins. Toggling PATCHes the
// engine (disabled strategies emit no signals at all); the active set
// also filters which strategy signals become chat notifications.

import { setStrategyEnabled, type StrategyInfo } from '@services/engineService'

interface StrategyPanelProps {
  strategies: StrategyInfo[]
  onChange: (strategies: StrategyInfo[]) => void
  onError: (message: string) => void
}

/** "BiasContinuationScalpingStrategy" → "Bias Continuation Scalping" */
export function strategyDisplayName(name: string): string {
  return name.replace(/Strategy$/, '').replace(/([a-z])([A-Z])/g, '$1 $2')
}

export function StrategyPanel({ strategies, onChange, onError }: StrategyPanelProps): JSX.Element {
  const toggle = async (target: StrategyInfo) => {
    const next = !target.enabled
    // Optimistic flip; revert if the PATCH fails
    onChange(strategies.map((s) => (s.name === target.name ? { ...s, enabled: next } : s)))
    try {
      await setStrategyEnabled(target.name, next)
    } catch (err) {
      onChange(strategies.map((s) => (s.name === target.name ? { ...s, enabled: target.enabled } : s)))
      onError(`Failed to toggle ${strategyDisplayName(target.name)}: ${(err as Error).message}`)
    }
  }

  return (
    <div className="strategy-panel">
      <div className="strategy-panel-title">Strategies</div>
      {!strategies.length && <div className="strategy-empty">No strategies loaded</div>}
      {strategies.map((s) => (
        <label key={s.name} className="strategy-row" title={s.name}>
          <span className={`strategy-name${s.enabled ? ' on' : ''}`}>{strategyDisplayName(s.name)}</span>
          <button
            type="button"
            role="switch"
            aria-checked={s.enabled}
            className={`strategy-switch${s.enabled ? ' on' : ''}`}
            onClick={() => void toggle(s)}
          >
            <span className="strategy-knob" />
          </button>
        </label>
      ))}
      <div className="strategy-hint">Active strategies emit ⚡ signals to chat</div>
    </div>
  )
}
