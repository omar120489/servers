# Traffic CRM Frontend (TypeScript + Berry + MUI)
## Quick start
```bash
cp .env.example .env
npm install
npm start
```
- Ensure your FastAPI backend is running at `http://localhost:8000` and exposes `/api/v1`.
- Default login in the sample form: `admin@trafficcrm.com / admin123` (if you seeded those).
## Scripts
- `npm start` – dev server with hot reload
- `npm build` – production build
## Notes
- Theme files in `src/theme` (Berry-inspired). Switch light/dark with the topbar icon.
- API client uses `REACT_APP_API_URL`. JWT is read from `localStorage.access_token`.
- Routes: Dashboard, Leads, Contacts, Companies, Deals, Activities, Reports, Settings.
- State: Redux Toolkit slices in `src/store`.
