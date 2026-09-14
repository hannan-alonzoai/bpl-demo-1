import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const BOARD_DEMO_HTML = ['index.htm', 'index2.html', 'index3.html', 'index4.html', 'index5.html']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-board-html-demos',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        for (const file of BOARD_DEMO_HTML) {
          const src = resolve(__dirname, file)
          if (existsSync(src)) copyFileSync(src, resolve(outDir, file))
        }
      },
    },
  ],
  base: process.env.GITHUB_PAGES === 'true' ? '/bpl-demo/' : '/',
})
