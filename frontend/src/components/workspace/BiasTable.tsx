// frontend/src/components/workspace/BiasTable.tsx
// Per-symbol signal table: signal_health + scalping/swing alignment,
// color coded (bullish green, bearish red, neutral grey).
// Clicking a row selects the symbol shown in the chart.

import { directionClass, type SlimResponse } from '@services/engineService'

interface BiasTableProps {
  data: SlimResponse | null
  selected: string[]
  activeSymbol: string | null
  onSelectSymbol: (symbol: string) => void
}

export function BiasTable({ data, selected, activeSymbol, onSelectSymbol }: BiasTableProps): JSX.Element {
  return (
    <table className="bias-table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Health</th>
          <th>Scalping</th>
          <th>Swing</th>
        </tr>
      </thead>
      <tbody>
        {selected.map((symbol) => {
          const block = data?.[symbol]
          if (!block) {
            return (
              <tr key={symbol} className={symbol === activeSymbol ? 'active' : ''} onClick={() => onSelectSymbol(symbol)}>
                <td className="sym-cell">{symbol}</td>
                <td colSpan={3} className="muted-cell">
                  loading…
                </td>
              </tr>
            )
          }
          if (block.error) {
            return (
              <tr key={symbol} className={symbol === activeSymbol ? 'active' : ''} onClick={() => onSelectSymbol(symbol)}>
                <td className="sym-cell">{symbol}</td>
                <td colSpan={3} className="error-cell" title={block.error}>
                  engine error
                </td>
              </tr>
            )
          }

          const health = block.signal_health
          const scalp = block.scalping?.alignment_signal
          const swing = block.swing?.alignment_signal
          return (
            <tr key={symbol} className={symbol === activeSymbol ? 'active' : ''} onClick={() => onSelectSymbol(symbol)}>
              <td className="sym-cell">{symbol}</td>
              <td>
                {health ? (
                  <span className="health-badge" style={{ color: health.color }} title={`${health.score_pct}%`}>
                    ● {health.label}
                  </span>
                ) : (
                  '—'
                )}
              </td>
              <td>
                <DecisionBadge decision={scalp?.decision} confidence={scalp?.confidence_pct} />
              </td>
              <td>
                <DecisionBadge decision={swing?.decision} confidence={swing?.confidence_pct} />
              </td>
            </tr>
          )
        })}
        {!selected.length && (
          <tr>
            <td colSpan={4} className="muted-cell">
              Select up to 5 symbols above.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

function DecisionBadge({ decision, confidence }: { decision?: string; confidence?: number }): JSX.Element {
  if (!decision) return <span>—</span>
  const cls = directionClass(decision)
  return (
    <span className={`decision-badge ${cls}`} title={confidence !== undefined ? `confidence ${confidence}%` : undefined}>
      {decision}
      {confidence !== undefined && <small> {Math.round(confidence)}%</small>}
    </span>
  )
}
