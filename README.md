# Online Voting System

A full-stack, role-based campus voting platform built with React 19, Vite, Express, and MySQL. It provides transaction-safe one-vote enforcement, a voter portal, and an administrator analytics view.

## Quick start

1. Create a MySQL database by running `database/schema.sql`, then optionally `database/sample-data.sql`.
2. Copy `backend/.env.example` to `backend/.env` and set database credentials plus a strong JWT secret.
3. Copy `frontend/.env.example` to `frontend/.env`.
4. Run `npm install` in both `backend` and `frontend` (or `npm run install:all` at repository root).
5. Run `npm run seed --prefix backend` to create the development admin.
6. Start both services with `npm run dev`, or separately use `npm run dev --prefix backend` and `npm run dev --prefix frontend`.

Development admin: `admin@vote.local` / `Admin@123` — change immediately outside local development.

## Deployment

Deploy `frontend` to Vercel with `npm run build`; set `VITE_API_URL` to your Render API URL plus `/api`. Deploy `backend` to Render with build command `npm install`, start command `npm start`, and all values from `.env.example`. Set `CLIENT_URL` to the Vercel domain. Provision MySQL on Railway/PlanetScale-compatible hosting and import `database/schema.sql`.

## API overview

| Endpoint | Access | Purpose |
|---|---|---|
| `POST /api/auth/register`, `/login` | public | Account access |
| `GET /api/elections`, `GET /api/elections/:id` | public | Election & candidate discovery |
| `POST /api/votes` | voter | Cast one vote |
| `GET /api/votes/history` | signed in | Voter history |
| `GET /api/results/:id` | signed in | Live candidate totals |
| `POST/PUT/DELETE /api/elections` | admin | Election control |
| `POST/PUT/DELETE /api/candidates` | admin | Candidate control (multipart image upload) |

## Security notes

Passwords are bcrypt-hashed; auth uses expiring JWTs; authorization is role-based. Parameterized queries prevent injection. Helmet, CORS, request-size limits, validation, and rate limiting are enabled. Duplicate votes are prevented both by a MySQL unique index and an explicit locked transaction.
