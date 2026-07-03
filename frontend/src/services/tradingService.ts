// frontend/src/services/tradingService.ts
// Client for MAT-AI-OS's /trading endpoints (port 8000) — live MT5
// account/position data. Distinct from engineService (port 8010), which
// serves analysis; this one talks to the orchestrator app.

const TRADING_BASE = 'http://localhost:8000/trading'

export interface TradingAccount {
  balance: number
  equity: number
  margin: number
  free_margin: number
  currency: string
  leverage?: number
}

export interface TradingPosition {
  symbol: string
  type: string // 'buy' | 'sell'
  volume: number
  open_price: number
  current_price: number
  profit: number
  sl: number
  tp: number
}

export interface TradingContext {
  account?: TradingAccount
  open_positions?: TradingPosition[]
  daily_pnl?: { realized: number; unrealized: number; total: number }
  stale?: boolean
  fetched_at?: string
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${TRADING_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`Trading API ${res.status} on ${path}`)
  }
  return res.json() as Promise<T>
}

export function fetchTradingContext(): Promise<TradingContext> {
  return getJson('/context')
}

export function fetchPositions(): Promise<{ positions: TradingPosition[] }> {
  return getJson('/positions')
}
