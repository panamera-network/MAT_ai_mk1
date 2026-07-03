// frontend/src/components/workspace/WorkspaceSidebar.tsx
// Left sidebar of the trading workspace. Collapsible to an icon-only
// strip. Expanded: account summary pinned on top (always visible),
// Strategies and Active Trades as expandable drawers below.
// Account/positions data comes from MAT-AI-OS's /trading API and
// refreshes every 30s, independent of the engine polling.

import { useEffect, useState, type ReactNode } from 'react'
import { StrategyPanel } from './StrategyPanel'
import { TradesPanel } from './TradesPanel'
import { HistoryPanel } from './HistoryPanel'
import type { StrategyInfo } from '@services/engineService'
import {
  fetchPositions,
  fetchTradeHistory,
  fetchTradeStats,
  fetchTradingContext,
  type TradeRecord,
  type TradeStats,
  type TradingAccount,
  type TradingPosition,
} from '@services/tradingService'

const REFRESH_MS = 30_000
const COLLAPSE_KEY = 'ws-sidebar-collapsed'

interface WorkspaceSidebarProps {
  strategies: StrategyInfo[]
  onStrategiesChange: (strategies: StrategyInfo[]) => void
  onError: (message: string) => void
}

type DrawerId = 'strategies' | 'trades' | 'history'

function fmt(n: number | undefined): string {
  if (n === undefined) return '—'
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function WorkspaceSidebar({ strategies, onStrategiesChange, onError }: WorkspaceSidebarProps): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem(COLLAPSE_KEY) === '1')
  const [openDrawers, setOpenDrawers] = useState<Set<DrawerId>>(new Set(['strategies']))
  const [account, setAccount] = useState<TradingAccount | null>(null)
  const [stale, setStale] = useState(false)
  const [positions, setPositions] = useState<TradingPosition[]>([])
  const [tradingOffline, setTradingOffline] = useState(false)
  const [history, setHistory] = useState<TradeRecord[]>([])
  const [stats, setStats] = useState<TradeStats | null>(null)

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  // Poll account + positions
  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetchTradingContext()
        .then((ctx) => {
          if (cancelled) return
          setAccount(ctx.account ?? null)
          setStale(Boolean(ctx.stale))
          setTradingOffline(false)
        })
        .catch(() => {
          if (!cancelled) setTradingOffline(true)
        })
      fetchPositions()
        .then((r) => {
          if (!cancelled) setPositions(r.positions)
        })
        .catch(() => {
          /* offline state already flagged by the context fetch */
        })
      fetchTradeHistory()
        .then((r) => {
          if (!cancelled) setHistory(r.trades)
        })
        .catch(() => {
          /* same */
        })
      fetchTradeStats()
        .then((s) => {
          if (!cancelled) setStats(s)
        })
        .catch(() => {
          /* same */
        })
    }
    load()
    const id = window.setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  const toggleDrawer = (id: DrawerId) => {
    setOpenDrawers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Collapsed icon strip: clicking a section icon expands the sidebar
  // and makes sure that section is open.
  const expandTo = (id?: DrawerId) => {
    setCollapsed(false)
    if (id) setOpenDrawers((prev) => new Set(prev).add(id))
  }

  const accountTitle = account
    ? `Balance ${fmt(account.balance)} · Equity ${fmt(account.equity)} ${account.currency}`
    : 'Account'

  if (collapsed) {
    return (
      <aside className="ws-sidebar collapsed">
        <button type="button" className="sb-icon-btn" title="Expand sidebar" onClick={() => expandTo()}>
          »
        </button>
        <button type="button" className="sb-icon-btn" title={accountTitle} onClick={() => expandTo()}>
          💰
        </button>
        <button
          type="button"
          className="sb-icon-btn"
          title={`Strategies (${strategies.filter((s) => s.enabled).length} active)`}
          onClick={() => expandTo('strategies')}
        >
          🧠
        </button>
        {positions.length > 0 && (
          <button
            type="button"
            className="sb-icon-btn"
            title={`Active trades (${positions.length})`}
            onClick={() => expandTo('trades')}
          >
            📊
            <span className="sb-badge">{positions.length}</span>
          </button>
        )}
        <button
          type="button"
          className="sb-icon-btn"
          title={`Trade history (${history.length})`}
          onClick={() => expandTo('history')}
        >
          📜
        </button>
      </aside>
    )
  }

  return (
    <aside className="ws-sidebar">
      <div className="sb-header">
        <span className="sb-title">Trading</span>
        <button type="button" className="sb-icon-btn" title="Collapse sidebar" onClick={() => setCollapsed(true)}>
          «
        </button>
      </div>

      {/* Account summary — pinned, always visible while expanded */}
      <div className="sb-account">
        <div className="sb-section-label">
          Account
          {stale && <span className="sb-stale" title="MT5 unreachable — showing last cached snapshot">stale</span>}
        </div>
        {tradingOffline ? (
          <div className="sb-offline">Trading API offline (port 8000)</div>
        ) : (
          <div className="sb-account-grid">
            <AccountStat label="Balance" value={fmt(account?.balance)} />
            <AccountStat label="Equity" value={fmt(account?.equity)} />
            <AccountStat label="Margin" value={fmt(account?.margin)} />
            <AccountStat label="Free" value={fmt(account?.free_margin)} />
          </div>
        )}
        {account && !tradingOffline && <div className="sb-currency">{account.currency}</div>}
      </div>

      <Drawer
        title="Strategies"
        badge={`${strategies.filter((s) => s.enabled).length}/${strategies.length}`}
        open={openDrawers.has('strategies')}
        onToggle={() => toggleDrawer('strategies')}
      >
        <StrategyPanel strategies={strategies} onChange={onStrategiesChange} onError={onError} />
      </Drawer>

      {/* Takda open trade → skip seksyen ni terus (muncul balik bila ada posisi) */}
      {positions.length > 0 && (
        <Drawer
          title="Active Trades"
          badge={String(positions.length)}
          open={openDrawers.has('trades')}
          onToggle={() => toggleDrawer('trades')}
        >
          <TradesPanel positions={positions} currency={account?.currency ?? ''} />
        </Drawer>
      )}

      <Drawer
        title="History"
        badge={String(history.length)}
        open={openDrawers.has('history')}
        onToggle={() => toggleDrawer('history')}
      >
        <HistoryPanel trades={history} stats={stats} />
      </Drawer>
    </aside>
  )
}

function AccountStat({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="sb-stat">
      <span className="sb-stat-label">{label}</span>
      <span className="sb-stat-value">{value}</span>
    </div>
  )
}

function Drawer({
  title,
  badge,
  open,
  onToggle,
  children,
}: {
  title: string
  badge?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}): JSX.Element {
  return (
    <div className={`sb-drawer${open ? ' open' : ''}`}>
      <button type="button" className="sb-drawer-header" onClick={onToggle} aria-expanded={open}>
        <span>{title}</span>
        <span className="sb-drawer-meta">
          {badge !== undefined && <span className="sb-drawer-badge">{badge}</span>}
          <span className="sb-chevron">{open ? '▾' : '▸'}</span>
        </span>
      </button>
      {open && <div className="sb-drawer-body">{children}</div>}
    </div>
  )
}
