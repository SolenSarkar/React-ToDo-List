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
- [ ] **USER ACTION:** Deploy backend to Render (Web Service → `server/`, `npm start`, env vars `PORT`, `MONGODB_URI`, `CLIENT_URL`)
- [ ] **USER ACTION:** Add GitHub secret `VITE_API_URL` = `https://<your-render-url>.onrender.com/api/todos`
- [ ] **USER ACTION:** Re-run deploy workflow & verify add/toggle/edit/delete on live site
