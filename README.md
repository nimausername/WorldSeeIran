# WorldSeeIran

**WorldSeeIran** ([worldseeiran.org](https://worldseeiran.org)) is a public memorial website for people killed by the Islamic Republic of Iran during the latest nationwide uprising.

This repository is the rebuilt front end: a focused place of record and mourning — naming the fallen so they cannot be erased, and keeping the truth visible to the world.

> They had names. They had lives. They were taken.

## Why this project exists

In late December 2025, protests spread across Iran after economic collapse and years of repression. What began as rage over living conditions became a nationwide uprising for dignity and freedom.

On 8–9 January 2026, security forces answered with a massacre. Communication blackouts tried to hide the scale of the killing. Behind every figure is a person: a student, a worker, a parent, a child.

WorldSeeIran is not another feed of noise. It is a place to:

- **Remember the fallen** — names, faces, and fragments of life that families and journalists have been able to document
- **Refuse erasure** — so victims are not reduced to anonymous numbers or rewritten by the regime
- **Confront responsibility** — a public record of documented oppressors in the chain of command and the machinery of killing

An earlier version of this project grew too complex. This rebuild keeps the purpose clear again.

## What is in this repo today

| Area | Description |
|------|-------------|
| **Localized site shell** | Routes under `/en`, `/de`, and `/fa` (RTL for Persian), with Accept-Language redirects |
| **Home** | Brand-led memorial introduction and explanatory sections |
| **Javidnam field** | Full-viewport infinite canvas of Iran International / javidnaman portraits; click a face for name, age, place, and date when known |
| **Oppressors directory** | Searchable record of documented individuals (roles, responsibility, sources, portraits) |
| **Compact data** | Slim JSON indexes for thousands of portraits; person meta is loaded on demand |
| **Object storage ready** | Portrait images can be served from self-hosted Garage (S3-compatible) via `NEXT_PUBLIC_FALLEN_ASSET_BASE` |

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router) + React 19
- TypeScript
- Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/)
- Motion (`motion` / Framer Motion lineage) for intentional UI motion
- Optional: [Garage](https://garagehq.deuxfleurs.fr/) (or any HTTPS origin) for portrait binaries

## Getting started

### Requirements

- Node.js 20+ (LTS recommended)
- [pnpm](https://pnpm.io/)

### Install and run

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to a locale prefix (for example `/en`).

### Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm format` | Prettier on `ts` / `tsx` |

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
# Public origin for javidnam + oppressor portrait files (no trailing slash).
# Leave unset to load from this app's public/fallen/iranintl/ and public/oppressors/ folders.
NEXT_PUBLIC_FALLEN_ASSET_BASE=https://webgarage.worldseeiran.org
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FALLEN_ASSET_BASE` | No | HTTPS origin that serves `/iranintl/{id}.jpg` (or `.png`) and `/oppressors/{file}`. Javidnam canvas uses `crossOrigin="anonymous"`, so the origin **must** send CORS headers (`Access-Control-Allow-Origin`). |

Portrait object layout on the CDN / Garage website bucket:

```text
{NEXT_PUBLIC_FALLEN_ASSET_BASE}/iranintl/{id}.jpg
{NEXT_PUBLIC_FALLEN_ASSET_BASE}/iranintl/{id}.png
{NEXT_PUBLIC_FALLEN_ASSET_BASE}/oppressors/{slug}.{jpg|jpeg|webp}
```

Heavy image binaries are **not** committed to git (see `.gitignore`). For local development without Garage, place files under `public/fallen/iranintl/` and `public/oppressors/`, and leave the env var empty.

To sync local oppressor portraits to Garage once you have write keys:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
./scripts/sync-oppressors-garage.sh
```

## Project structure

```text
app/[lang]/          Locale-scoped pages (home, javidnam, oppressors)
components/
  fallen/            Memorial field + detail dialog
  oppressors/        Accountability directory + detail dialog
  home/              Home intro / content flow
  shell/             Navigation dock, language switcher
  ui/                Shared UI primitives (shadcn-style)
data/                Compact portrait indexes, meta JSON, oppressors.json
lib/
  fallen/            Portrait loaders, types, helpers
  oppressors/        Oppressor loaders, types, image URLs
  i18n/              Locales + dictionaries (en, de, fa)
public/fallen/       Manifest only in git; images local / Garage
public/oppressors/   Local portraits (gitignored binaries); Garage sync via scripts/
proxy.ts             Locale redirect middleware entry
```

## Languages

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English | LTR |
| `de` | Deutsch | LTR |
| `fa` | فارسی | RTL |

Copy lives in `lib/i18n/dictionaries.ts`.

## Data and sources

- Compact image index: `data/fallen-portrait-images.json`
- Deferred person meta: `data/fallen-portrait-meta.json`
- Oppressors directory: `data/oppressors.json` (migrated from the previous published records)
- Additional source / working data may live under `data/` (for example Iran International javidnaman exports)

Memorial records are incomplete by nature. Entries may contain gaps (unknown age, place, or date). Corrections and verified additions from families, journalists, and human-rights researchers are welcome when they improve accuracy and dignity.

**Do not commit** secrets, database dumps, or private backups. Paths such as `public/backup/` are ignored on purpose.

## Contributing

Contributions that help the memorial stay accurate, accessible, and maintainable are welcome.

Please:

- Prefer small, focused pull requests
- Keep the product purpose clear — memorial first, not feature sprawl
- Treat names and photographs with care; do not add unverified sensational material
- Never commit API keys, Garage secrets, `.env` files, or personal backups
- Run `pnpm lint` and `pnpm typecheck` before opening a PR

If you are contributing data (names, dates, portraits), describe the source and verification status in the PR.

## Security

If you discover a vulnerability in the deployed site or this repository’s configuration guidance, please report it privately to the maintainers rather than opening a public issue with exploit details.

Rotate any credentials that have ever been pasted into chat logs, tickets, or screenshots.

## License

### Software

The application source code in this repository is released under the [MIT License](./LICENSE).

Copyright © 2026 Nima Khabbazi and WorldSeeIran contributors.

### Memorial content

Names, biographical fragments, and portrait images are **memorial records**. They are published so the world can see and remember. That does **not** automatically mean they are free for unrelated commercial reuse.

- Prefer linking to WorldSeeIran when sharing
- Do not scrape or redistribute portraits in a way that harms families or strips context
- Upstream journalistic and human-rights sources retain their own rights and attribution expectations

If you need clarification for press, research, or archival use, contact the maintainers.

## Acknowledgments

Created and maintained by **Nima Khabbazi**.

This work exists because of the courage of people inside Iran, the persistence of families seeking truth, and journalists and monitors who document killings under repression — including Iran International’s javidnaman coverage used in the portrait field.

**We will not look away.**
