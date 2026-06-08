# Catalyst6 Demon

Deployable static prototype for the Catalyst6 Demon concept.

## What is included

- Interactive double-helix to quadruple-helix UI
- Continuous DNA generation simulation
- Browser-local autosave and restore for generated DNA records
- Google-first media ingestion concept for images, videos, MP4s, and MP3s from Google search intelligence and Google-surfaced public media
- Vercel-ready static deployment configuration

## Local development

```bash
npm run dev
```

Then open the local server URL in a browser.

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

This project deploys as a static site with `index.html` at the repository root.

After the GitHub repo exists, import it into Vercel and deploy with default settings.

## Notes

The current autosave mechanism uses browser `localStorage`. If you want persistent cross-device memory next, the next step is adding a real backend or database.
