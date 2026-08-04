# Contributing Guide

Thank you for contributing to The Offline Co. This repository currently contains a React/Vite frontend and FastAPI/Supabase backend.

## Principles

- Preserve the premium, calm, offline-first product tone.
- Keep documentation aligned with implemented behavior.
- Do not describe unimplemented features as complete.
- Prefer small, reviewable changes.
- Keep frontend, backend, database, and deployment changes clearly separated where possible.

## Development Setup

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
SUPABASE_URL="https://your-project.supabase.co" \
SUPABASE_ANON_KEY="your-anon-key" \
uvicorn main:app --reload --host 0.0.0.0 --port 10000
```

## Coding Standards

### Frontend

- Use TypeScript and React function components.
- Keep route-level logic inside `src/routes/`.
- Reuse shared UI primitives from `src/components/ui/` where appropriate.
- Keep global styling and design tokens centralized in `src/styles.css`.
- Use the `@` alias for imports from `src` where consistent with existing files.
- Do not introduce new dependencies without a clear need and review.

### Backend

- Keep request/response shapes in `backend/models.py`.
- Keep endpoint business logic easy to trace in `backend/main.py` until the app grows enough to justify modules.
- Return clear `HTTPException` details for operational failures.
- Keep Supabase schema changes backward-compatible when possible.

### Documentation

- Update docs in the same change as behavior changes.
- Mark partial or planned features as partial/planned.
- Use Mermaid diagrams when they clarify architecture or flow.

## Git Workflow

Recommended branch names:

| Type | Pattern | Example |
| --- | --- | --- |
| Feature | `feature/<short-description>` | `feature/waitlist-api` |
| Fix | `fix/<short-description>` | `fix/result-empty-group` |
| Documentation | `docs/<short-description>` | `docs/api-reference` |
| Chore | `chore/<short-description>` | `chore/update-tooling` |

## Commit Messages

Use concise imperative messages:

- `docs: add API reference`
- `fix: handle empty result groups`
- `feature: add waitlist persistence`
- `chore: update deployment docs`

## Testing and Checks

Before opening a pull request, run relevant checks:

```bash
npm run build
npm run lint
```

For backend changes, also run at least a startup/import check and any endpoint tests you add. This repository does not currently include a backend test suite.

## Pull Requests

A good pull request should include:

- Clear summary of what changed.
- Why the change is needed.
- Screenshots for visible UI changes.
- Testing performed.
- Notes about migrations or environment variables.
- Any known limitations.

## Database Changes

- Update `backend/supabase_users_schema.sql` or add a migration approach before changing database-dependent code.
- Document schema changes in `DATABASE.md`.
- Consider existing Supabase projects and safe migrations.

## Security Review Checklist

For changes touching backend, data, auth, payments, or deployment:

- Are secrets kept out of the repository?
- Are CORS settings appropriate for the deployment environment?
- Are request bodies validated?
- Are Supabase permissions/RLS considered?
- Are errors useful without leaking secrets?
- Is user data minimized?

## Release Notes

No formal release process exists yet. Until one is added, summarize user-facing and operational changes in pull requests.
