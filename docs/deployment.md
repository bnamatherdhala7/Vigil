# Deployment Guide

## Architecture (Two Surfaces)

Vigil has two deployable surfaces:

| Surface | What It Is | Where It Runs |
|---|---|---|
| **UI** (`ui/`) | Vite + React war-room dashboard | Vercel (static hosting) |
| **Backend** (`api/`, `phase1_mcp/`, `phase2_agent/`) | FastAPI server + Python FSM commander + MCP server | Local dev today; Render / Railway / Fly.io for production |

For a public showcase, the UI alone is enough — the Forecast Strip uses pre-computed fixtures, the Run History persists to localStorage, and the Full Trace overlay works on any archived run. The Run Investigation button needs the backend; if the backend is not reachable, the UI shows a friendly error and the rest of the surface still works.

---

## Deploying the UI to Vercel

### Prerequisites

- A Vercel account (free tier is sufficient)
- The Vercel CLI installed locally: `npm install -g vercel`

### One-Time Setup

```bash
cd ui
vercel login          # browser-based, one-time
vercel link           # links this directory to a Vercel project
                      # → choose: Set up and deploy "ui"
                      # → Scope: your account
                      # → Link to existing? No
                      # → Project name: vigil-ui (or your choice)
                      # → Directory: ./ (current directory)
                      # → Override settings? No (vercel.json handles it)
```

### Deploy

```bash
cd ui
vercel              # preview deploy — gives a unique URL
vercel --prod       # production deploy — promotes to your project's primary URL
```

The included `ui/vercel.json` handles:
- SPA rewrites (every route falls back to `index.html` for client-side routing)
- Long-lived cache headers for `/assets/*` (Vite produces hashed filenames so this is safe)

### Build Settings (Vercel auto-detects, but for reference)

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Root Directory | `ui` |

If you connect the GitHub repo directly via the Vercel dashboard (instead of CLI), set **Root Directory** to `ui` in Project Settings.

---

## Security — No Secrets in the Deployed UI

The UI bundle is static — anything in `import.meta.env.VITE_*` ships to the browser and is **public**. The UI does **not** reference any secrets and should never reference any secrets. All credentials live in the backend's `.env`, which is:

- Listed in `.gitignore` (verified)
- Never committed to history (verified)
- Read only by the FastAPI server and the Python FSM commander

When deploying the backend separately, set environment variables in the backend host's dashboard — do not put real keys in `.env.example` (it only contains placeholders today).

### Verifying Before Each Push

```bash
# Confirm .env is not tracked
git ls-files | grep -E "\.env$|\.env\." && echo "DANGER" || echo "OK"

# Confirm no key patterns in tracked files
git grep -E "sk-[A-Za-z0-9]{20,}|pcsk_|hf_[A-Za-z0-9]{20,}" || echo "OK"
```

Both checks must print `OK`.

---

## Running Locally (Full Stack)

The deployed Vercel UI will show the Forecast Strip, FSM diagram, and Run History without a backend. To exercise an actual investigation end-to-end, run the backend locally:

```bash
# Terminal 1 — backend
pip install -e ".[dev]"
python -m api.server         # FastAPI on :8000

# Terminal 2 — UI (dev mode, proxies /api → :8000)
cd ui
npm install
npm run dev                  # Vite on :5173
```

Open `http://localhost:5173`. The Run Investigation button now hits the local backend via SSE.

---

## Deploying the Backend to Railway

**Why Railway** (not Vercel): the FSM commander is a long-running stateful process — an investigation can be tens of seconds of Claude calls, MCP tool calls, and Pinecone lookups. Serverless platforms like Vercel Functions have short duration limits and cold starts that don't fit this workload. Railway runs a persistent container, deploys on `git push`, and has a generous free tier.

### Prerequisites

- Railway account (free tier is sufficient)
- The GitHub repo already connected

### Files in this repo that Railway uses

| File | Purpose |
|---|---|
| `nixpacks.toml` | Tells Nixpacks (Railway's builder) to install Python 3.11 and run `pip install .` off `pyproject.toml` — picks up the full runtime dep set. |
| `railway.toml` | Start command (`uvicorn api.server:app --host 0.0.0.0 --port $PORT`), restart policy. |

**Local dev is unaffected** — neither file is read by `pip`, `python -m api.server`, or Vite. Both files are only consumed by Railway during build/deploy.

### Steps

1. **Create the project.** [railway.app/new](https://railway.app/new) → **Deploy from GitHub repo** → select `bnamatherdhala7/Vigil`. Railway detects `nixpacks.toml` + `railway.toml` and starts the first build.

2. **Set environment variables.** In the Railway project → **Variables** tab, add every key from `.env.example`:
   - `ANTHROPIC_API_KEY`
   - `PINECONE_API_KEY`, `PINECONE_SPL_INDEX`, `PINECONE_INCIDENT_INDEX`, `PINECONE_ENVIRONMENT`
   - `OPENAI_API_KEY`
   - `SPLUNK_URL`, `SPLUNK_TOKEN`, `SPLUNK_MCP_URL` (optional — the app runs without Splunk connectivity if the MCP endpoint is unreachable)

3. **Trigger a redeploy** so the new env vars take effect. Railway → **Deployments** → **Redeploy**.

4. **Get the public URL.** Railway → **Settings** → **Domains** → **Generate Domain**. You'll get something like `vigil-production.up.railway.app`. Verify it:
   ```bash
   curl https://<your-railway-url>/api/scenarios
   # Should return JSON — a list of scenario IDs
   ```

### Wiring the Vercel UI to the Railway backend

Once you have a working Railway URL, update `ui/vercel.json` to proxy `/api/*` requests through Vercel to Railway:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://<your-railway-url>/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

Commit + push. Vercel auto-redeploys. The **Run Investigation** button now hits Railway, and the friendly "Backend not reachable" banner disappears.

### Local dev after wiring to Railway

**Nothing changes.** Local dev continues to use the Vite proxy from `ui/vite.config.ts` which forwards `/api/*` to `http://localhost:8000`. That proxy is *only* active in `npm run dev` mode — Vercel builds use the `vercel.json` rewrites instead. The two paths do not interfere.

To flip the UI back to a purely local backend on a Vercel deploy, delete the `/api/(.*)` rewrite from `ui/vercel.json`; the UI falls back to showing the "Backend not reachable" banner.
