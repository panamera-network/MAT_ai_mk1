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

export interface TradeSuggestion {
  id: string
  status: string // pending | approved | rejected | failed
  symbol: string
  direction: string // 'long' | 'short'
  entry: number
  sl: number
  tp: number
  volume: number
  reason: string
  confidence?: number
  created_at?: string
  execution_error?: string
}

export interface NoSetupResponse {
  status: 'no_setup'
  symbol: string
  reason: string
}

export interface TradeRecord {
  id: string
  ticket?: number
  symbol: string
  direction: string // 'buy' | 'sell'
  volume: number
  entry?: number
  sl?: number
  tp?: number
  opened_at?: string
  closed_at?: string
  close_price?: number
  profit?: number
  status: string // 'open' | 'closed'
  source: string // 'suggestion' | 'manual'
  reason?: string
}

export interface TradeStats {
  total_trades: number
  open_trades: number
  closed_trades: number
  wins: number
  losses: number
  win_rate_pct: number
  avg_rr: number | null
  total_pnl: number
  pnl_by_symbol: Record<string, number>
  best_symbol: string | null
  worst_symbol: string | null
}

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${TRADING_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    let detail = `Trading API ${res.status} on ${path}`
    try {
      const payload = await res.json()
      if (payload.detail) detail = String(payload.detail)
    } catch {
      /* keep generic message */
    }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

export function fetchTradingContext(): Promise<TradingContext> {
  return getJson('/context')
}

export function fetchPositions(): Promise<{ positions: TradingPosition[] }> {
  return getJson('/positions')
}

/** Ask the OS's trading analyst for a trade plan. Can take ~10-30s (LLM call). */
export function suggestTrade(symbol: string): Promise<TradeSuggestion | NoSetupResponse> {
  return postJson('/suggest', { symbol })
}

export function approveSuggestion(id: string): Promise<{
  suggestion: TradeSuggestion
  execution: { ok: boolean; ticket?: number; executed_price?: number; error?: string }
}> {
  return postJson(`/approve/${encodeURIComponent(id)}`)
}

export function rejectSuggestion(id: string, reason = ''): Promise<TradeSuggestion> {
  return postJson(`/reject/${encodeURIComponent(id)}`, { reason })
}

export function fetchTradeHistory(): Promise<{ trades: TradeRecord[] }> {
  return getJson('/history')
}

export function fetchTradeStats(): Promise<TradeStats> {
  return getJson('/history/stats')
}
