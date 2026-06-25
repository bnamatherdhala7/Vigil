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

## Future: Deploying the Backend

When ready to deploy the backend publicly, Render, Railway, or Fly.io all work for a FastAPI + Python service. The flow:

1. Deploy backend → get its public URL (e.g., `https://vigil-backend.fly.dev`)
2. Set backend env vars on the host (Anthropic key, Pinecone key, Splunk credentials)
3. Update the UI to point at the backend — either via a `VITE_API_BASE` env var or a Vercel rewrite in `ui/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://vigil-backend.fly.dev/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

That's the path forward; not needed for the showcase UI deployment.
