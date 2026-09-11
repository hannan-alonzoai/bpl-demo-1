# BPL Cortex OT Demo

React demo app for the BPL Medical Technologies OT monitoring workflow: **Login → OT Overview Board → Patient OT Flows**.

Built from the HTML prototypes (`bpl_ot_chart_1.html` and `ot_flows_updated.html`) as a modular React + TypeScript + Vite application.

## Routes

| Route | Description |
|-------|-------------|
| `/login` | Hero + credentials form (mock sign-in) |
| `/board` | OT room cards, vitals display modes, reference ranges |
| `/ot/:roomId` | Patient record: flowsheet, fluids, medications, scores, forms |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Sign in with any non-empty username and password.

## Build

```bash
npm run build
npm run preview
```

## Deploy

### Netlify

Connect the repo to Netlify. Build command: `npm run build`, publish directory: `dist`. The included `netlify.toml` handles SPA routing.

### GitHub Pages

Push to `main` — the GitHub Actions workflow builds and deploys to GitHub Pages automatically.

## Tech stack

- React 18+ / TypeScript / Vite
- React Router v6 (protected routes)
- Mock auth via `sessionStorage`
- Static mock data in `src/data/`

## Project structure

```
src/
├── components/board/   # Login + OT overview board
├── components/flows/   # Patient flows (record, score, form tabs)
├── data/               # Mock rooms, patients, vitals, forms
├── pages/              # Route-level pages
├── styles/             # board.css + flows.css (prototype themes)
└── utils/              # Auth, vitals classification, stage data
```
