# API Documentation

Base URL is configured in the frontend by `VITE_API_BASE`. If unset, the frontend uses `https://the-offline-co.onrender.com`.

## Implemented Endpoints

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/` | None | Health check. |
| `POST` | `/api/submit` | None | Saves questionnaire answers, creates a group, returns `group_id`. |
| `POST` | `/api/match` | None | Returns summaries of currently stored groups. |
| `GET` | `/api/result/{group_id}` | None | Returns detailed result for one group. |

## Not Implemented but Referenced by Frontend

| Method | Route | Frontend use | Current behavior |
| --- | --- | --- | --- |
| `POST` | `/api/waitlist` | Landing waitlist and questionnaire contact capture call it on a best-effort basis. | No backend route exists; frontend catches failures and continues/succeeds visually. |

## `GET /`

### Purpose

Basic backend health check.

### Response `200`

```json
{
  "status": "Backend is running"
}
```

## `POST /api/submit`

### Purpose

Stores a user questionnaire submission, builds a cohort around that user, stores the group, and returns the generated group ID.

### Validation

Validated by `SubmitRequest`:

| Field | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `answers` | array of integers | Yes | None | Minimum length is 1. Values are assumed to be questionnaire scale values; no min/max value constraint is declared in the model. |
| `age_group` | string | No | `unknown` | Used for match score bonus and diversity bonus. |
| `gender` | string | No | `unknown` | Used for match score bonus and diversity bonus. |
| `name` | string or null | No | `null` | Used for result display if present. |
| `preferred_destination` | string | No | `open` | Normalized to known destination keys. |
| `landscape` | string or null | No | `null` | Backwards-compatible alias. Used only when `preferred_destination` is unavailable. |

### Request JSON

```json
{
  "name": "Asha",
  "answers": [4, 2, 5, 3, 4, 2, 5, 2, 4, 5, 2, 3, 4, 5],
  "age_group": "23–27",
  "gender": "Female",
  "preferred_destination": "dooars"
}
```

### Success Response `200`

```json
{
  "group_id": "8d20f8fc-f3cc-4c47-bb0f-8f2f2ad215ec"
}
```

### Error Responses

| Status | Detail | Cause |
| --- | --- | --- |
| `422` | FastAPI validation error | Missing or invalid request body according to Pydantic. |
| `500` | `Failed to save answers` | Supabase user insert fails or insert response has no ID. |
| `500` | `Failed to fetch users` | User fetch fails, including legacy-column fallback failure. |
| `500` | `Failed to create group` | Supabase group insert fails or insert response has no ID. |

### Business Logic

1. Normalize `preferred_destination` or fallback `landscape`.
2. Insert a `users` row.
3. If insert with `preferred_destination` fails, retry with a legacy payload that omits that column.
4. Fetch all valid users.
5. Ensure the newly inserted user is included in the in-memory user list.
6. Select group members using destination-first ranking and compatibility scoring.
7. Choose a group destination and group name.
8. Insert a `groups` row with `group_name` and member user IDs.
9. Return the group ID.

## `POST /api/match`

### Purpose

Returns match summaries for existing groups. In the current implementation, this endpoint does not create new group records; groups are created by `/api/submit`.

### Request Body

No body is required.

### Success Response `200`

If fewer than two users exist:

```json
{
  "message": "Need at least 2 users before matching can run.",
  "groups_created": 0,
  "users_processed": 1,
  "groups": []
}
```

If users and groups exist:

```json
{
  "message": "Matching complete",
  "groups_created": 0,
  "users_processed": 12,
  "groups": [
    {
      "group_members": ["Asha", "Quiet Listener"],
      "match_score": 82,
      "group_members_count": 2,
      "group_name": "Forest Silence Cohort",
      "vibe_description": "Fresh, spacious, quietly adventurous, and held by the rhythm of the wild north.",
      "preferred_destination": "dooars",
      "destination_name": "Jalpaiguri, North Bengal",
      "destination_place": "The Dooars, near Gorumara",
      "emotional_theme": "Forest calm and open-hearted discovery",
      "cohort_atmosphere": "Fresh, spacious, quietly adventurous, and held by the rhythm of the wild north."
    }
  ]
}
```

### Error Responses

| Status | Detail | Cause |
| --- | --- | --- |
| `500` | `Failed to fetch users` | Supabase users query fails. |
| `500` | `Failed to fetch groups` | Supabase groups query fails. |

## `GET /api/result/{group_id}`

### Purpose

Fetches one group and returns a personalized result based on the first member of the group's member ID list.

### Path Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `group_id` | string | Yes | Expected to be a Supabase UUID, but FastAPI accepts it as a string. |

### Success Response `200`

```json
{
  "group_name": "Forest Silence Cohort",
  "score": 82,
  "match_score": 82,
  "match_label": "unusually strong alignment",
  "group_label": "2 people like you",
  "group_members_count": 2,
  "vibe_description": "Fresh, spacious, quietly adventurous, and held by the rhythm of the wild north.",
  "personality": "You naturally balance reflection with openness in social settings. You enjoy shared activities with structure and room for genuine conversation. You help groups stay connected, practical, and welcoming.",
  "group_members": ["Asha", "Quiet Listener"],
  "activity_plan": {
    "icebreaker": "Share one insight you've had about your social energy lately.",
    "activity": "Journal for five minutes, then discuss what surprised you.",
    "closing": "Choose one intentional boundary you'll carry into next week."
  },
  "match_reasons": [
    "You balance depth with lighthearted conversation",
    "You adapt well to different social comfort levels",
    "You initiate conversations with warmth"
  ],
  "group_size": 2,
  "user_display_name": "Asha",
  "preferred_destination": "dooars",
  "destination_name": "Jalpaiguri, North Bengal",
  "destination_place": "The Dooars, near Gorumara",
  "destination_image": "Tea-green edges, forest roads, river mist, and the hush around Gorumara.",
  "emotional_theme": "Forest calm and open-hearted discovery",
  "cohort_atmosphere": "Fresh, spacious, quietly adventurous, and held by the rhythm of the wild north."
}
```

### Error Responses

| Status | Detail | Cause |
| --- | --- | --- |
| `404` | `Group not found` | No group row matches the ID. |
| `404` | `Group has no matching users` | Group exists but its member IDs do not map to fetched users. |
| `500` | `Failed to fetch group` | Supabase group query fails. |
| `500` | `Failed to fetch users` | Supabase users query fails. |

## CORS

The backend currently allows all origins, methods, headers, and credentials. This is permissive for MVP/demo usage and should be restricted for production.
