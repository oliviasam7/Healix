# Healix HealthOS — Hospital Management System

A full-stack Java + React application for managing patients, doctors, appointments,
and medical records from one centralized platform.

## Architecture

```
healix/
├── backend/    Spring Boot REST API (Java 17, Spring Security + JWT, Spring Data JPA, MySQL)
└── frontend/   React + TypeScript SPA (Vite, Tailwind CSS v4) — Healix HealthOS UI
```

The backend serves JSON on `localhost:8080/api/**`. The frontend runs on
`localhost:3000` (Vite dev server) and calls it with a JWT in the `Authorization` header.

## Features

- **Patients**: self-register, browse/search doctors by specialization, book appointments,
  track status, cancel pending/confirmed visits, view medical record history.
- **Doctors**: view schedule, confirm or cancel appointments, complete a consultation by
  recording diagnosis + prescription (auto-creates a medical record).
- **Admins**: dashboard with stats, add new doctors, view every appointment hospital-wide.
- **Auth**: JWT-based, stateless REST API, BCrypt password hashing, role-based route
  protection on both backend (Spring Security) and frontend (screen gating by role).
- A default admin account is seeded on first backend run: `admin@healix.com` / `admin123`.

## Backend Setup (Spring Boot)

### Prerequisites
- JDK 17+, Maven 3.8+, MySQL 8 running locally

### Configure
Edit `backend/src/main/resources/application.properties` if your MySQL credentials differ
from the defaults (`root` / `root`). The database (`healix_db`) is created automatically.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healix_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

`app.cors.allowed-origin` is set to `http://localhost:3000` to match the frontend's dev
port — change it if you run the frontend elsewhere.

### Run

```bash
cd backend
mvn spring-boot:run
```

The API is now live at `http://localhost:8080/api`.

## Frontend Setup (React)

### Prerequisites
- Node.js 18+ and npm

### Run

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### Build for production

```bash
npm run build
```

Outputs a static bundle to `frontend/dist/`.

## API Overview

| Endpoint | Method | Role | Purpose |
|---|---|---|---|
| `/api/auth/register` | POST | public | Patient self-registration |
| `/api/auth/login` | POST | public | Login, returns JWT |
| `/api/patient/doctors` | GET | PATIENT | Browse/search doctors |
| `/api/patient/appointments` | GET/POST | PATIENT | List / book appointments |
| `/api/patient/appointments/{id}/cancel` | POST | PATIENT | Cancel an appointment |
| `/api/patient/records` | GET | PATIENT | Medical record history |
| `/api/doctor/appointments` | GET | DOCTOR | Doctor's schedule |
| `/api/doctor/appointments/{id}/confirm` | POST | DOCTOR | Confirm a booking |
| `/api/doctor/appointments/{id}/cancel` | POST | DOCTOR | Cancel a booking |
| `/api/doctor/appointments/{id}/complete` | POST | DOCTOR | Record diagnosis, close visit |
| `/api/admin/doctors` | GET/POST | ADMIN | List / add doctors |
| `/api/admin/appointments` | GET | ADMIN | Hospital-wide appointment list |

## Typical demo flow

1. Start the backend, then the frontend.
2. Log in as admin (`admin@healix.com` / `admin123`) → **Add Doctor** to create 2–3
   doctor accounts with different specializations.
3. Register a new patient account and log in as them.
4. As the patient: search a specialization → book an appointment.
5. Log out, log in as that doctor: confirm the appointment, then mark it complete with a
   diagnosis and prescription.
6. Log back in as the patient: check **My Records** to see the diagnosis appear, and
   **My Appointments** to see the status update to Completed.
7. Log in as admin again to see the dashboard stats and full appointment list update.

## About the UI

The frontend's visual design (colors, typography, card/table patterns, the Healix
HealthOS branding) is carried over from an uploaded concept UI. That concept was built as
a much broader hospital *operations* dashboard (physician room assignments, STAT alerts,
vitals telemetry, inpatient wards, pharmacy orders) — more than this project's backend
models. Rather than fake those extra screens with placeholder data, this build keeps the
same design language but wires up only the three flows the backend actually supports:
patient self-booking, doctor schedule management, and admin oversight — matching the
original problem statement. See `frontend/README.md` for more detail on that decision.

## Notes for extending it further

- Time slots are free text on booking; a nice next step is generating slot buttons from
  each doctor's `availableTimeSlots` and disabling ones already booked for that date.
- Add file upload for lab reports/attachments on medical records.
- Add pagination to the admin appointment table once data grows.
- Swap `ddl-auto=update` for Flyway/Liquibase migrations for a production-grade setup.
- If you want the fuller ops-dashboard experience from the original concept (rooms, STAT
  alerts, telemetry, wards, pharmacy), that would need new backend entities/endpoints for
  each — happy to help scope that out if it's useful for your course project.
