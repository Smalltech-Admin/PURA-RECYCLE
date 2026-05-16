# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm install        # First-time setup; node_modules is not checked in
npm run dev        # Start Next dev server on http://localhost:3000
npm run build      # Static export → ./out (this is what GitHub Pages serves)
npm run lint       # ESLint flat config (eslint.config.mjs)
npm start          # Serve the production build locally

node scripts/scrape-tatene.mjs   # Manually refresh public/data/tatene.json
```

There is no test runner configured. `playwright` is in devDependencies but no specs exist.

## Architecture

**Static export, dual-target deployment.** `next.config.ts` sets `output: 'export'`, so there is no Node runtime in production — everything is pre-rendered to `./out` and served as static files. The same build is used for two hosts:

- **Production:** custom domain `pura-recycle.com` (see `public/CNAME`). `basePath` is empty.
- **GitHub Pages preview:** when `GITHUB_ACTIONS=true`, `basePath` becomes `/PURA-RECYCLE` and `assetPrefix` is set accordingly. The build value is exposed to the client as `NEXT_PUBLIC_BASE_PATH`.

Because of this, **every asset URL must go through `withBasePath()` from `lib/basePath.ts`** — both raw `<img src>` and `fetch()` paths to `/data/...`. The `AppImage` component in `components/AppImage.tsx` is the prefixed wrapper around `next/image` and should be preferred over `next/image` directly. New pages that fetch JSON from `/public/data` must read `process.env.NEXT_PUBLIC_BASE_PATH` themselves (see `lib/getTatene.ts` for the pattern).

**Data flow.** Three external sources, all read at runtime in the browser (no SSR):

1. **Live prices** — Google Sheets published as CSV. `lib/getPrices.ts` (main price list) and `lib/getNews.ts` (news ticker) fetch from `docs.google.com/.../export?format=csv`. Editors update the sheet; the site reflects changes on next page load. `getPrices.ts` includes a hand-rolled CSV parser that handles quoted fields — don't replace it with `split(',')`.
2. **Metal benchmarks (建値)** — `public/data/tatene.json`, regenerated daily by `scripts/scrape-tatene.mjs` via the `scrape-tatene.yml` GitHub Action (cron `0 0 * * *` UTC = 09:00 JST). The script scrapes JX金属 (copper), 三菱マテリアル (lead), 三井金属 (zinc) by regex against their HTML/JS, compares against the previous JSON to compute the `direction` arrow (⇧/⇩/→), and commits the file back to `main`. `lib/getTatene.ts` has `FALLBACK_DATA` for when the fetch fails — keep it updated when the scraper schema changes.
3. **Static product catalog** — `lib/products.ts` is the master list of 41 items. The `sidebar: true` flag controls which 20 appear in `NonmetalSidebar`; all 41 render on `/nonmetal`. Product `id` values are URL hash anchors (`/nonmetal#pika`) and are referenced by `app/sitemap.ts`.

**Client-side rendering pattern.** Because of static export, pages that depend on live data are marked `'use client'` and fetch in `useEffect` with a `loading` flag (see `app/page.tsx`, `app/nonmetal/page.tsx`). Don't try to use server components or `fetch` in module scope for these — it won't work at build time without the spreadsheet being reachable, and stale data would be baked in.

**Disabled routes.** Files ending in `.tsx.disabled` (e.g., `app/motercar/page.tsx.disabled`, most of `app/nonmetal/*/page.tsx.disabled`) are intentionally excluded from the build. `app/sitemap.ts` still lists their URLs — that's deliberate, the routes are planned. To enable, rename to `.tsx`; to delete permanently, also remove from the sitemap.

**SEO.** `app/layout.tsx` defines the `Metadata` template, `components/JsonLd.tsx` emits `RecyclingCenter` and `BreadcrumbList` JSON-LD, `app/sitemap.ts` and `app/robots.ts` use Next's metadata API with `dynamic = 'force-static'`. `metadataBase` reads `NEXT_PUBLIC_SITE_URL` and falls back to the production domain. All user-facing copy is Japanese — preserve it; don't translate to English in components.

**Styling.** Tailwind CSS v4 via `@tailwindcss/postcss`. There is no `tailwind.config.*` — theme tokens (including `brand`/`brand-dark` colors `#86E24B`/`#6BC438`) are declared inline in `app/globals.css` under `@theme inline`. Add new design tokens there, not in a config file. The `.holographic-bg` shine animation is also defined here.

**TypeScript.** Strict mode, path alias `@/*` → repo root.

## Conventions

- The git history shows daily auto-commits from the scraper action authored as "Takumi Higashiyama". Avoid touching `public/data/tatene.json` by hand — let the action update it, or run the script.
- ESLint includes `@next/next/no-img-element`. Raw `<img>` is intentionally used (with an eslint-disable line comment) only when a `withBasePath`-wrapped src is needed and `AppImage` doesn't fit; prefer `AppImage` first.
- `notes_update.csv` at the repo root is reference content for spreadsheet edits, not consumed by the app.
