# Catalyst6 Demon

Deployable Next.js prototype for the Catalyst6 Demon concept with a memory API and viewer.

## What is included

- Interactive double-helix to quadruple-helix UI
- Persistent `/api/memory` route for saved DNA records
- `/memory` archive page for browsing collected records
- Google-first media ingestion concept for images, videos, MP4s, and MP3s from Google search intelligence and Google-surfaced public media
- Vercel-ready Next.js deployment configuration

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start development:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## GitHub setup

```bash
git init
git add .
git commit -m "Initial Catalyst6 Demon prototype"
```

Create a new GitHub repository, then connect it:

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Vercel setup

This project deploys as a Next.js application on Vercel.

After the GitHub repo exists, import it into Vercel and deploy with default settings.

## VPS-backed memory

To make Vercel use your VPS as the persistent memory backend, set these environment variables in Vercel:

```bash
VPS_MEMORY_API_URL=https://your-vps-domain-or-ip
VPS_MEMORY_API_KEY=your-secret-key
```

Expected VPS endpoints:

- `GET /memory`
- `POST /memory`

The VPS Python server can read its API key either from the environment variable `CATALYST6_API_KEY`
or from `VPS__Catalyst6/api_key.secret`.

## Notes

If `VPS_MEMORY_API_URL` is not set, local development falls back to `work/memory-store.json`. Vercel file writes are not durable, so production persistence should use your VPS API or a database.
