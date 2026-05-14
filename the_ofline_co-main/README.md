# The Ofline Co.

**The Ofline Co. — Curated 48-hour offline experiences for people who want to log out and show up.**

The Ofline Co. is an application-first marketplace and operations platform for intimate offline retreats across Bengal and Odisha. It combines an editorial landing page, a guided application flow, admin tooling, cohort countdowns, experience publishing, testimonials, and Razorpay-powered reservations into one production-ready web application.

## Overview

Modern life is always connected, but rarely grounded. The Ofline Co. exists for digitally overwhelmed people who want a deliberate break from feeds, notifications, and performance — without joining a generic wellness retreat.

The product curates small 12-person cohorts for phone-free weekend experiences in rooted, offbeat locations. Visitors discover upcoming experiences, apply with an anonymous alias, and reserve seats after selection. Operators manage applications, experiences, testimonials, and the next reveal countdown from an authenticated admin dashboard.

At its core, the platform is built around a simple promise: **make disconnection feel intentional, beautiful, and operationally reliable.**

## Features

- **Editorial landing page** — cinematic hero, product narrative, experience highlights, testimonials, and conversion paths.
- **Application flow** — multi-step application form with alias, contact details, digital overload score, preferred window, and personal motivation.
- **Experience pages** — detail pages for each retreat with region hints, chapters, duration, cohort size, pricing, and reservation CTAs.
- **Admin dashboard** — authenticated back office for reviewing applications, managing experiences, updating countdown details, and moderating testimonials.
- **Experience management** — create, publish, update, and delete curated offline experiences with slug-based public pages.
- **Countdown system** — configurable next-reveal timer with location label and seats remaining.
- **Razorpay payments** — server-side order creation and HMAC signature verification for booking confirmation.
- **Authentication** — JWT-based admin login, token persistence, protected API routes, and `/auth/me` session refresh.
- **Testimonials** — public testimonial feed with admin-created entries.
- **Health checks and tests** — API health endpoint, backend regression tests, and frontend health-check plugin support.

## Tech Stack

### Frontend

- **React 19** — single-page application built with Create React App and CRACO.
- **React Router** — public, experience, application, and admin routes.
- **Tailwind CSS** — utility-first styling with a custom editorial visual system.
- **Framer Motion** — reveal animations, scroll motion, and application step transitions.
- **Axios** — shared API client with JWT bearer-token injection.
- **Radix UI + shadcn-style components** — accessible UI primitives for dashboard and form interactions.
- **Sonner** — toast notifications.
- **Lucide React** — icon system.

### Backend

- **FastAPI** — async Python API under the `/api` prefix.
- **MongoDB** — primary persistence layer via Motor async client.
- **Pydantic** — request validation and response models.
- **JWT auth** — admin access tokens signed with HS256.
- **bcrypt** — admin password hashing and verification.
- **Razorpay SDK** — payment order creation.
- **pytest** — backend API regression tests.

### Infrastructure

- **Vercel** — recommended frontend hosting for the React app.
- **Render** — recommended backend hosting for the FastAPI service.
- **MongoDB Atlas** — recommended managed MongoDB database.

### Payments

- **Razorpay** — INR payment orders, signature verification, and booking status updates.

## Architecture

```text
React Frontend  →  FastAPI Backend API  →  MongoDB
      │                    │                  │
      │                    ├── users
      │                    ├── applications
      │                    ├── experiences
      │                    ├── testimonials
      │                    ├── config
      │                    └── bookings
      │
      └── Razorpay Checkout / reservation UI
                           │
                           └── Razorpay Orders + Signature Verification
```

The frontend reads `REACT_APP_BACKEND_URL`, appends `/api`, and sends all client requests through a shared Axios instance. Public routes fetch experiences, testimonials, and countdown configuration without authentication. Admin routes require a JWT bearer token stored in local storage after successful login.

The backend exposes a FastAPI application with CORS enabled and all API routes mounted under `/api`. On startup, it creates MongoDB indexes, seeds the admin user, initializes countdown configuration, and inserts sample experiences/testimonials when missing.

### Auth Flow

1. Admin submits email and password from `/admin/login`.
2. Backend verifies the bcrypt password hash from the `users` collection.
3. Backend returns a signed JWT access token and safe admin profile.
4. Frontend stores the token in `localStorage` as `ofline_token`.
5. Axios attaches `Authorization: Bearer <token>` to future API requests.
6. Protected admin endpoints decode the token and verify the user has the `admin` role.

### Payment Flow

1. A visitor opens an experience page and starts a reservation.
2. Frontend calls `POST /api/payments/razorpay/order` with the experience ID, alias, and email.
3. Backend looks up the experience, calculates the amount in paise, creates a Razorpay order, and stores a pending booking.
4. After payment completion, the client sends Razorpay identifiers and signature to `POST /api/payments/razorpay/verify`.
5. Backend validates the HMAC signature using `RAZORPAY_KEY_SECRET`.
6. Booking status changes from `pending` to `paid` or `failed`.

## Folder Structure

```text
.
├── backend/
│   ├── server.py              # FastAPI app, models, routes, auth, seeds, payments
│   ├── requirements.txt       # Python dependencies
│   └── tests/                 # Backend API regression tests
├── frontend/
│   ├── public/                # CRA public assets and HTML shell
│   ├── src/
│   │   ├── components/        # Site chrome and reusable UI components
│   │   ├── hooks/             # Shared React hooks
│   │   ├── lib/               # API client, auth context, utilities
│   │   └── pages/             # Landing, Apply, Experience, Admin Login, Dashboard
│   ├── plugins/               # Health-check build/runtime plugins
│   ├── package.json           # Frontend scripts and dependencies
│   └── tailwind.config.js     # Tailwind theme configuration
├── memory/
│   └── PRD.md                 # Product requirements and planning notes
├── tests/                     # Shared test package placeholder
├── test_reports/              # Generated test reports
├── design_guidelines.json     # Visual/product design constraints
└── README.md                  # Project documentation
```

## Environment Variables

### Backend

| Variable | Purpose |
|----------|---------|
| `MONGO_URL` | MongoDB connection string used by the FastAPI service. |
| `DB_NAME` | MongoDB database name. |
| `JWT_SECRET` | Secret used to sign and verify admin JWT access tokens. Use a strong production value. |
| `ADMIN_EMAIL` | Seeded admin account email. Defaults to `admin@theofflineco.com` if omitted. |
| `ADMIN_PASSWORD` | Seeded admin account password. Defaults to `Offline@2025` if omitted; override in every real environment. |
| `RAZORPAY_KEY_ID` | Razorpay public key ID returned to the frontend when creating an order. |
| `RAZORPAY_KEY_SECRET` | Razorpay secret used to create orders and verify payment signatures. |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins. Defaults to `*`. |

### Frontend

| Variable | Purpose |
|----------|---------|
| `REACT_APP_BACKEND_URL` | Base URL for the backend service. The frontend appends `/api` automatically. |

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm or Yarn
- Python 3.10+
- MongoDB running locally or a MongoDB Atlas cluster
- Razorpay test keys if you want to exercise payment order creation

### 1. Clone the repository

```bash
git clone <repository-url>
cd the_ofline_co
```

### 2. Configure backend environment

Create `backend/.env`:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=the_ofline_co
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@theofflineco.com
ADMIN_PASSWORD=replace-with-a-secure-password
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
CORS_ORIGINS=http://localhost:3000
```

### 3. Configure frontend environment

Create `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 4. Run the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

The API will be available at `http://localhost:8000/api`.

### 5. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The web app will be available at `http://localhost:3000`.

### 6. Run backend tests

```bash
cd backend
pytest
```

By default, the backend tests target `REACT_APP_BACKEND_URL` or the configured preview URL in `backend/tests/backend_test.py`. Set `REACT_APP_BACKEND_URL=http://localhost:8000` to test a local backend.

## Deployment

### Frontend: Vercel

1. Create a Vercel project pointing to `frontend/`.
2. Set the build command to `npm run build`.
3. Set the output directory to `build`.
4. Add `REACT_APP_BACKEND_URL=https://<your-render-service>.onrender.com`.
5. Deploy from the main production branch.

### Backend: Render

1. Create a Render Web Service pointing to `backend/`.
2. Use Python runtime.
3. Set the start command:

```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

4. Add production environment variables for MongoDB, JWT, admin credentials, Razorpay, and CORS.
5. Set `CORS_ORIGINS` to your Vercel domain.

### Database: MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with least-privilege credentials.
3. Allow network access from Render.
4. Set `MONGO_URL` and `DB_NAME` in Render.
5. Let the backend startup routine create indexes and seed required baseline data.

## API Endpoints

All routes are mounted under `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check. |
| `POST` | `/applications` | Submit a public application for an offline cohort. |
| `GET` | `/experiences` | List published experiences by default. Supports `published_only=false`. |
| `GET` | `/experiences/{slug}` | Fetch one public experience by slug. |
| `GET` | `/countdown` | Fetch countdown reveal configuration. |
| `GET` | `/testimonials` | List public testimonials. |
| `POST` | `/auth/login` | Authenticate an admin and return a JWT bearer token. |
| `GET` | `/auth/me` | Return the current authenticated admin profile. |
| `GET` | `/admin/applications` | List applications for admin review. Requires JWT. |
| `PATCH` | `/admin/applications/{app_id}` | Update an application status. Requires JWT. |
| `DELETE` | `/admin/applications/{app_id}` | Delete an application. Requires JWT. |
| `POST` | `/admin/experiences` | Create an experience. Requires JWT. |
| `GET` | `/admin/experiences` | List all experiences, including unpublished. Requires JWT. |
| `PATCH` | `/admin/experiences/{exp_id}` | Update an experience. Requires JWT. |
| `DELETE` | `/admin/experiences/{exp_id}` | Delete an experience. Requires JWT. |
| `PUT` | `/admin/countdown` | Update countdown reveal time, label, and seats. Requires JWT. |
| `POST` | `/admin/testimonials` | Create a testimonial. Requires JWT. |
| `DELETE` | `/admin/testimonials/{tid}` | Delete a testimonial. Requires JWT. |
| `POST` | `/payments/razorpay/order` | Create a Razorpay order and pending booking. |
| `POST` | `/payments/razorpay/verify` | Verify Razorpay signature and mark booking as paid or failed. |

## Database Collections

| Collection | Purpose |
|------------|---------|
| `users` | Admin accounts with email, bcrypt password hash, role, and profile metadata. |
| `applications` | Public application submissions, applicant context, overload score, status, and creation timestamp. |
| `experiences` | Curated retreat inventory with slug, title, region hint, cover image, chapters, price, start date, and publication state. |
| `testimonials` | Public social proof entries shown on the landing page. |
| `config` | Operational configuration such as the countdown reveal record. |
| `bookings` | Razorpay-backed booking records with pending, paid, or failed status. |

## Authentication

Authentication is intentionally scoped to administrators. Public visitors can browse experiences, read testimonials, view countdown information, submit applications, and initiate payment orders without logging in.

Admin authentication uses JWT bearer tokens:

- Passwords are hashed with bcrypt before being stored.
- Tokens are signed with `JWT_SECRET` using HS256.
- Tokens expire after 24 hours.
- Protected routes depend on `get_current_admin`, which validates the token and confirms the user role is `admin`.
- The frontend stores the token in `localStorage` and refreshes the active admin session through `/auth/me`.

## Payment Flow

Razorpay integration is implemented server-side to keep secrets out of the browser.

1. The frontend requests an order through `/payments/razorpay/order`.
2. The backend loads the selected experience and converts `price_inr` to paise.
3. If Razorpay keys are missing, the backend returns a clear `503` response instead of creating an orphan booking.
4. If keys are configured, the backend creates a Razorpay order and stores a pending booking in MongoDB.
5. The frontend can complete checkout and send the Razorpay order ID, payment ID, signature, and booking ID to `/payments/razorpay/verify`.
6. The backend validates the signature with `RAZORPAY_KEY_SECRET` and updates booking status to `paid` or `failed`.

## Screenshots / Demo

> Add production screenshots or Loom/demo links here as the interface stabilizes.

- **Landing Page** — hero, positioning, experiences, countdown, testimonials.
- **Application Flow** — anonymous alias and guided multi-step application form.
- **Admin Dashboard** — application review, experience management, countdown editor, testimonial moderation.
- **Experience Page** — chapter narrative, pricing, cohort metadata, apply/reserve actions.

## Roadmap

- Email notifications for application receipt, selection, waitlist, and booking confirmation.
- Analytics for landing conversion, application drop-off, and cohort demand.
- Cohort matching tools based on applicant context, motivation, location, and availability.
- Mobile optimization passes for application and admin workflows.
- Richer admin tooling for search, filters, internal notes, exports, and booking reconciliation.
- Full Razorpay Checkout client integration with success/failure screens.
- Automated CI for backend tests, frontend build checks, and linting.
- CMS-like media management for experience photography and editorial content.

## Security Notes

- Never commit `.env` files or production secrets.
- Replace default `ADMIN_EMAIL` and `ADMIN_PASSWORD` in every deployed environment.
- Use a long, random, production-only `JWT_SECRET`.
- Restrict `CORS_ORIGINS` to the deployed frontend domain in production.
- Store Razorpay credentials only as backend environment variables.
- Rotate admin credentials and payment keys if they are ever exposed.
- Avoid using the seeded default admin password outside local development.

## Contribution Guide

1. Fork the repository.
2. Create a focused feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Install dependencies and run the app locally.
4. Make changes with clear commits.
5. Run relevant checks:

```bash
cd backend
pytest
```

```bash
cd frontend
npm run build
```

6. Open a pull request with a concise description, screenshots for UI changes, and notes about testing.

## License

MIT License. See `LICENSE` when added to the repository.