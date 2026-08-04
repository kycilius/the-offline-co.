# Project Structure

## Root

| Path | Purpose |
| --- | --- |
| `README.md` | Main product and developer documentation. |
| `ARCHITECTURE.md` | System, frontend, backend, database, matching, and deployment architecture. |
| `API.md` | Endpoint-level backend API documentation. |
| `DATABASE.md` | Supabase schema documentation. |
| `MATCHING_ALGORITHM.md` | Matching logic details. |
| `PROJECT_STRUCTURE.md` | This file. |
| `DEPLOYMENT.md` | Deployment guide for frontend, backend, and Supabase. |
| `CONTRIBUTING.md` | Contributor workflow and standards. |
| `SECURITY.md` | Current security posture and recommendations. |
| `package.json` | Frontend scripts, dependencies, and dev dependencies. |
| `package-lock.json`, `bun.lock`, `bun.lockb` | Package manager lockfiles present in the repository. |
| `vite.config.ts` | Vite build config, React plugin, Tailwind plugin, `@` alias, and `dist` output. |
| `tsconfig.json` | TypeScript configuration. |
| `eslint.config.js` | ESLint configuration. |
| `components.json` | UI component generator/config metadata. |
| `bunfig.toml` | Bun configuration. |
| `vercel.json` | SPA rewrite from all paths to `/index.html`. |
| `wrangler.jsonc` | Cloudflare Wrangler config currently referencing a TanStack Start-style server entry. |
| `index.html` | Vite HTML entry. |

## `src/`

Frontend application source.

| Path | Purpose |
| --- | --- |
| `src/index.tsx` | React application entry point. |
| `src/router.tsx` | Router setup. |
| `src/routeTree.gen.ts` | Generated TanStack Router route tree. |
| `src/config.ts` | Exports `API_BASE`, using `VITE_API_BASE` or default backend URL. |
| `src/styles.css` | Global styles, Tailwind setup, design tokens, custom utility classes, animations. |

## `src/routes/`

| File | Route | Purpose |
| --- | --- | --- |
| `__root.tsx` | Root | Global metadata, root outlet, and 404 component. |
| `index.tsx` | `/` | Landing page for the offline weekend product. |
| `questionnaire.tsx` | `/questionnaire` | Destination selection, optional profile fields, 14-question assessment, contact capture. |
| `loading.tsx` | `/loading` | Calls backend submit/match/result flow and shows progress animation. |
| `result.tsx` | `/result` | Reads `matchResult` from session storage and displays match result. |
| `plan.tsx` | `/plan` | Reservation-plan page with date selection, reveal countdown, destination details, packing, itinerary. |

## `src/components/`

| Path | Purpose |
| --- | --- |
| `Logo.tsx` | Shared brand logo component. |
| `ThemeToggle.tsx` | Shared theme toggle control. |

## `src/components/site/`

| File | Purpose |
| --- | --- |
| `Nav.tsx` | Landing navigation with desktop and mobile menu. |
| `Footer.tsx` | Landing footer and navigation links. |
| `Reveal.tsx` | Framer Motion reveal wrapper. |
| `Waitlist.tsx` | Waitlist/contact form that best-effort posts to `/api/waitlist`. |

## `src/components/ui/`

Reusable UI primitives such as accordion, alert, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, command, dialog, drawer, dropdown menu, form, hover card, input, label, menubar, navigation menu, pagination, popover, progress, radio group, resizable panels, scroll area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast-related primitives, toggle, toggle group, and tooltip.

These components support the app's visual system but are not all necessarily used by current routes.

## `src/assets/`

| Path | Purpose |
| --- | --- |
| `logo.png`, `logo.jpeg` | Brand imagery. |
| `landscapes/wild-silence.png` | Dooars/forest atmosphere image. |
| `landscapes/first-light.png` | Kandhamal/mountain atmosphere image. |
| `landscapes/salt-stillness.png` | Birbhum/coastline-labeled atmosphere image in current UI copy. |
| `landscapes/unhurried-wild.png` | Satkosia/river-wilderness atmosphere image. |

## `src/lib/`

| File | Purpose |
| --- | --- |
| `utils.ts` | Shared utility helpers, typically class-name merging. |

## `src/hooks/`

| File | Purpose |
| --- | --- |
| `use-mobile.tsx` | Mobile viewport helper hook. |

## `backend/`

| File | Purpose |
| --- | --- |
| `main.py` | FastAPI app, routes, Supabase access, matching algorithm, result builders. |
| `models.py` | Pydantic request/response models. |
| `requirements.txt` | Python package requirements. |
| `supabase_users_schema.sql` | Minimal Supabase schema and safe migration. |

## Generated/Build Output

No build output is intended to be committed. The frontend build output directory is `dist`.
