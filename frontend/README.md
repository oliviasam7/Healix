# Healix HealthOS — Frontend

React + TypeScript SPA for the Healix HealthOS hospital management system,
built with Vite and Tailwind CSS v4. Talks to the Spring Boot backend in `../backend`.

## Setup

```bash
npm install
npm run dev
```

Opens at **http://localhost:3000**. The API base URL is set in `src/api/client.ts`
(defaults to `http://localhost:8080/api` — update it if the backend runs elsewhere).

## Structure

```
src/
├── api/client.ts          Axios instance with JWT interceptor
├── context/AuthContext.tsx  Login/register/logout, current user state
├── components/            Header, Sidebar, StatusBadge, ConsultationModal
├── pages/
│   ├── Login.tsx, Register.tsx
│   ├── patient/            Booking, Appointments, Records
│   ├── doctor/             Schedule (confirm/cancel/complete)
│   └── admin/              Dashboard, Add Doctor
└── App.tsx                 Auth gating + role-based screen routing
```

## Design system

Ported from the uploaded Healix HealthOS concept UI: Tailwind v4 with a custom
`@theme` palette (`--color-primary`, `--color-surface`, etc. in `src/index.css`),
Plus Jakarta Sans for headings, Inter for body text, and Google's Material Symbols
icon font. The card/table/badge patterns are reused across all three role dashboards
for a consistent look.

## Scope note

The original concept UI included several ops-dashboard screens (physician room/suite
management, STAT alerts, vitals telemetry, inpatient wards, pharmacy orders) built for
a much larger hospital-operations product. Those aren't wired here because the backend
in this project only models patients, doctors, appointments, and medical records — which
is what the assignment's problem statement asks for. The three real, fully-wired flows are:

- **Patient**: book appointments, view/cancel them, view medical records.
- **Doctor**: view schedule, confirm/cancel/complete appointments (with diagnosis + prescription).
- **Admin**: dashboard stats, doctor roster, all appointments, add new doctors.
