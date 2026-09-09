// Post-build: pin vite-react-ssg's inline bootstrap script(s) in the CSP.
//
// Our Content-Security-Policy is intentionally strict — `script-src 'self' …`
// with NO 'unsafe-inline'. That correctly blocks any inline <script>, including
// vite-react-ssg's `<script>window.__VITE_REACT_SSG_HASH__ = '…'</script>`.
// Blocked, the hash global stays undefined and the client fetches
// `static-loader-data-manifest-undefined.json` → a 404 (harmless: this app has
// no route loaders, but it logs a console error and dings Lighthouse).
//
// The secure fix is NOT 'unsafe-inline' (that would defeat the CSP). It is to
// allowlist the exact inline script by its sha256 — the CSP-recommended pattern.
// We scan the built HTML, hash every distinct inline script, and add each
// 'sha256-…' to the script-src directive in dist/_headers. Any tampering with
// the inline script changes its hash and is then blocked, so this preserves the
// XSS protection while letting the one known script run.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname
const HEADERS = join(DIST, '_headers')
const INLINE_SCRIPT_RE = /<script>([\s\S]*?)<\/script>/gi

function collectInlineScripts(dir, acc) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) collectInlineScripts(p, acc)
    else if (p.endsWith('.html')) {
      const html = readFileSync(p, 'utf8')
      let m
      while ((m = INLINE_SCRIPT_RE.exec(html)) !== null) {
        const body = m[1]
        if (body.trim()) acc.add(body) // exact bytes between the tags
      }
    }
  }
}

if (!existsSync(HEADERS)) {
  console.warn('[patch-ssg-csp] dist/_headers not found — skipping')
  process.exit(0)
}

const scripts = new Set()
collectInlineScripts(DIST, scripts)

const hashes = [...scripts].map(s => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`)
if (!hashes.length) {
  console.log('[patch-ssg-csp] no inline scripts found — nothing to pin')
  process.exit(0)
}

let headers = readFileSync(HEADERS, 'utf8')
// Inject the hashes right after `script-src 'self'`, skipping any already present.
headers = headers.replace(/script-src 'self'([^;]*)/i, (full, rest) => {
  const toAdd = hashes.filter(h => !full.includes(h))
  if (!toAdd.length) return full
  return `script-src 'self' ${toAdd.join(' ')}${rest}`
})
writeFileSync(HEADERS, headers)
console.log(`[patch-ssg-csp] pinned ${hashes.length} inline script hash(es) into CSP`)
