// frontend/src/components/workspace/TradingWorkspace.tsx
// Left-panel trading workspace: symbol selector → bias table → candlestick
// chart with SMC overlays. Polls the strategy engine every 30s and pushes
// signal changes to the chat panel via onSignal.

import { useCallback, useEffect, useRef, useState } from 'react'
import { SymbolSelector } from './SymbolSelector'
import { BiasTable } from './BiasTable'
import { PriceChart } from './PriceChart'
import {
  fetchHistory,
  fetchSlim,
  fetchSymbols,
  type EngineCandle,
  type SlimResponse,
} from '@services/engineService'
import './workspace.css'

const TIMEFRAMES = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'] as const
const REFRESH_MS = 30_000
const DEFAULT_SYMBOLS = ['XAUUSD_i']

interface TradingWorkspaceProps {
  onSignal: (text: string) => void
}

interface SignalSnapshot {
  health?: string
  scalping?: string
  swing?: string
}

export function TradingWorkspace({ onSignal }: TradingWorkspaceProps): JSX.Element {
  const [allSymbols, setAllSymbols] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>(DEFAULT_SYMBOLS)
  const [activeSymbol, setActiveSymbol] = useState<string | null>(DEFAULT_SYMBOLS[0] ?? null)
  const [timeframe, setTimeframe] = useState<(typeof TIMEFRAMES)[number]>('M15')
  const [slim, setSlim] = useState<SlimResponse | null>(null)
  const [candles, setCandles] = useState<EngineCandle[]>([])
  const [engineError, setEngineError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  const prevSignalsRef = useRef<Record<string, SignalSnapshot>>({})

  // Symbol universe (once)
  useEffect(() => {
    let cancelled = false
    fetchSymbols()
      .then((r) => {
        if (!cancelled) setAllSymbols(r.symbols)
      })
      .catch(() => {
        /* engine offline — error surfaces via the slim fetch below */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // 30s auto-refresh heartbeat
  useEffect(() => {
    const id = window.setInterval(() => setRefreshTick((t) => t + 1), REFRESH_MS)
    return () => window.clearInterval(id)
  }, [])

  // Detect alignment/health changes between refreshes → notify chat
  const emitSignalChanges = useCallback(
    (data: SlimResponse) => {
      const prev = prevSignalsRef.current
      const next: Record<string, SignalSnapshot> = {}

      for (const [symbol, block] of Object.entries(data)) {
        if (block.error) continue
        const snap: SignalSnapshot = {
          health: block.signal_health?.label,
          scalping: block.scalping?.alignment_signal?.decision,
          swing: block.swing?.alignment_signal?.decision,
        }
        next[symbol] = snap

        const old = prev[symbol]
        if (!old) continue // first sighting — nothing to compare against

        if (old.scalping !== snap.scalping && snap.scalping) {
          const conf = block.scalping?.alignment_signal?.confidence_pct
          onSignal(
            `⚡ ${symbol} scalping signal: ${old.scalping ?? '—'} → ${snap.scalping}` +
              (conf !== undefined ? ` (confidence ${Math.round(conf)}%)` : ''),
          )
        }
        if (old.swing !== snap.swing && snap.swing) {
          const conf = block.swing?.alignment_signal?.confidence_pct
          onSignal(
            `⚡ ${symbol} swing signal: ${old.swing ?? '—'} → ${snap.swing}` +
              (conf !== undefined ? ` (confidence ${Math.round(conf)}%)` : ''),
          )
        }
        if (old.health !== snap.health && snap.health) {
          onSignal(`⚡ ${symbol} signal health: ${old.health ?? '—'} → ${snap.health}`)
        }
      }

      // Keep history for symbols that are merely deselected right now
      prevSignalsRef.current = { ...prev, ...next }
    },
    [onSignal],
  )

  // Slim data (bias table + chart overlays) — on selection change and every tick
  useEffect(() => {
    if (!selected.length) {
      setSlim(null)
      return
    }
    let cancelled = false
    fetchSlim(selected)
      .then((data) => {
        if (cancelled) return
        setSlim(data)
        setEngineError(null)
        emitSignalChanges(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setEngineError(`Engine unreachable: ${err.message}`)
      })
    return () => {
      cancelled = true
    }
  }, [selected, refreshTick, emitSignalChanges])

  // Chart candles — on active symbol / timeframe change and every tick
  useEffect(() => {
    if (!activeSymbol) {
      setCandles([])
      return
    }
    let cancelled = false
    fetchHistory(activeSymbol, timeframe)
      .then((r) => {
        if (!cancelled) setCandles(r.candles)
      })
      .catch((err: Error) => {
        if (!cancelled) setEngineError(`Engine unreachable: ${err.message}`)
      })
    return () => {
      cancelled = true
    }
  }, [activeSymbol, timeframe, refreshTick])

  const handleSelectionChange = (symbols: string[]) => {
    setSelected(symbols)
    if (!symbols.length) {
      setActiveSymbol(null)
    } else if (!activeSymbol || !symbols.includes(activeSymbol)) {
      setActiveSymbol(symbols[0] ?? null)
    }
  }

  const activeBlock = activeSymbol ? slim?.[activeSymbol] : undefined
  const snrLevels = activeBlock?.snr_levels?.[timeframe] ?? []
  const orderBlocks = activeBlock?.order_blocks?.[timeframe] ?? []
  const fvgs = activeBlock?.fvg?.[timeframe] ?? []

  return (
    <div className="trading-workspace">
      <div className="ws-toolbar">
        <SymbolSelector allSymbols={allSymbols} selected={selected} onChange={handleSelectionChange} />
      </div>

      {engineError && <div className="ws-error">{engineError}</div>}

      <BiasTable data={slim} selected={selected} activeSymbol={activeSymbol} onSelectSymbol={setActiveSymbol} />

      <div className="ws-chart-header">
        <span className="ws-chart-title">{activeSymbol ?? 'No symbol'}</span>
        <div className="tf-selector">
          {TIMEFRAMES.map((tf) => (
            <button
              type="button"
              key={tf}
              className={`tf-btn${tf === timeframe ? ' active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="ws-chart-wrap">
        <PriceChart candles={candles} snrLevels={snrLevels} orderBlocks={orderBlocks} fvgs={fvgs} />
        <div className="ws-chart-legend">
          <span className="legend-item snr">— SNR</span>
          <span className="legend-item ob">▮ Order Block</span>
          <span className="legend-item fvg">▮ FVG</span>
        </div>
      </div>
    </div>
  )
}
