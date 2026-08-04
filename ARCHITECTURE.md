# Architecture

## System Overview

The Offline Co. is an MVP full-stack application with a React/Vite single-page frontend and a FastAPI backend. Supabase Postgres stores questionnaire submissions and generated groups. The application does not currently include authentication, server-side sessions, payment processing, or AI model inference.

```mermaid
flowchart TB
  subgraph Client[Browser]
    SPA[React SPA]
    Local[localStorage: optional name]
    Session[sessionStorage: answers, selected landscape, group result]
  end

  subgraph Backend[FastAPI service]
    API[REST endpoints]
    Models[Pydantic models]
    Matching[Matching and result builders]
  end

  subgraph Data[Supabase]
    Users[(users)]
    Groups[(groups)]
  end

  SPA <--> Local
  SPA <--> Session
  SPA --> API
  API --> Models
  API --> Matching
  API --> Users
  API --> Groups
```

## Frontend Architecture

The frontend is a Vite React app using TanStack Router file routes.

| Area | Files | Responsibility |
| --- | --- | --- |
| App entry | `src/index.tsx`, `src/router.tsx`, `src/routeTree.gen.ts` | Mounts React and configures generated TanStack Router routes. |
| Routes | `src/routes/*.tsx` | Page-level user flows: landing, questionnaire, loading, result, plan, root metadata/404. |
| Site components | `src/components/site/` | Landing navigation, reveal animations, footer, waitlist form. |
| UI primitives | `src/components/ui/` | Reusable UI controls and layout primitives. |
| Shared config | `src/config.ts` | Frontend API base URL. |
| Assets | `src/assets/` | Logo and destination imagery. |
| Styling | `src/styles.css` | Tailwind v4, theme tokens, custom classes, animations. |

### Client State

The MVP uses browser storage rather than authenticated user sessions.

| Storage | Keys | Purpose |
| --- | --- | --- |
| `localStorage` | `user_name` | Optional display name entered in the questionnaire. |
| `sessionStorage` | `selectedAtmosphere`, `selectedLandscape`, `selectedAge`, `selectedGender`, `answers`, `contactEmail`, `contactWhatsapp`, `groupId`, `matchResult` | Carries questionnaire, contact, group, and result data across frontend routes. |

## Backend Architecture

The backend is a single FastAPI app in `backend/main.py`.

```mermaid
flowchart LR
  Request[HTTP request] --> FastAPI[FastAPI route]
  FastAPI --> Pydantic[Pydantic validation/response model]
  FastAPI --> Supabase[Supabase client]
  FastAPI --> Logic[Matching/result helper functions]
  Logic --> Response[JSON response]
```

| Module | Responsibility |
| --- | --- |
| `backend/main.py` | API routes, Supabase client initialization, matching functions, group/result builders. |
| `backend/models.py` | Pydantic request and response models. |
| `backend/supabase_users_schema.sql` | Minimal database schema and safe migration. |
| `backend/requirements.txt` | Python runtime dependencies. |

## Database Architecture

The database is intentionally minimal.

```mermaid
erDiagram
  USERS ||--o{ GROUPS : "referenced by members JSONB array"

  USERS {
    uuid id PK
    text name
    jsonb answers
    text age_group
    text gender
    text preferred_destination
    timestamptz created_at
  }

  GROUPS {
    uuid id PK
    text group_name
    jsonb members
    timestamptz created_at
  }
```

Important limitation: `groups.members` is a JSONB array of user IDs, not a normalized join table or declared foreign key.

## Request Flow

```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend
  participant B as FastAPI
  participant S as Supabase

  U->>F: Complete questionnaire
  F->>F: Save answers and preferences in sessionStorage
  F->>B: POST /api/submit
  B->>S: Insert users row
  B->>S: Fetch users
  B->>B: Select cohort members
  B->>S: Insert groups row
  B-->>F: group_id
  F->>B: POST /api/match
  B->>S: Fetch users and groups
  B-->>F: Current group summaries
  F->>B: GET /api/result/{group_id}
  B->>S: Fetch group and users
  B->>B: Build result payload
  B-->>F: Match result
  F->>F: Save matchResult in sessionStorage
  F->>U: Navigate to result page
```

## Matching Flow

```mermaid
flowchart TD
  A[Receive SubmitRequest] --> B[Normalize preferred_destination or landscape]
  B --> C[Insert user]
  C --> D[Fetch users]
  D --> E{Current user destination open?}
  E -- Yes --> F[Choose strongest non-open destination by adjusted score]
  E -- No --> G[Use current destination]
  F --> H[Rank same-destination candidates]
  G --> H
  H --> I[Add best candidates until target size or exhausted]
  I --> J{Anchor destination non-open?}
  J -- Yes --> K[Rank and add open-destination candidates]
  J -- No --> L[Keep open/smaller cohort]
  K --> M[Create group]
  L --> M
  M --> N[Return group_id]
```

## Deployment Architecture

```mermaid
flowchart LR
  Dev[Developer] --> Git[Git repository]
  Git --> Vercel[Vercel frontend build]
  Git --> Render[Render backend service]
  Vercel --> Browser[User browser]
  Browser --> Render
  Render --> Supabase[(Supabase)]
```

Recommended production split:

- Frontend: Vercel static build (`dist`) with SPA rewrites.
- Backend: Render Python web service running Uvicorn.
- Database: Supabase Postgres initialized with the schema SQL.

## Current Architectural Limitations

- No authentication or authorization layer.
- Backend uses Supabase anon key and wildcard CORS.
- No payment provider integration despite reservation copy.
- No implemented backend waitlist endpoint despite frontend best-effort calls.
- No normalized membership table.
- No database indexes beyond primary keys.
- `/api/match` summarizes existing groups rather than creating new matches.
- Matching is deterministic and heuristic, not machine-learning or AI based.
