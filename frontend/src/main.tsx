import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './App.css'

/**
 * Renderer entry: mounts the React tree into `index.html` → `#root`.
 */
const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Renderer bootstrap failed: missing #root element.')
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
