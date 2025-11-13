Render deployment setup for the MediSync mock API
================================================

Follow these steps to deploy the `server/` mock API to Render. This guide assumes you have a Render account.

1) Create a new Web Service on Render
   - Sign in to https://dashboard.render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository and choose this repository.
   - Under "Root Directory" set: `server` (deploy from the `server/` subdirectory)

2) Build & Start commands
   - Build command: (leave blank) — server is plain Node and does not need a build step.
   - Start command: `node index.js`
   - Environment: Render will provide a `PORT` env var; the server uses `process.env.PORT || 4000`.

3) Persistence
   - The server currently uses `lowdb` and writes to `server/db.json`.
   - If you need persistent file storage, attach a disk on Render (or migrate to PostgreSQL/SQLite).

4) Automatic deploys & GitHub Actions
   - If you want Render to auto-deploy from `main`, enable auto-deploy in the Render service settings.
   - Alternatively, you can use the included GitHub Actions workflow `.github/workflows/deploy-server-render.yml`, which triggers a Render deploy via the Render API after running tests.

5) GitHub Secrets used by the workflow
   - `RENDER_API_KEY` — a Render API key (create at https://dashboard.render.com/account/api-keys)
   - `RENDER_SERVICE_ID` — the Render Service ID (available in the Render Service's Settings as "Service ID")

6) After deploy
   - Once the service is live, copy the service public URL (e.g., `https://your-service.onrender.com`).
   - In the Vercel project settings (or GitHub Actions secrets used for Vercel) set `API_BASE` to that URL so the front-end proxy functions (`/api/*`) forward to it.

7) Notes & troubleshooting
   - If you prefer a container-based deploy, use the `server/Dockerfile` added to this repo and set Render to deploy via Docker.
   - For production use, replace file-based `lowdb` with a managed DB (Postgres, Supabase) or an attached persistent store.

   8) Triggering a deploy locally (optional)

   If you'd rather trigger a Render deploy from your machine (instead of creating GitHub secrets immediately), you can use the helper scripts added to `./scripts`.

   PowerShell example:

   ```powershell
   $env:RENDER_API_KEY = '<your-render-api-key>'
   $env:RENDER_SERVICE_ID = '<your-service-id>'
   .\scripts\trigger-render-deploy.ps1
   ```

   Unix/macOS example:

   ```bash
   export RENDER_API_KEY='<your-render-api-key>'
   export RENDER_SERVICE_ID='<your-service-id>'
   ./scripts/trigger-render-deploy.sh
   ```

   Both scripts POST to the Render API to start a new deploy (they do not store your secrets).
