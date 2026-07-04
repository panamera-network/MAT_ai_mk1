# MAT_ai_mk1

Desktop trading workstation for **MAT.ai** — Electron + Vite + React + TypeScript. A
resizable split view: chat with MAT.ai on the right, a persona-driven workspace on the
left. Companion apps: [mat-ai-mk1-mobile](https://github.com/panamera-network/mat-ai-mk1-mobile)
(mobile) and [MAT-AI-OS](https://github.com/panamera-network/mat-ai-os) (the backend brain).

## Layout

```
┌─────────────────────────────┬───────────────────┐
│  Workspace (persona-driven)  │   Chat + Voice     │
│  default 60%, drag to resize │   default 40%      │
└─────────────────────────────┴───────────────────┘
```

- **Right — Chat.** Text + voice (mic → Whisper/Web Speech), image/file attachments,
  model selector (`FAST_LOCAL` / `FAST_CLOUD` / `BRAIN`), all against MAT-AI-OS's
  `POST /task` with session continuation. Trade suggestion cards (see below) render
  inline in the same message stream.
- **Left — Workspace.** `WorkspaceController` reads `identity.persona` from MAT-AI-OS
  (`GET /identity`) and picks which workspace to show — see below.

## Persona-driven workspace

| Persona | Workspace |
|---|---|
| `trader` *(default)* | Full Trading Workspace (see below) |
| `creator` | Placeholder — planned: content calendar, asset library, publishing queue, engagement analytics |
| `sme` | Placeholder — planned: sales/cashflow overview, invoices, inventory, customer follow-ups |
| `student` | Placeholder — planned: notes/summaries, deadlines, flashcards, study tracker |

Resolution order: an explicit `identity.persona` field wins if present; otherwise the
first persona-shaped word found in `identity.profession` (e.g. `["trader", "developer"]`
→ `trader`); falls back to `trader` if nothing matches or MAT-AI-OS is unreachable — the
panel never comes up empty. Switch persona with
`POST http://localhost:8000/identity {"field": "persona", "value": "creator"}`; MK1
picks it up on next load.

## Trading Workspace (persona: trader)

- **Symbol selector** — multi-select, up to 5 symbols, searchable popover.
- **Bias table** — per symbol: signal_health, scalping alignment, swing alignment
  (color-coded bullish/bearish/neutral), from mat-strategy-engine's
  `GET /core/slim/{symbols}`.
- **Candlestick chart** — [lightweight-charts](https://github.com/tradingview/lightweight-charts),
  timeframe selector (M1–D1), overlaid with SNR price lines and order-block/FVG boxes
  (via a custom series primitive — lightweight-charts has no native rectangles) from
  `GET /core/history/{symbol}/{timeframe}` + the slim SMC maps above.
- **Sidebar** (collapsible to an icon strip, state persists in `localStorage`):
  - **Account summary** — pinned, always visible — balance/equity/margin/free margin
    from MAT-AI-OS's `GET /trading/context`.
  - **Strategies drawer** — toggle list from mat-strategy-engine's `GET`/`PATCH
    /core/strategies`; only enabled strategies' signals notify chat.
  - **Active Trades drawer** — open positions with live P&L (`GET /trading/positions`);
    hidden entirely while there are no open positions.
  - **History drawer** — trade history + stats (win rate, avg realized R:R, P&L per
    symbol) from `GET /trading/history` + `/trading/history/stats`.
- **Suggest trade** — asks MAT-AI-OS's trading analyst (`POST /trading/suggest`) for a
  plan on the active symbol; the result lands in chat as a card with entry/SL/TP/volume/
  confidence and Approve/Reject buttons (`POST /trading/approve/{id}` executes on MT5,
  `POST /trading/reject/{id}` logs the reason — nothing trades without an explicit tap).
- **Signal notifications** — alignment/health changes between refreshes, and enabled-
  strategy signals (deduped so a held setup doesn't repeat every 30s), post as ⚡ system
  messages in chat.
- Everything on this panel auto-refreshes every 30s.

## Backends

| App | Port | Used for |
|---|---|---|
| [MAT-AI-OS](https://github.com/panamera-network/mat-ai-os) | 8000 | chat, identity/persona, trading suggest/approve/reject, account, positions, history |
| [mat-strategy-engine](https://github.com/panamera-network/mat-strategy-engine) | 8010 | slim analysis (bias/alignment/SNR/OB/FVG), chart candles, strategy toggles |

Both must be running for the workspace to populate — the app degrades to error banners
per-panel (not a crash) if either is unreachable.

## Getting started

```bash
npm install
npm run dev            # Vite dev server only
npm run electron:dev   # Vite + Electron together
```

```bash
npm run build     # tsc --noEmit && vite build
npm run release   # electron-builder — packaged output in release/
```

## Project structure

```
frontend/src/
  App.tsx                    Split layout (chat | workspace), resizable divider
  components/chat/           Existing chat UI + TradeSuggestionCard
  components/workspace/
    WorkspaceController.tsx  Persona resolution → picks the workspace below
    TradingWorkspace.tsx     Symbol selector, bias table, chart, signal notifications
    WorkspaceSidebar.tsx     Collapsible sidebar: account/strategies/trades/history drawers
    PriceChart.tsx           lightweight-charts wrapper + SNR/OB/FVG overlay primitive
    PlaceholderWorkspaces.tsx  Creator/SME/Student placeholders
  services/
    engineService.ts         mat-strategy-engine client (port 8010)
    tradingService.ts        MAT-AI-OS trading client (port 8000)
    identityService.ts       MAT-AI-OS identity/persona client
  hooks/useMatAi/            Chat + voice logic (pre-existing)
electron/                    Electron main + preload
```
