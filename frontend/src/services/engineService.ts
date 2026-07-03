// frontend/src/services/engineService.ts
// Client for the mat-strategy-engine API (FastAPI, port 8010).

const ENGINE_BASE = 'http://localhost:8010/core'

export interface AlignmentSignal {
  decision: string
  total_score?: number
  confidence_pct?: number
  confidence_color?: string
  summary?: string
  confidence_history?: number[]
}

export interface SignalHealth {
  score_pct: number
  color: string
  label: string
}

export interface BiasTf {
  label?: string
  score?: number
  strength?: number
}

export interface SnrLevel {
  type: string // 'Support' | 'Resistance'
  level: number
  source?: string
  status?: string
  label?: string
  timestamp?: string // epoch seconds as string
}

export interface OrderBlock {
  type: string // 'Bullish' | 'Bearish'
  high: number
  low: number
  mitigated?: boolean
  timestamp: string // epoch seconds as string
}

export interface Fvg {
  type: string // 'Bullish' | 'Bearish'
  top: number
  bottom: number
  mitigated?: boolean
  timestamp: string // epoch seconds as string
}

export interface SupplyDemandZone {
  type: string
  top: number
  bottom: number
  strength?: number
  timestamp: string
}

export interface StrategyInfo {
  name: string
  enabled: boolean
}

export interface StrategySignal {
  strategy: string
  symbol: string
  timeframe: string
  direction: string // 'long' | 'short'
  reason?: string
  confidence?: number
  trigger?: string
  timestamp?: string
  price?: number
}

export interface SlimSymbolBlock {
  error?: string
  bias?: Record<string, BiasTf>
  signal_health?: SignalHealth
  scalping?: { alignment_signal?: AlignmentSignal }
  swing?: { alignment_signal?: AlignmentSignal }
  snr_levels?: Record<string, SnrLevel[]>
  order_blocks?: Record<string, OrderBlock[]>
  fvg?: Record<string, Fvg[]>
  supply_demand_zones?: Record<string, SupplyDemandZone[]>
  strategy_signals?: StrategySignal[]
}

export type SlimResponse = Record<string, SlimSymbolBlock>

export interface EngineCandle {
  time: number // epoch seconds
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface HistoryResponse {
  symbol: string
  timeframe: string
  candles: EngineCandle[]
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${ENGINE_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`Engine ${res.status} on ${path}`)
  }
  return res.json() as Promise<T>
}

export function fetchSymbols(): Promise<{ symbols: string[] }> {
  return getJson('/symbols')
}

export function fetchSlim(symbols: string[]): Promise<SlimResponse> {
  return getJson(`/slim/${encodeURIComponent(symbols.join(','))}`)
}

export function fetchHistory(symbol: string, timeframe: string, count = 200): Promise<HistoryResponse> {
  return getJson(`/history/${encodeURIComponent(symbol)}/${encodeURIComponent(timeframe)}?count=${count}`)
}

export function fetchStrategies(): Promise<{ strategies: StrategyInfo[] }> {
  return getJson('/strategies')
}

/** Toggles strategy evaluation engine-side: disabled strategies emit no signals. */
export async function setStrategyEnabled(name: string, enabled: boolean): Promise<StrategyInfo> {
  const res = await fetch(`${ENGINE_BASE}/strategies/${encodeURIComponent(name)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  })
  if (!res.ok) {
    throw new Error(`Engine ${res.status} toggling ${name}`)
  }
  return res.json() as Promise<StrategyInfo>
}

/** Shared bullish/bearish/neutral color coding for decisions and bias labels. */
export function directionClass(text: string | undefined): 'up' | 'down' | 'flat' {
  const t = (text || '').toLowerCase()
  if (/(long|bull|buy)/.test(t)) return 'up'
  if (/(short|bear|sell)/.test(t)) return 'down'
  return 'flat'
}
