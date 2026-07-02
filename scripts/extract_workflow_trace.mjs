// Fire one Run Investigation, wait for Complete, then extract the archived
// run from localStorage['vigil-run-history'] and write it to disk as a
// sample trace log. Mirrors the "Download" button in the Full Trace overlay.
//
// Prerequisites: same as capture_workflow_screenshots.mjs (backend + UI running,
// Playwright + Chromium installed).
//
// Usage:
//   node scripts/extract_workflow_trace.mjs [OUT_PATH]
//   (defaults to ./workflow/sample-trace.json)
import { chromium } from 'playwright'
import { promises as fs } from 'fs'

const OUT = process.argv[2] || './workflow/sample-trace.json'
const UI = process.env.UI_URL || 'http://localhost:5173'
const MAX_WAIT_MS = 360_000

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } })
  const page = await context.newPage()
  await page.goto(UI, { waitUntil: 'networkidle' })
  await page.waitForSelector('.btn-run')

  console.log('triggering run...')
  await page.click('.btn-run')

  const t0 = Date.now()
  let lastStatus = ''
  while (Date.now() - t0 < MAX_WAIT_MS) {
    const s = (await page.locator('.status-pill').first().textContent().catch(() => ''))?.trim() ?? ''
    if (s !== lastStatus) { console.log(`  [t+${Math.round((Date.now() - t0) / 1000)}s] ${s}`); lastStatus = s }
    if (s === 'Complete' || s === 'Error') break
    await page.waitForTimeout(4000)
  }
  await page.waitForTimeout(2000)

  const traceRaw = await page.evaluate(() => window.localStorage.getItem('vigil-run-history'))
  if (!traceRaw) { console.error('no archived run in localStorage'); process.exit(1) }
  const runs = JSON.parse(traceRaw)
  console.log('archived runs:', runs.length)
  await fs.writeFile(OUT, JSON.stringify(runs[0], null, 2))
  console.log('wrote', OUT, `(${(JSON.stringify(runs[0]).length / 1024).toFixed(1)} KB)`)
  await browser.close()
})().catch(e => { console.error(e); process.exit(1) })
