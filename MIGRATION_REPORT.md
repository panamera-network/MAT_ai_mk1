# MAT-AI-MK1 → MAT-AI-OS Migration Audit

Audited: `D:\MAT_ai_mk1` (Electron/React desktop app) against `D:\MAT-AI-OS` (Python/FastAPI
orchestrator backend, already running on port **8000**, not 8880).

---

## 1. Direct LLM API calls

| # | File:Line | Provider | Status |
|---|-----------|----------|--------|
| 1 | `core/models/cloud/openai.ts:37-48` | OpenAI Chat Completions (`gpt-4o-mini`, streaming) | **Live** — reachable from the router's fallback path |
| 2 | `core/voice/speechToText.ts:44-50` | OpenAI Whisper (`whisper-1`, language locked `'ms'`) | **Live** — called from `electron/ipc/ai.ipc.ts:30-46` |
| 3 | `core/models/cloud/gemini.ts:42-57` | Google Gemini (`gemini-1.5-pro`) | **Dead code.** Nothing imports this file except itself — not reachable from `router.ts`, `ai.ipc.ts`, or anywhere in the live chat path. Verified via repo-wide import search. |
| 4 | `core/models/local/localManager.ts:69-82` | Ollama (`http://127.0.0.1:11434/api/chat`, 11 models incl. vision) | **Live** — local/offline mode |
| 5 | `core/models/local/phi.ts:1-27` | (wraps `localManager`, injects `CORE_SYSTEM_PROMPT`/`SAFETY_LAYER_PROMPT` from `prompts.ts`) | **Dead code.** Not imported by `router.ts` or anywhere reachable. `llama.ts`/`qwen.ts`/`gemma.ts` are empty skeletons. |
| 6 | `core/router/router.ts:92-100` | Attempted call to `http://127.0.0.1:8880/api/chat` (the intended MAT-AI-OS hook) | **Live, but pointed at the wrong port** — MAT-AI-OS actually listens on `:8000`. Falls back to OpenAI direct (#1) on any failure, which today means *every* call, since nothing is listening on 8880 for `/api/chat`. |
| 7 | `core/voice/textToSpeech.ts:76-100` | Kokoro local TTS server, `http://127.0.0.1:8880/v1/audio/speech` | **Live** — ⚠️ **same port (8880) as #6 above.** Two unrelated services configured on one port; this didn't collide yet only because #6 never actually got a real listener there. |
| 8 | `core/voice/textToSpeech.ts:111-143` | ElevenLabs TTS | **Live**, gated by `TTS_PROVIDER` env var (`KOKORO` is default) |

**Correction to a naive grep-based scan:** Gemini and the per-model Ollama wrapper files
(`phi.ts`, and the empty `llama.ts`/`qwen.ts`/`gemma.ts`) look "wired" because they're
proper TypeScript modules with real fetch/SDK calls, but they're **not on the call graph**
from the app's entry point. Only `openai.ts`, `localManager.ts`, and the
`speechToText.ts`/`textToSpeech.ts` voice pair are actually reachable today.

---

## 2. Router / classifier logic

**File:** `core/router/router.ts` — single exported function `matAiRouter()`.

- **Classification is not an LLM call** — it's a hardcoded `if/else` on the UI's mode
  toggle (`uiSelection: 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN'`), lines 60-69. There's a
  prompt for an *LLM-based* classifier (`ROUTER_CLASSIFIER_PROMPT` in `prompts.ts:47-55`)
  but it is never invoked — dead prompt, no call site.
- Builds the system prompt (`getSystemPromptWithStyle`, from `core/soul/responseStyle.ts`)
  and a time/location context string (`dapatkanKonteksMasa()`, lines 18-39 — Malaysia
  timezone, day-part labeling) and concatenates them into `fullSystemInstruction`.
- Dispatches via `switch (uiSelection)`:
  - `BRAIN` / `FAST_CLOUD` → POST to `127.0.0.1:8880/api/chat` (intended MAT-AI-OS hook,
    wrong port) → falls back to direct OpenAI on any error.
  - `FAST_LOCAL` → Ollama via `localManager.ts`.
- Maintains `shortTermMemory` (in-process) before and after the call (lines 55, 123).
- Notable: line 9-10 has the *developer's own* comment `// ❌ PADAM / BUANG IMPORT
  MEMORI LAMA NI MAT:` (delete/remove this old memory import) over a commented-out
  `getLongTermMemory` import — i.e. someone already started this exact migration and
  left a half-finished marker.

**Separately, and currently unwired:** `core/agent/agentloop.ts` (`runAgentAutonomousLoop`)
implements a real multi-turn tool-calling loop (max 3 iterations, parses tool calls via
`core/tool-router/toolParser.ts`, executes via `toolExecutor.ts` against a 3-tool registry
in `toolRegistry.ts`: `open_application`, `execute_terminal_command` with a destructive-
command blacklist, `search_internet` which is a stub). `router.ts:8` imports it but
**never calls it** in the function body — this entire subsystem is dead weight on the
current chat path, reachable only if something else invokes it directly (nothing does).

---

## 3. Soul / prompt system

Three files, and they don't fully agree with each other (see "what changes" below):

| File | Role |
|------|------|
| `core/soul/systemPrompt.txt` | The actual base prompt used at runtime — identity, personality rules, "BOSS" address, language-switching rule by mode. Read fresh off disk on every call (`responseStyle.ts:14`, `fs.readFileSync`, no caching). |
| `core/soul/responseStyle.ts` | `getSystemPromptWithStyle({intent, targetModelType})` — reads the `.txt` above, appends one of 3 hardcoded `[STYLE REINFORCEMENT]` blocks (`SEMBANG`/`KODING`/`BERAT`) based on the router's mode classification. **This is the prompt that actually reaches the model.** |
| `core/soul/prompts.ts` | `CORE_SYSTEM_PROMPT`, `VOICE_ENGINE_PROMPT`, `VISION_ENGINE_PROMPT`, `SAFETY_LAYER_PROMPT`, `SEARCH_ENGINE_PROMPT`, `ROUTER_CLASSIFIER_PROMPT`, plus a `compileFinalSystemPrompt()` helper that stitches `systemPrompt.txt` + `CORE_SYSTEM_PROMPT` + `SAFETY_LAYER_PROMPT`. **None of this file's exports are used by the live `router.ts` → `responseStyle.ts` path** — `compileFinalSystemPrompt` has no call sites at all; `CORE_SYSTEM_PROMPT`/`SAFETY_LAYER_PROMPT` are only pulled in by the dead `phi.ts` and dead `gemini.ts`. |

Net effect: the *intended* layered prompt (identity + safety + voice/vision rules +
style) only partially exists in the live path. Live calls get
`systemPrompt.txt` + a 4-line style block — no safety layer, no voice/vision-specific
rules, despite those being fully written out in `prompts.ts`.

This is functionally close to (but not identical in wording/strictness to) the
personality already implemented server-side in MAT-AI-OS's `core/soul.py`
(`SoulManager`: `soul_prompt` + per-mode `response_styles` + `safety_rules` + `active_style`,
persisted to `core/soul.json`, editable via `PUT /soul/prompt` etc.) — same shape
(base + style layer + safety), already built, already has an HTTP API and a UI editor.

---

## 4. Memory system

| File | What it is | Status |
|------|------------|--------|
| `core/memory/shortTerm.ts` | `ShortTermMemory` class — `Map<sessionId, ChatMessage[]>`, sliding window (default 20 msgs), `addMessage`/`getHistory`/`clearSession`. **All in-process RAM — gone on every restart.** | **Live**, used by `router.ts` lines 55 & 123. Hardcoded single `sessionId = "default-user"` (line 48 of `router.ts`) — there is no real multi-session support despite the class supporting it. |
| `core/memory/memoryManager_old.ts` | Reads `core/memory/memory.md` as flat long-term context | **Dead.** Import already commented out in `router.ts:9-10` with the developer's own "delete this" note. |
| `core/services/db.service_old.ts` | NeDB (`mat_ai_memory.db`) — `saveMessage`/`getHistory` | **Half-dead, and currently broken in practice.** `getHistory` is wired to a live IPC handler (`mat-ai:get-history` in `ai.ipc.ts:108-122`) that the frontend presumably calls to show chat history — but `saveMessage` (the only thing that writes to this DB) is called *only* from the dead `gemini.ts`. **Net result: the chat-history IPC call returns whatever's already in the old NeDB file and nothing new is ever added to it.** This is a real, currently-shipping bug, not just dead code — worth knowing before assuming "history works." |
| `data/embeddings/`, `data/memory/` | Empty directories | **Never implemented.** No vector store, no embeddings, anywhere in this codebase. |

There is **no persistent, no semantic, and no cross-session memory** in MAT-AI-MK1 today.
Everything durable that exists (mem0, tiers, per-agent memory, per-user memory) already
lives in MAT-AI-OS.

---

## 5. Current AI capabilities

- **Voice STT** — OpenAI Whisper, hardcoded to Malay (`speechToText.ts:41`). Captured via
  `MediaRecorder` in the renderer (`frontend/src/services/voiceRecorderService.ts`),
  shipped to main process over IPC (`mat-ai:transcribe`).
- **Voice TTS** — dual-provider: Kokoro (local FastAPI server, port **8880**, this repo
  bundles its own Python venv under `core/voice/Kokoro-backend/`) or ElevenLabs (cloud),
  selected by `TTS_PROVIDER` env var. Playback via OS-native `exec()` (PowerShell on
  Windows). Auto-triggered when `inputMode === 'voice'` (`ai.ipc.ts` `shouldSpeak` flag).
- **Vision** — image attachments handled two ways depending on mode: Ollama vision
  models get raw base64 in the Ollama message's `images` field
  (`localManager.ts:49-63`); OpenAI gets an `image_url` content block
  (`openai.ts:17-29`). No vision path exists for the MAT-AI-OS branch yet (it just
  forwards `text`/`system_prompt`/`user_id` — see router.ts:95-99 — attachments aren't
  part of that payload at all).
- **"Loops"/automation** — `core/agent/agentloop.ts` is a real, written multi-turn
  tool-calling loop with a small tool registry (open app, run a shell command with a
  destructive-command blacklist, a search-internet stub) — **but it's dead code**, not
  invoked from the live router (see §2). No cron/scheduled-task system exists;
  `core/agent/taskQueue.ts` is an empty file. (MAT-AI-OS already has a real Loops Engine
  with APScheduler-backed cron/interval triggers — this MK1 code is not a competing
  implementation, it never shipped.)
- **Wake-word** — `electron/kwsService.ts` is a 7-line stub that just logs and explicitly
  says wake-word detection is deferred to the Python backend.
- **HTTP bridge for wakeup signals** — `electron/main.ts:45-70` runs a small `http`
  server on port **3000**, listening for `POST /api/wakeup`, intended for MAT-AI-OS to
  push a wake event into the Electron window. Not yet called by anything on the MAT-AI-OS
  side (no matching outbound call exists in the backend repo as of this audit).

---

## 6. What needs to be REMOVED

Outright delete (dead, broken, or superseded by something MAT-AI-OS already does better):

1. **`core/models/cloud/gemini.ts`** — dead code, unreachable, and the only thing keeping
   `@google/generative-ai` in `package.json`.
2. **`core/models/local/phi.ts`, `llama.ts`, `qwen.ts`, `gemma.ts`** — dead/empty skeletons.
3. **`core/memory/memoryManager_old.ts`** and **`core/memory/memory.md`** (if present) —
   already half-removed by the dev; finish the job.
4. **`core/services/db.service_old.ts`** and its NeDB dependency (`nedb-promises`) — the
   write path is dead (only called from dead Gemini code) and the read path
   (`mat-ai:get-history`) is serving stale data from a DB nothing populates anymore.
   Real persistent history belongs in MAT-AI-OS (`GET /session/{session_id}`,
   `ConversationManager`) — point the frontend's history UI there instead.
5. **`core/memory/shortTerm.ts`** and its use in `router.ts` (lines 6, 55, 123) — MAT-AI-OS
   already does per-session conversation history server-side (`ConversationManager`,
   last-10-turns context injection) and now also per-user scoping via `X-User-ID`. This
   in-process Map duplicates that and will drift out of sync with the server's view.
6. **`core/agent/agentloop.ts`, `core/tool-router/*` (toolRegistry.ts, toolParser.ts,
   toolExecutor.ts), `core/skills/*`** — already dead on the chat path, and MAT-AI-OS has
   its own (live, wired) agent/skill/tool-execution model. Don't resurrect this; delete it.
   Exception: if any of the 3 concrete tool implementations
   (`open_application`/`execute_terminal_command`) are genuinely wanted as **desktop-only
   capabilities a server backend can't have** (launching a local .exe, running a local
   shell command), that's a legitimate reason to keep a *thin* version — but as a
   capability MAT-AI-OS's MCP layer calls into (expose it as an MCP tool server, the way
   MAT-AI-OS's `mcp_server.py` already works), not as a parallel client-side AI loop.
7. **`core/soul/prompts.ts` and `core/soul/responseStyle.ts`** — the personality/prompt
   compilation logic moves server-side. MAT-AI-OS's `SoulManager` already implements
   base-prompt + per-style-block + safety-rules composition with an editable API
   (`GET/POST /soul`, `/soul/prompt`, `/soul/style/{mode}`). Keep `systemPrompt.txt`'s
   *content* only as reference material to seed MAT-AI-OS's `soul.json` once, not as
   live code.
8. **`core/router/router.ts`'s classification logic and direct-LLM dispatch** (lines
   41-126, except the parts noted in §7 below) — once MAT-AI-OS is the single chat
   endpoint, there's nothing left to classify or dispatch client-side.
9. **`core/models/cloud/openai.ts`'s direct chat-completions call** (lines 37-48) and the
   **OpenAI API key from the Electron app's `.env`** — once the MAT-AI-OS route is fixed
   and reliable, the fallback-to-direct-OpenAI path is exactly the kind of duplicate LLM
   surface this migration is meant to eliminate. (Whisper STT, a different concern, is
   addressed separately in §7 — don't conflate "remove chat-completions" with "remove
   Whisper.")
10. **`@google/generative-ai` and `nedb-promises` from `package.json`** once 1 and 4 are gone.

---

## 7. What needs to be KEPT (pure interface layer)

This is what an Electron *client* of MAT-AI-OS should still own:

1. **`electron/` main process, IPC layer (`ai.ipc.ts`, `system.ipc.ts`, `tools.ipc.ts`),
   `preload.ts`, window management** — this is exactly the "thin client" shell. Keep it,
   but gut what `ai.ipc.ts`'s `mat-ai:chat` handler calls into (point it at MAT-AI-OS's
   `POST /task` instead of `matAiRouter`).
2. **`frontend/` (React/Vite UI)** in its entirety as a *rendering* layer — chat panel,
   model selector, voice mic button, waveform, orb animation. None of it needs to change
   structurally; only what it's wired to (the IPC payload shape) changes.
3. **Voice capture** — `frontend/src/services/voiceRecorderService.ts`
   (`MediaRecorder`/WebM capture) stays; it's a browser API wrapper with no AI logic.
4. **Whisper STT call** (`core/voice/speechToText.ts`) — keep *as a capability*, but
   consider whether it should stay a direct OpenAI call from Electron (cheap, low-latency,
   no reason to round-trip audio through MAT-AI-OS) or move server-side. Given MAT-AI-OS's
   `/task/upload` already accepts file attachments and has its own retry/health-monitoring
   wrapped around LLM calls, routing transcription through it would centralize API-key
   management (one place, not two) at the cost of an extra hop. Lean toward keeping it
   local for latency unless centralizing the API key matters more than that. **Either way,
   this is a deliberate choice to make, not a "remove."**
5. **TTS (Kokoro/ElevenLabs) + audio playback** (`core/voice/textToSpeech.ts`) — same
   reasoning as Whisper: this is output rendering, not "the brain." Keep it client-side,
   but **fix the port collision (see §6 item 9 / §8 below) before wiring MAT-AI-OS chat
   onto 8880**, since Kokoro is already squatting there.
6. **Ollama local-model path** (`core/models/local/localManager.ts`) — this is arguably
   the one piece of "direct LLM call" logic worth deliberately keeping, since MAT-AI-OS's
   own `core/llm_provider.py` already supports Ollama as a provider
   (`set_active_model("ollama", ...)`) — so the *real* question isn't "keep or remove,"
   it's "should Electron call Ollama directly for the FAST_LOCAL mode, or should that mode
   just become another `/models/select` call against MAT-AI-OS?" Given MAT-AI-OS already
   owns model selection, retry logic, and health monitoring for every other provider,
   routing FAST_LOCAL through it too (rather than maintaining a second Ollama client) is
   the more consistent choice — but it's a real tradeoff (an extra network hop for
   "fast/local" mode specifically undercuts its own purpose), worth deciding deliberately
   rather than defaulting either way.
7. **`electron/main.ts`'s wakeup HTTP server (port 3000)** — keep as the integration point
   for any future wake-word/proactive-trigger feature from MAT-AI-OS; just note that
   nothing on the backend side calls it yet.
8. **The mode toggle UI itself** (`FAST_LOCAL`/`FAST_CLOUD`/`BRAIN`) — keep as a *user-facing
   preference* (e.g. "prefer fast/cheap vs. thorough"), but stop using it to pick which
   *code path* runs locally; instead pass it to MAT-AI-OS as a hint (it already has
   `/models/select` and could be extended to accept a lightweight "mode" the Orchestrator
   maps to a model/skill choice, or — more in line with what already exists — just let
   the Orchestrator's own Router (`core/router.py`, with its own LLM-based domain
   classification and 1hr cache) make that call entirely, and repurpose the toggle as a
   model-tier preference only.

---

## 8. What CHANGES (the actual migration work)

1. **Fix the port.** `router.ts:92` targets `127.0.0.1:8880`; MAT-AI-OS listens on
   `127.0.0.1:8000`. This single-line fix is necessary but not sufficient — see next point.
2. **Match the request/response contract.** MAT-AI-OS's chat endpoint is
   `POST /task` with body `{task, session_id?, priority?}` (see `main.py`'s
   `TaskRequest`/`TaskResponse`) and an `X-User-ID` header for per-user scoping — not
   `{text, system_prompt, user_id}` as `router.ts:95-99` currently sends. Concretely:
   - `text` → `task`
   - `system_prompt` → **drop entirely** — MAT-AI-OS's `SoulManager` already owns prompt
     composition server-side; sending a client-built prompt either gets ignored or (worse)
     double-applies personality. The "intent" classification (`SEMBANG`/`KODING`/`BERAT`)
     should map to nothing, or at most to model-tier selection (see §7.8) — not a prompt.
   - `user_id: "tuan_farez"` (hardcoded) → real `X-User-ID` header, or omit it and let
     MAT-AI-OS default to `"farez"` (it already does, via `DEFAULT_USER_ID`).
   - Need a `session_id` — `shortTermMemory`'s `sessionId = "default-user"` constant
     (`router.ts:48`) should become a real per-conversation id generated client-side
     (the UI already has the concept via "New Chat") and passed through; MAT-AI-OS
     returns/continues sessions by this id already (`TaskResponse.session_id`).
   - Response shape: `{ok, text}` (what `router.ts` expects today) →
     `TaskResponse.result`. Also note MAT-AI-OS may return `{queued: true, task_id}`
     instead of an immediate result if it's busy — the Electron client needs to handle
     that (poll `GET /queue/{task_id}`), which today's fire-and-forget fetch does not.
3. **Decide image-attachment handling.** Today's payload to 8880 carries no `attachment`
   field at all (compare to the Ollama/OpenAI paths, which both thread it through) — even
   after the contract fix above, attachments need either: (a) MAT-AI-OS's
   `POST /task/upload` multipart endpoint instead of `POST /task` when an attachment is
   present, or (b) a base64 field added to MAT-AI-OS's `/task` contract. (a) already
   exists and works; prefer it.
4. **Streaming.** `router.ts`'s OpenAI/Ollama paths stream chunks to the renderer via
   `_event.sender.send('mat-ai:stream-chunk', ...)`; MAT-AI-OS's `/task` is a single
   request/response (no SSE/streaming token-by-token). Either accept the UX downgrade
   (spinner instead of live-typing for cloud/brain mode) or use MAT-AI-OS's WebSocket
   (`/ws`) for progress events (`task_started`/`task_completed`) as a coarser substitute —
   it does not stream individual tokens today.
5. **Multi-turn context.** Once `shortTermMemory` is removed, conversation continuity
   depends entirely on consistently passing the same `session_id` back on every call —
   verify the IPC handler (`ai.ipc.ts`) and the React hook (`useMatAi/chatLogic.ts`)
   actually persist and resend it; this is new wiring, not a one-line swap.
6. **Decide the fallback behavior.** Today, *any* failure reaching 8880 silently falls
   back to a direct OpenAI call (`router.ts:109-112`) — i.e. MAT-AI-OS being down was
   invisible to the user. Once MAT-AI-OS is the only brain, a backend outage should
   surface as an actual error state in the UI (MAT-AI-OS's own `/health` endpoint, which
   this audit's prior work added `qdrant_status`/`alert_count`/etc. to, is the right thing
   to poll) rather than silently degrading to a different, ungoverned, un-personality'd
   LLM call.
7. **`.env` cleanup** — once §6 items 1/9/10 are removed, `OPENAI_API_KEY` and
   `GEMINI_API_KEY` can leave the Electron app's `.env` (Whisper STT, if kept client-side
   per §7.4, still needs `OPENAI_API_KEY`, so don't blanket-delete it without checking
   that decision first).

---

## Summary table

| Subsystem | Verdict |
|---|---|
| Router classification (hardcoded if/else) | **Remove** — server picks the model/skill now |
| Direct OpenAI chat-completions | **Remove** |
| Direct Gemini | **Remove (dead already)** |
| Direct Ollama (local mode) | **Decide** — keep as client-side fast-path, or route through MAT-AI-OS's existing Ollama provider support |
| Whisper STT | **Decide / likely keep client-side** for latency |
| Kokoro/ElevenLabs TTS | **Keep client-side** — output rendering, not reasoning. Fix port 8880 collision first. |
| `shortTermMemory` (in-RAM history) | **Remove** — MAT-AI-OS's `ConversationManager` replaces it |
| `db.service_old` (NeDB history) | **Remove** — already broken (write path dead), MAT-AI-OS has real session history |
| `prompts.ts` / `responseStyle.ts` (soul) | **Remove** — MAT-AI-OS's `SoulManager` replaces it; port `systemPrompt.txt` content into `soul.json` once as a seed, not as live code |
| `agentloop.ts` / `tool-router/*` / `skills/*` | **Remove** — dead already; MAT-AI-OS owns agent/skill execution. Exception: desktop-only OS actions (open app, run local shell command) could become an MCP tool server MAT-AI-OS calls into, not a parallel client brain |
| Electron shell, IPC, preload, window mgmt | **Keep**, rewire `mat-ai:chat` to call MAT-AI-OS |
| React frontend (chat/voice/vision UI) | **Keep**, only the IPC payload/response shape changes |
| Voice capture (MediaRecorder) | **Keep** — pure browser API |
| Wakeup HTTP server (port 3000) | **Keep** — unused integration point for future backend-initiated wake events |
