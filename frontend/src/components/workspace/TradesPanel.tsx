// frontend/src/components/workspace/TradesPanel.tsx
// Open MT5 positions list for the sidebar's Active Trades drawer.

import type { TradingPosition } from '@services/tradingService'

interface TradesPanelProps {
  positions: TradingPosition[]
  currency: string
}

export function TradesPanel({ positions, currency }: TradesPanelProps): JSX.Element {
  if (!positions.length) {
    return <div className="trades-empty">No open positions</div>
  }

  return (
    <div className="trades-list">
      {positions.map((p, i) => (
        <div key={`${p.symbol}-${i}`} className="trade-row">
          <div className="trade-head">
            <span className={`trade-side ${p.type === 'buy' ? 'up' : 'down'}`}>{p.type.toUpperCase()}</span>
            <span className="trade-symbol">{p.symbol}</span>
            <span className="trade-volume">{p.volume} lot</span>
          </div>
          <div className="trade-prices">
            {p.open_price} → {p.current_price}
          </div>
          <div className="trade-foot">
            <span className={`trade-profit ${p.profit >= 0 ? 'up' : 'down'}`}>
              {p.profit >= 0 ? '+' : ''}
              {p.profit.toFixed(2)} {currency}
            </span>
            <span className="trade-sltp">
              SL {p.sl || '—'} · TP {p.tp || '—'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
