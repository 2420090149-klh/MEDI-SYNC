Deploying the MediSync mock API
===============================

This document contains quick steps and examples to deploy the mock API to Render or Heroku, plus notes about persistence.

1) Render (recommended for quick hosting)
----------------------------------------
- Create a new Web Service on Render and connect it to this repository.
- Use the `server/` folder as the root directory for the service (select "Deploy from a subdirectory" when configuring).
- Set the build and start commands:
  - Build Command: (none required) — the server is plain Node. Optionally run `npm ci`.
  - Start Command: `node index.js`
- Port: Render will set the `PORT` env var — the server listens on `process.env.PORT || 4000` by default.
- For persistent storage, Render provides disks or managed DBs; the current implementation uses a file `server/db.json` and will not survive restarts on ephemeral filesystems. For production persistence, use PostgreSQL or SQLite on a persistent filesystem.

2) Heroku
---------
- Create a Heroku app and push this repository. Add the root `server/Procfile` to ensure the dyno runs `node index.js`.
- Heroku provides `PORT` via env var — no change needed.

3) Docker
---------
- Build and run locally:

```powershell
docker build -t medisync-server:latest ./server
docker run -p 4000:4000 medisync-server:latest
```

4) Environment & Notes
----------------------
- If you deploy to a platform with an ephemeral filesystem, do not rely on `server/db.json` for long-term persistence. Use an attached volume, managed database, or replace the persistence with SQLite/Postgres.
- The repository also contains Vercel serverless proxy functions in `api/` that can forward requests to the running mock API via the `API_BASE` environment variable. See `api/README.md` for details.
