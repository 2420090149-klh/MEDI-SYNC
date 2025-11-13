# MediSync — Doctor Availability Based Hospital Appointment Scheduling System

A professional, responsive landing page for "MediSync" — a hospital appointment scheduling system that connects patients and providers in real-time.

Files:
- `index.html` — Main landing page HTML
- `styles.css` — Responsive styles and layout
- `script.js` — Lightweight interactivity (mobile nav, mock search, toast)
- Design:
- Color palette uses healthcare-oriented blues and teal accents.
- Mobile-first responsive behavior, accessible markup, and semantic sections.

How to preview locally:
1. Open `index.html` in your browser (double-click or open from your editor).
2. For a local static server (recommended):

   In PowerShell run:

   python -m http.server 8000; Start-Process http://localhost:8000

Notes & next steps:
- This is a static landing page. For production, wire the front-end to a React/Angular app and a secure backend with authentication and appointment APIs.
- Consider adding unit/UI tests, and a design system for components.

React app (scaffolded):

If you'd like to run the React/Vite version that was scaffolded, run the following from the project root:

```powershell
npm install
npm run dev
```

This starts the Vite dev server (default port 5173). The React source lives under `src/` and the styles are in `src/styles.css`.

Mock backend:

Start the mock Express server (API proxy is configured in `vite.config.js`):

```powershell
cd server
npm install
npm start
```

With both the Vite dev server and mock server running, the front-end will proxy `/api/*` requests to `http://localhost:4000`.

Quick start (one command)
-------------------------
A convenience PowerShell script `start-dev.ps1` was added to start both the front-end and mock backend and open the browser. It runs `npm install` in both root and `server/` before starting when invoked via the `start:dev` npm script.

Run from the project root (PowerShell):

```powershell
npm run start:dev
```

Or run the script directly:

```powershell
.\start-dev.ps1 -Install
```

Authentication & Google Sign-In
--------------------------------
This project includes a mock authentication flow (client-side) to demonstrate login, signup, and protected actions (booking). For development the login accepts any email/password and the Google sign-in button performs a mocked sign-in.

To integrate real Google Sign-In:

1. Create OAuth 2.0 credentials in Google Cloud Console. Get a Client ID.
2. Add your dev redirect URI (e.g., `http://localhost:5173`) and production URLs as authorized origins.
3. In the front-end, include the Google Identity Services script and implement server-side token verification. A simple flow:
   - Use Google Identity to obtain an ID token in the browser.
   - Send the ID token to your backend for verification using Google's libraries.
   - Create/return a session token or JWT from your backend and use it for authenticated API calls.

I kept the mock flow intentionally simple. If you want, I can implement a full Google Sign-In integration (requires your Client ID and backend verification). 

Demo account & pre-seeded bookings
----------------------------------
To let reviewers try the app immediately, a demo account is available via the Login page: click "Use demo account" on `/login` to sign in as `demo@medisync.example`.

The mock API includes a pre-seeded booking in `server/bookings.json` so one slot is already booked (so you can confirm booking persistence and removal from availability). The file is loaded at server startup.

Academic note:
> This project was submitted in partial fulfillment of the requirements for the degree of Bachelor of Technology in Computer Science and Engineering.

Deploying the front-end to Vercel (quick)
---------------------------------------
You can deploy the built front-end (static site) to Vercel in a few steps:

1. Push this repository to GitHub.
2. Sign in to Vercel and import the GitHub repo.
3. Set the framework preset to "Other" or let Vercel detect the project. Use the following build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy. Vercel will provide a public URL for the site.

Notes:
- The mock API (server/) is not deployed by this step — the deployment is for the static front-end only. For a full end-to-end demo you'll need to deploy the server separately (to Heroku, Render, or a serverless functions platform) and update `vite.config.js` proxy or API base URL.
- You can also use the Vercel CLI: `vercel` (install `npm i -g vercel`) and follow the prompts.

Automatic deploy from GitHub via Actions
---------------------------------------
I added a GitHub Actions workflow that builds the front-end and deploys to Vercel on push to `main`.

To use it you must add three repository secrets in GitHub (Repository Settings → Secrets → Actions):

- `VERCEL_TOKEN` — a token from your Vercel account (create from https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` — your Vercel organization id (available in Vercel project settings or via CLI)
- `VERCEL_PROJECT_ID` — the Vercel project id (available in the project settings)

Once the secrets are configured, pushing to `main` will trigger the `deploy-vercel.yml` workflow and publish the site. The workflow will also post the deployment URL as a GitHub PR comment.

If you'd like, I can add an optional step to the workflow to also deploy or notify when the mock API is deployed to a hosting provider.
