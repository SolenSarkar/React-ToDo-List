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
- [x] Diagnose Render backend build failure
  - Root cause: Render ran `npm install` at repo root (`/opt/render/project/src/`), where there is NO `package.json` (it lives in `server/`). The `rootDir: server` in `render.yaml` was not applied.

## In Progress — Fix Render backend deployment (root-level package.json)
- [x] Add root-level `package.json` so Render can build & start from repo root
- [x] Update `server/server.js` to load `.env` explicitly from its own directory
- [x] Commit & push fixes to `main` (commit `d40c7dc`)
- [ ] Re-deploy on Render and verify backend is live
- [ ] Verify GitHub Pages frontend calls hosted backend via `VITE_API_URL`

## Remaining (user actions)
- [ ] **USER ACTION:** Re-deploy the Render service (or trigger a new deploy from the dashboard/Blueprint)
- [ ] **USER ACTION:** Set secret env vars in the Render service: `MONGODB_URI` and `CLIENT_URL=https://Solensarkar.github.io/React-ToDo-List/`
- [ ] **USER ACTION:** Add GitHub secret `VITE_API_URL` = `https://<your-render-url>.onrender.com/api/todos`
- [ ] **USER ACTION:** Ensure GitHub Pages Source = **GitHub Actions**, then re-run the deploy workflow
- [ ] **USER ACTION:** Verify add/toggle/edit/delete on live site
