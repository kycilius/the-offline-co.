# Security Documentation

## Current Authentication

No user authentication is implemented in this repository.

Current behavior:

- Users complete a public questionnaire.
- The frontend stores flow state in browser `sessionStorage` and optional name in `localStorage`.
- The backend accepts unauthenticated requests for all implemented endpoints.
- Results are accessible by anyone who knows a `group_id`.

## Supabase Usage

The backend initializes a Supabase client with:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

The repository does not include Supabase Row Level Security policies. Database access is performed server-side by the FastAPI service.

## CORS

The FastAPI backend currently allows:

- All origins: `*`
- All methods
- All headers
- Credentials

This is convenient for demos and early development but should be restricted before production use.

## Data Collected

Implemented backend persistence stores:

| Data | Location | Notes |
| --- | --- | --- |
| Optional name | `users.name` | User-provided display name. |
| Questionnaire answers | `users.answers` | JSON array of answer values. |
| Age group | `users.age_group` | Broad age range. |
| Gender | `users.gender` | User-selected value. |
| Destination preference | `users.preferred_destination` | Normalized destination key. |
| Group membership | `groups.members` | JSONB array of user IDs. |

Frontend contact forms collect email and WhatsApp in UI state/session storage and best-effort post to `/api/waitlist`, but no backend route exists in this repository to persist that data.

## Known Limitations

- No authentication or authorization.
- No rate limiting.
- No CAPTCHA or abuse protection on public endpoints.
- Public result lookup by group ID.
- Wildcard CORS.
- No documented RLS policies.
- No encryption beyond platform/database defaults documented here.
- No payment security model because payment integration is not implemented.
- No audit logging or admin access model.
- `groups.members` is JSONB without foreign-key enforcement.

## Recommended Improvements

### Before Production

1. Restrict CORS to approved frontend domains.
2. Add rate limiting for `/api/submit`, `/api/match`, and `/api/result/{group_id}`.
3. Add bot protection for questionnaire/contact submission.
4. Define Supabase RLS policies and least-privilege keys.
5. Avoid exposing sensitive result data by guessable/shared IDs alone; consider signed result tokens.
6. Add structured logging without personally sensitive payload dumps.
7. Add privacy policy and data retention rules.
8. Validate answer ranges and expected answer count server-side.
9. Add a normalized membership schema with foreign keys.

### If Payment Is Added

1. Use a PCI-compliant payment provider checkout flow.
2. Do not store raw card data.
3. Verify payment webhooks server-side.
4. Add booking/payment tables with provider IDs and status transitions.
5. Document refund/cancellation workflows.

### If Waitlist Persistence Is Added

1. Add explicit consent language.
2. Store minimal contact data.
3. Add unsubscribe/delete pathways.
4. Protect endpoint from spam.
5. Document retention and access controls.

## Secret Management

Do not commit `.env` files or secrets. Configure environment variables in hosting providers:

- Vercel: `VITE_API_BASE` only.
- Render/backend host: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- Supabase: keep service role keys out of frontend and source control.

## Responsible Disclosure

No formal security disclosure process is present in the repository. Add a dedicated contact and policy before public launch.
