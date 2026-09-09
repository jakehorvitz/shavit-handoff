import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    dirStyle: 'nested',
    onPageRendered(_route, html) {
      html = html.replace(/<title data-rh="true">/g, '<title>')
      // Force <meta charset> to be the FIRST element in <head>. vite-react-ssg's
      // helmet injection puts <title>/<meta> ahead of the static charset, which
      // trips Lighthouse's "charset declaration too late" best-practice check.
      html = html.replace(/<meta\s+charset=["'][^"']*["']\s*\/?>/gi, '')
      html = html.replace(/<head>/i, '<head><meta charset="utf-8">')
      return html
    },
  },
})
