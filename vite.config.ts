// vite.config.ts
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

// Kita sediakan objek alias pusat supaya senang nak kongsi antara frontend & backend
const sharedAliases = {
  '@core': path.resolve(__dirname, './core'),
  '@electron': path.resolve(__dirname, './electron')
}

export default defineConfig({
  // 🚀 Set root ke folder frontend supaya Vite jumpa index.html kau
  root: path.resolve(__dirname, 'frontend'), 
  base: './',
  plugins: [
    react(),
    electron({
      main: {
        entry: path.resolve(__dirname, 'electron/main.ts'),
        vite: {
          resolve: {
            alias: sharedAliases // 🛡️ Lindungi backend main supaya faham path @core
          },
          build: {
            outDir: path.resolve(__dirname, 'dist-electron'),
            emptyOutDir: true,
            lib: {
              entry: path.resolve(__dirname, 'electron/main.ts'),
              formats: ['cjs'], 
              fileName: () => 'main.cjs', 
            },
            rollupOptions: {
              external: ['electron', 'sherpa-onnx', 'node-record-lpcm16'], // Elakkan bundling modul native yang berat, biar jadi dependencies luar
            },
          },
        },
      },
      preload: {
        input: path.resolve(__dirname, 'electron/preload.ts'),
        vite: {
          resolve: {
            alias: sharedAliases // 🛡️ Lindungi preload juga kalau ada pakai @core
          },
          build: {
            outDir: path.resolve(__dirname, 'dist-electron'),
            rollupOptions: {
              output: {
                entryFileNames: 'preload.cjs',
                chunkFileNames: 'preload-chunk.cjs',
              },
            },
          },
        },
      },
    }),
  ],
  build: {
    // Paksa hasil compile frontend React keluar ke folder 'dist' kat root luar
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      ...sharedAliases, // Masukkan kongsi alias (@core, @electron) ke frontend
      '@services': path.resolve(__dirname, './frontend/src/services'),
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },
})