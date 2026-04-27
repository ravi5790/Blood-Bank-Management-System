# BloodLink — Product Requirements Document

## Original Problem Statement
Online Blood Bank Management System with Donor & Hospital Integration.
A web app where Donors register and share availability, Hospitals manage stock, Receivers search & request blood. Goal: connect people who need blood with donors/hospitals quickly.

## Tech Architecture
- Frontend: React 19 + React Router + Tailwind + shadcn/ui + Recharts + Sonner
- Backend: FastAPI + Motor (async MongoDB)
- Auth: JWT (httpOnly cookie + Bearer header), bcrypt password hashing
- DB: MongoDB collections — `users`, `inventories`, `requests`

## User Personas
1. **Donor** — registers blood group + city, toggles availability, approves/rejects incoming requests
2. **Receiver** — searches hospitals/donors by group + city, sends blood requests, tracks status
3. **Hospital** — manages live inventory of 8 blood groups, approves requests (auto-decrements stock)
4. **Admin** — oversees all users + requests, sees analytics charts

## Implemented (2026-04-27)
- JWT auth with role-based register/login/logout/me + auto-seeded admin
- Role-aware dashboards (donor/receiver/hospital/admin)
- Search by blood group + city (case-insensitive prefix match)
- Blood request lifecycle: create → respond (approve/reject) → inventory decrement on hospital approval
- Hospital inventory CRUD across all 8 groups
- Admin user management (list/delete) + analytics overview (totals, demand, donor distribution, inventory)
- Recharts: bar + pie charts for blood group demand, donor distribution, hospital inventory
- Bold modern UI: Bricolage Grotesque + Inter, crimson accent, asymmetric hero, paper texture
- Email notifications: **MOCKED** (console-logged)

## Test Status (iteration 1)
- Backend: 26/26 pytest tests passing (100%)
- Frontend: smoke + admin login + charts pass; logout flow patched after testing-agent feedback

## Backlog
- **P0** — Real email notifications via Resend or SendGrid (currently MOCKED)
- **P1** — Password reset flow (forgot/reset endpoints)
- **P1** — Brute-force lockout on /api/auth/login
- **P2** — Donor donation history + last donation date enforcement (3-month gap)
- **P2** — Hospital verification workflow (admin approves new hospital signups)
- **P2** — In-app notifications/inbox
- **P2** — Map view for nearby hospitals/donors
- **P2** — CSV export for admin

## Auth Credentials
See `/app/memory/test_credentials.md`
