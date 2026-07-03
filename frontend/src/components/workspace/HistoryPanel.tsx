// frontend/src/components/workspace/HistoryPanel.tsx
// Trade history for the sidebar drawer: stats summary (win rate, avg RR,
// total PnL, best/worst symbol) + compact trade table.

import type { TradeRecord, TradeStats } from '@services/tradingService'

interface HistoryPanelProps {
  trades: TradeRecord[]
  stats: TradeStats | null
}

function pnlClass(value: number | undefined): string {
  if (value === undefined || value === null) return ''
  return value >= 0 ? 'up' : 'down'
}

export function HistoryPanel({ trades, stats }: HistoryPanelProps): JSX.Element {
  return (
    <div className="history-panel">
      {stats && stats.closed_trades > 0 && (
        <div className="hp-stats">
          <div className="hp-stat">
            <span>Win rate</span>
            <strong>{stats.win_rate_pct}%</strong>
          </div>
          <div className="hp-stat">
            <span>Avg RR</span>
            <strong>{stats.avg_rr ?? '—'}</strong>
          </div>
          <div className="hp-stat">
            <span>Total P&L</span>
            <strong className={pnlClass(stats.total_pnl)}>{stats.total_pnl}</strong>
          </div>
          <div className="hp-stat">
            <span>Best</span>
            <strong className="up">{stats.best_symbol ?? '—'}</strong>
          </div>
          <div className="hp-stat">
            <span>Worst</span>
            <strong className="down">{stats.worst_symbol ?? '—'}</strong>
          </div>
          <div className="hp-stat">
            <span>Trades</span>
            <strong>
              {stats.closed_trades}c / {stats.open_trades}o
            </strong>
          </div>
        </div>
      )}

      {!trades.length && <div className="hp-empty">No trades recorded yet</div>}

      {trades.slice(0, 30).map((t) => (
        <div key={t.id} className="hp-row" title={t.reason || undefined}>
          <div className="hp-row-head">
            <span className={`trade-side ${t.direction === 'buy' ? 'up' : 'down'}`}>{t.direction.toUpperCase()}</span>
            <span className="hp-symbol">{t.symbol}</span>
            <span className={`hp-source ${t.source}`}>{t.source === 'suggestion' ? '💡' : '✋'}</span>
            {t.status === 'closed' && t.profit !== undefined && t.profit !== null ? (
              <span className={`hp-profit ${pnlClass(t.profit)}`}>
                {t.profit >= 0 ? '+' : ''}
                {t.profit}
              </span>
            ) : (
              <span className="hp-open-tag">{t.status}</span>
            )}
          </div>
          <div className="hp-row-detail">
            {t.volume} lot · {t.entry ?? '—'}
            {t.close_price !== undefined && t.close_price !== null ? ` → ${t.close_price}` : ''}
            {t.opened_at ? ` · ${t.opened_at.slice(0, 10)}` : ''}
          </div>
        </div>
      ))}
    </div>
  )
}
