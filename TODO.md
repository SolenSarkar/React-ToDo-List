# MERN To-Do List App — Build & Deploy Progress

## Done
- [x] Plan approved & MongoDB Atlas connection provided
- [x] Create backend (server/) files
- [x] Create frontend (client/) files
- [x] Create README.md
- [x] Install dependencies (server & client)
- [x] Verify app runs locally (backend + frontend)  
- [x] Add pagination (client + server)
- [x] GitHub Pages deployment (client/dist)
- [x] Diagnose "Unexpected token '<'" error on live site
  - Root cause: live site fell back to `/api/todos` on GitHub Pages (static), which returns HTML, not JSON.

## In Progress — Wire up hosted backend (Render) so the live site works end-to-end
- [x] Update `server/.env` with `CLIENT_URL` (frontend origin)
- [x] Update `server/server.js` to whitelist frontend origins in CORS
  - [x] Verified: GitHub Pages origin (`https://solensarkar.github.io`) allowed ✅
  - [x] Verified: disallowed origin rejected ✅
- [x] `.github/workflows/deploy.yml` already injects `VITE_API_URL` from GitHub secret (verified)
- [x] Update README.md with Render deployment steps
- [x] Commit & push CORS fix to `main` (commit `33d2df4`)
- [x] Verify live site still returns HTTP 200 (`https://solensarkar.github.io/React-ToDo-List/`)

## ⚠️ Note — GitHub Pages infra issue (transient, not code)
- The latest deploy workflow runs (build job ✅) timed out / were cancelled at the GitHub Pages **deployment_queued** step.
- This is a GitHub Pages infrastructure backlog, not a problem with the code. The previous 4 deployments all succeeded, and the build artifact is valid.
- Re-trigger the workflow later via Actions → **Deploy to GitHub Pages** → **Run workflow** once GitHub's Pages queue clears.

## Render deployment — fixes to get the backend deployed
- [x] Add root `render.yaml` Blueprint so Render auto-provisions the backend from the `server/` subfolder
  - `rootDir: server`, build `npm install`, start `npm start`, health check `/`
  - Secret env vars (`MONGODB_URI`, `CLIENT_URL`) declared with `sync: false` (set in dashboard)
- [x] Add `engines.node >=18.0.0` to `server/package.json` so Render picks a compatible Node runtime
- [x] Update README with **Option A (Blueprint)** + **Option B (manual Web Service)** steps

## Remaining (user actions)
- [ ] **USER ACTION:** On Render choose **New → Blueprint** → connect this repo (Render reads `render.yaml` and creates the service)
- [ ] **USER ACTION:** Set secret env vars in the service: `MONGODB_URI` and `CLIENT_URL=https://Solensarkar.github.io/React-ToDo-List/`
- [ ] **USER ACTION:** Add GitHub secret `VITE_API_URL` = `https://<your-render-url>.onrender.com/api/todos`
- [ ] **USER ACTION:** Re-run deploy workflow & verify add/toggle/edit/delete on live site
