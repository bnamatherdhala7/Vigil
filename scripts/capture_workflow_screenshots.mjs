// Capture the workflow/ screenshots against the running local UI.
//
// Prerequisites:
//   1. Backend + UI running locally on :8000 and :5173
//      python -m api.server           (terminal 1)
//      cd ui && npm run dev           (terminal 2)
//   2. Playwright installed with a Chromium binary:
//      npm install --no-save playwright && npx playwright install chromium
//
// Usage:
//   node scripts/capture_workflow_screenshots.mjs [OUT_DIR]
//   (defaults to ./workflow/screenshots)
//
// This script fires one real Run Investigation against the packet_loss
// scenario, waits up to 6 min for the FSM + evaluator phase to reach
// Complete, then captures every UI region. Cost: ~$0.05–0.20 of
// Anthropic + Pinecone API budget per run.
import { chromium } from 'playwright'
import { promises as fs } from 'fs'
import path from 'path'

const OUT = process.argv[2] || './workflow/screenshots'
const UI = process.env.UI_URL || 'http://localhost:5173'
const MAX_WAIT_MS = 360_000

async function shot(page, selector, name) {
  const loc = page.locator(selector).first()
  await loc.waitFor({ state: 'visible', timeout: 15000 })
  await loc.screenshot({ path: path.join(OUT, name) })
  console.log('✓', name)
}
async function full(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: true })
  console.log('✓', name, '(full)')
}
async function statusText(page) {
  return (await page.locator('.status-pill').first().textContent().catch(() => ''))?.trim() ?? ''
}

;(async () => {
  await fs.mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1800, height: 1150 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()

  console.log('loading', UI)
  await page.goto(UI, { waitUntil: 'networkidle' })
  await page.waitForSelector('.app-header')
  await page.waitForTimeout(1500)

  console.log('=== idle capture ===')
  await full(page, '00-overview-idle.png')
  await shot(page, '.app-header', '01-header.png')
  await shot(page, '.forecast-card-container', '02-forecast-strip.png')
  await shot(page, '.fsm-card', '03-fsm-idle.png')

  console.log('=== triggering Run Investigation ===')
  await page.click('.btn-run')
  const t0 = Date.now()
  let lastStatus = ''
  while (Date.now() - t0 < MAX_WAIT_MS) {
    const s = await statusText(page)
    if (s !== lastStatus) {
      console.log(`  [t+${Math.round((Date.now() - t0) / 1000)}s] status: ${s}`)
      lastStatus = s
    }
    if (s === 'Complete' || s === 'Error') break
    await page.waitForTimeout(5000)
  }
  await page.waitForTimeout(3000)

  console.log('=== post-run capture ===')
  await full(page, '06-overview-complete.png')
  await shot(page, '.fsm-card', '07-fsm-complete.png')

  const cards = await page.locator('.middle-row > .card').all()
  if (cards.length >= 3) {
    await cards[0].screenshot({ path: path.join(OUT, '08-tool-calls.png') });     console.log('✓ 08-tool-calls.png')
    await cards[1].screenshot({ path: path.join(OUT, '09-evidence.png') });       console.log('✓ 09-evidence.png')
    await cards[2].screenshot({ path: path.join(OUT, '10-incident-report.png') });console.log('✓ 10-incident-report.png')
  }
  await shot(page, '.eval-card', '11-evaluator.png')
  await shot(page, '.history-card', '12-run-history.png')

  const rows = await page.locator('.run-history-item').count()
  if (rows > 0) {
    await page.locator('.run-history-item').first().click()
    await page.waitForSelector('.trace-overlay-panel', { timeout: 5000 })
    await page.waitForTimeout(1500)
    await shot(page, '.trace-overlay-panel', '13-full-trace-overlay.png')
  } else {
    console.log('(no archived runs — skipping Full Trace overlay)')
  }

  await browser.close()
  console.log('DONE ->', OUT)
})().catch(e => { console.error(e); process.exit(1) })
