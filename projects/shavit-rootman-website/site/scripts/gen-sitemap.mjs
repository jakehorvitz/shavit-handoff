// gen-sitemap.mjs — regenerates public/sitemap.xml from properties.js before
// each build, attaching every listing thumbnail + gallery photo to the homepage
// URL via the Google image-sitemap extension so the photos (which only mount
// client-side in the lightbox) are still discoverable by Google Images.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { PROPERTIES } from '../src/properties.js'

const SITE = 'https://shavitrootman.com'
const here = dirname(fileURLToPath(import.meta.url))

const imgs = []
for (const p of PROPERTIES) {
  if (p.photo) imgs.push(p.photo)
  if (Array.isArray(p.photos)) imgs.push(...p.photos)
}
const unique = [...new Set(imgs)]
const imageXml = unique
  .map((u) => `    <image:image><image:loc>${SITE}${u}</image:loc></image:image>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
${imageXml}
  </url>
  <url><loc>${SITE}/meet</loc></url>
  <url><loc>${SITE}/accessibility</loc></url>
</urlset>
`
writeFileSync(join(here, '../public/sitemap.xml'), xml)
console.log(`[gen-sitemap] wrote sitemap.xml with ${unique.length} image entries`)
