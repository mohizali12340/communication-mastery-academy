# Communication Mastery Academy

A 90-day communication skills learning platform: a dashboard, a full six-module
curriculum, day-by-day lessons (reading, examples, scripts, exercises,
reflection, quiz), streaks, XP/levels, achievements, and a profile with saved
reflection notes.

## Getting started

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```
├── index.html            entry HTML
├── src/
│   ├── main.jsx           mounts <App /> into the page
│   ├── App.jsx             the entire app: content data, views, styles
│   └── storage.js          persistence layer (see below)
├── package.json
└── vite.config.js
```

Everything \u2014 the 90-lesson content, all views (Dashboard, Curriculum,
Lesson, Achievements, Profile), and the design system \u2014 lives in
`src/App.jsx`. It's one file by design (it started as a single Claude
artifact); split it into smaller components/files as the project grows.

## Persistence

`src/storage.js` currently saves progress to the browser's `localStorage`,
so progress persists on the same browser/device but nowhere else. Swap that
file for a real API call (REST endpoint, Supabase, Firebase, your own
backend) to persist progress server-side per account \u2014 the rest of the app
only calls `storage.get(key)` / `storage.set(key, value)`, so nothing else
needs to change.

## What's built vs. what's a stand-in

**Built and working:**
- All 90 days of lesson content across 6 modules
- Dashboard, curriculum browser, lesson pages, quizzes, reflections
- Streak tracking, XP, levels, achievements, profile notes
- Persisted progress (localStorage), light/dark mode, responsive layout

**Represented in the UI but not wired to real infrastructure** \u2014 these
need a real backend, ML models, and hosting to become functional, which is
a separate build:
- The "AI Communication Coach" roleplay feature
- Real voice recording / pronunciation & pace scoring
- The auto-generated PDF certificate
- Admin panel, user accounts/auth, and a real database
- Deployment/CI configuration

If you want to build those out, this project is a clean starting point for
[Claude Code](https://claude.com/claude-code) to extend with a real backend.
