import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const BOARD_DEMO_HTML = [
  'index.htm',
  'index2.html',
  'index3.html',
  'index4.html',
  'index5.html',
  'ot/detail-dashboard.html',
]

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
          if (!existsSync(src)) continue
          const dest = resolve(outDir, file)
          const destDir = resolve(dest, '..')
          if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })
          copyFileSync(src, dest)
        }
        const flowsCss = resolve(__dirname, 'src/styles/flows.css')
        const otCssOut = resolve(outDir, 'ot/flows.css')
        if (existsSync(flowsCss)) {
          mkdirSync(resolve(otCssOut, '..'), { recursive: true })
          copyFileSync(flowsCss, otCssOut)
        }
      },
    },
  ],
  base: process.env.GITHUB_PAGES === 'true' ? '/bpl-demo/' : '/',
})
