# The Offline Co.

## Backend (FastAPI) - Deployment Ready

### How to run locally

```bash
cd backend
uvicorn main:app --reload
```

### How to deploy on Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) and create a **Web Service**.
3. Select this repo and set the root directory to `backend`.
4. Set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy and copy your Render public URL.

### Frontend connection (Vercel)

Your React frontend should call the backend using:

```js
const API_BASE = import.meta.env.VITE_API_BASE;
```

Then call:
- `POST ${API_BASE}/api/submit`
- `POST ${API_BASE}/api/match`
- `GET ${API_BASE}/api/result/{group_id}`

Set this environment variable in Vercel:

```bash
VITE_API_BASE=https://the-offline-co.onrender.com
```
