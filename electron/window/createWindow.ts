// createWindow.ts
import { BrowserWindow, app } from 'electron'
import path from 'node:path'

const isDev = !app.isPackaged && Boolean(process.env['VITE_DEV_SERVER_URL'])
const preloadFile = path.join(__dirname, 'preload.cjs')

export function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 560,
    title: 'MAT.ai',
    webPreferences: {
      preload: preloadFile,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
    },
  })

  win.webContents.on('preload-error', (_event, preloadPath, error) => {
    console.error('[MAT.ai] Preload failed to load:', preloadPath, error)
  })

  if (isDev && process.env['VITE_DEV_SERVER_URL']) {
    void win.loadURL(process.env['VITE_DEV_SERVER_URL'])
    if (process.env['MAT_AI_OPEN_DEVTOOLS'] === '1' || process.env['MAT_AI_OPEN_DEVTOOLS'] === 'true') {
      win.webContents.openDevTools({ mode: 'detach' })
    }
  } else {
    // Memandangkan kedudukan main cjs berada di dist-electron, index.html ada di ../dist/index.html
    void win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  return win
}