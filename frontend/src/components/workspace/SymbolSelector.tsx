// frontend/src/components/workspace/SymbolSelector.tsx
// Multi-select symbol picker (max 5) — chips + searchable popover.

import { useEffect, useRef, useState } from 'react'

export const MAX_SYMBOLS = 5

interface SymbolSelectorProps {
  allSymbols: string[]
  selected: string[]
  onChange: (symbols: string[]) => void
}

export function SymbolSelector({ allSymbols, selected, onChange }: SymbolSelectorProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const toggle = (symbol: string) => {
    if (selected.includes(symbol)) {
      onChange(selected.filter((s) => s !== symbol))
    } else if (selected.length < MAX_SYMBOLS) {
      onChange([...selected, symbol])
    }
  }

  const visible = allSymbols.filter((s) => s.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="symbol-selector" ref={rootRef}>
      <div className="symbol-chips">
        {selected.map((s) => (
          <span key={s} className="symbol-chip">
            {s}
            <button type="button" className="chip-remove" onClick={() => toggle(s)} title="Remove">
              ×
            </button>
          </span>
        ))}
        <button
          type="button"
          className="chip-add"
          onClick={() => setOpen((p) => !p)}
          disabled={!allSymbols.length}
          title={allSymbols.length ? 'Add symbol' : 'Loading symbols…'}
        >
          + Symbol
        </button>
      </div>

      {open && (
        <div className="symbol-popover">
          <input
            type="text"
            className="symbol-filter"
            placeholder="Search…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
          <div className="symbol-options">
            {visible.map((s) => {
              const isSelected = selected.includes(s)
              const disabled = !isSelected && selected.length >= MAX_SYMBOLS
              return (
                <button
                  type="button"
                  key={s}
                  className={`symbol-option${isSelected ? ' selected' : ''}`}
                  disabled={disabled}
                  onClick={() => toggle(s)}
                >
                  <span>{s}</span>
                  {isSelected && <span>✓</span>}
                </button>
              )
            })}
            {!visible.length && <div className="symbol-empty">No match</div>}
          </div>
          <div className="symbol-hint">
            {selected.length}/{MAX_SYMBOLS} selected
          </div>
        </div>
      )}
    </div>
  )
}
