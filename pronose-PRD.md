# Product Requirements Document — proNose

| | |
|---|---|
| **Product** | proNose — Post-Rhinectomy Rehabilitation Tracker |
| **Document status** | v1.0 |
| **Last updated** | 2026-07-19 |
| **Platform** | Responsive web application (mobile-first, desktop supported) |

---

## 1. Overview

### 1.1 One-line pitch
proNose lets post-rhinectomy patients submit prosthetic check-in photos and health questionnaires from home, and lets their doctors review submissions and communicate with them remotely — replacing routine in-person follow-up visits.

### 1.2 Problem statement
Patients recovering from a rhinectomy (surgical removal of the nose) wear a nasal prosthesis that requires ongoing clinical monitoring: fit, color fading, deformation, skin irritation, and general wellbeing. Today this monitoring requires frequent in-person visits, which are burdensome for patients — many of whom are elderly, immunocompromised, or live far from a specialist clinic. Missed follow-ups mean prosthetic problems are caught late.

### 1.3 Solution
A three-sided web app:

- **Patients** submit regular (weekly) or emergency consultations — a photo of the prosthesis plus a structured questionnaire — and chat with their assigned doctor.
- **Doctors** review consultations from their assigned patients, record clinical notes, and message patients.
- **A super admin** manages accounts, assigns patients to doctors, oversees all consultations, and moderates chat content.

### 1.4 Target users
| User | Description |
|---|---|
| Patient | Post-rhinectomy patient wearing a nasal prosthesis; may have limited mobility or technical skill. Primary device: mobile phone. |
| Doctor | Maxillofacial prosthetist / specialist clinician following a panel of assigned patients. |
| Super admin | Clinic staff responsible for onboarding users, role assignment, and platform oversight. |

---

## 2. Goals & Non-Goals

### Goals
1. Let patients complete a prosthetic check-in from home in under 5 minutes (photo + short questionnaire).
2. Give doctors a single queue of pending consultations from their assigned patients, with a clear pending → reviewed workflow.
3. Provide direct asynchronous patient↔doctor messaging.
4. Give clinic administrators full control over accounts, doctor assignment, consultation records, and chat moderation.
5. Support an emergency consultation path so urgent issues are flagged distinctly from routine check-ins.

### Non-goals (current scope)
- Video consultations or live calls.
- Prescriptions, billing, or insurance integration.
- Native mobile apps (the web app is mobile-responsive instead).
- Automated image analysis of prosthesis photos.
- Multi-clinic / multi-tenant support.

---

## 3. User Roles & Permissions

Three roles, enforced server-side via JWT + role middleware. New registrations default to **patient**; only a super admin can promote accounts.

| Capability | Patient | Doctor | Super admin |
|---|:---:|:---:|:---:|
| Register / log in | ✅ | ✅ | ✅ |
| Submit consultations | ✅ | — | — |
| View own consultations | ✅ | — | — |
| View assigned patients' consultations | — | ✅ | ✅ (all) |
| Review consultations (status + doctor notes) | — | ✅ | ✅ |
| Delete consultations | — | — | ✅ |
| Chat with assigned doctor | ✅ | — | — |
| Chat with assigned patients | — | ✅ | — |
| View all conversations | — | — | ✅ |
| Delete individual messages / whole conversations | — | — | ✅ |
| Edit own profile (name, contact, photo) | ✅ | ✅ | ✅ |
| Manage users (edit, delete, change roles, assign doctors) | — | — | ✅ |

Doctor notes on consultations are visible only to doctors and super admins — never to patients.

---

## 4. Functional Requirements

### 4.1 Authentication & Accounts
- **F-1.1** Users register with full name, email (unique), mobile number, and password. New accounts are patients by default.
- **F-1.2** Users log in with email + password; the server issues a JWT (configurable expiry).
- **F-1.3** Sessions persist across page reloads (token stored client-side; session rehydrated on app load).
- **F-1.4** After login, users land on a role-specific home: patient dashboard, doctor dashboard, or admin console.
- **F-1.5** All protected pages redirect unauthenticated users to login; role-gated pages return "no access" for the wrong role.
- **F-1.6** Users can update their profile (name, email, mobile, date of birth) and upload an avatar image.

### 4.2 Patient Experience
- **F-2.1 Dashboard** — greeting, quick actions, and a history of the patient's consultations with status badges (Pending / Reviewed).
- **F-2.2 Regular consultation** — patient submits a weekly check-in containing:
  - A photo of the prosthesis (image upload, max 10 MB).
  - Structured questionnaire: general wellbeing, discomfort, color fading (yes/no + details), deformation (yes/no + details), daily-life issues, additional comments.
- **F-2.3 Emergency consultation** — same form flagged as `emergency`; visually distinguished (urgent styling) everywhere it appears so doctors can triage.
- **F-2.4 Consultation status** — every consultation starts `pending` and becomes `reviewed` once a doctor acts on it; the patient can see the status but not the doctor's notes.
- **F-2.5 Chat** — patient messages their assigned doctor in a chat thread (bubbles, timestamps); the thread refreshes automatically every few seconds.

### 4.3 Doctor Experience
- **F-3.1 Patient panel** — doctor sees only patients assigned to them by the admin.
- **F-3.2 Consultation review** — doctor opens a patient's consultation to view the photo and questionnaire answers, writes private doctor notes, and marks it reviewed.
- **F-3.3 Messaging inbox** — doctor sees their assigned patients and opens a chat thread with any of them.

### 4.4 Admin Console
A single console with three tabs:

- **F-4.1 Users tab**
  - Stat cards: counts of patients, doctors, admins.
  - User table: change any user's role (patient / doctor / super_admin), assign or reassign a patient's doctor, edit user details and photo, delete users (with confirm step; self-deletion blocked).
- **F-4.2 Consultations tab** — all consultations across the system, with patient name, type (regular/emergency), date, and status; admin can open, review, or delete any consultation.
- **F-4.3 Messages tab** — all conversations in the system, grouped by participant pair:
  - Conversation list with participants, last message, and message count.
  - Conversation detail rendered as chat bubbles; admin can delete any individual message or the entire conversation.

---

## 5. Key User Flows

### 5.1 Weekly check-in
1. Patient logs in → dashboard → "New consultation".
2. Uploads prosthesis photo, answers questionnaire, submits.
3. Consultation appears as **Pending** for the patient and in the assigned doctor's queue.
4. Doctor opens it, inspects the photo/answers, writes notes, marks **Reviewed**.
5. Patient sees the status flip to Reviewed; doctor follows up via chat if needed.

### 5.2 Emergency issue
1. Patient chooses the emergency consultation path and submits.
2. The consultation is flagged urgent (distinct styling) in the doctor's and admin's lists for triage priority.

### 5.3 Onboarding a patient
1. Patient self-registers (defaults to patient role).
2. Admin assigns the patient to a doctor in the Users tab.
3. Patient can now chat with that doctor; the doctor sees the patient in their panel.

### 5.4 Chat moderation
1. Admin opens Messages tab → selects a conversation.
2. Deletes an inappropriate message (per-bubble delete) or removes the entire conversation.

---

## 6. Technical Requirements

### 6.1 Architecture
| Layer | Technology |
|---|---|
| Client | React 19 + Vite SPA, Tailwind CSS, React Router |
| Server | Node.js + Express REST API |
| ORM / DB | Sequelize + MySQL (utf8mb4); tables auto-sync on boot |
| Auth | JWT Bearer tokens (bcrypt-hashed passwords) |
| File storage | Local disk (`server/uploads/`), served at `/uploads`, 10 MB upload cap |
| Dev setup | Monorepo (`/client`, `/server`) run concurrently; Vite proxies `/api` and `/uploads` to the API |

### 6.2 Data model
- **User** — id, role (`patient` | `doctor` | `super_admin`), full_name, email (unique), mobile_number, password_hash, date_of_birth, avatar_url, assigned_doctor_id (self-referential FK: patient → doctor).
- **Consultation** — id, patient_id (FK), type (`regular` | `emergency`), status (`pending` | `reviewed`), prosthetic_image_url, questionnaire fields (wellbeing, discomfort, color-fading flag + details, deformation flag + details, daily issues, comments), doctor_notes (doctor/admin only).
- **Message** — id, sender_id (FK), receiver_id (FK), message_body, created_at. A "conversation" is the set of messages between two users in either direction (no separate room entity).

### 6.3 API surface
| Method & path | Access | Purpose |
|---|---|---|
| `POST /api/auth/register` | public | Create account (patient) |
| `POST /api/auth/login` | public | Log in, receive JWT |
| `GET /api/auth/me` | any authenticated | Rehydrate session |
| `POST /api/consultations` | patient | Submit consultation (multipart, photo) |
| `GET /api/consultations/:patientId` | participant / doctor / admin | List a patient's consultations |
| `GET /api/consultations` | super_admin | List all consultations |
| `PATCH /api/consultations/:id` | doctor, super_admin | Review (status, doctor notes) |
| `DELETE /api/consultations/:id` | super_admin | Delete consultation |
| `POST /api/messages` | any authenticated | Send message |
| `GET /api/messages/:userId/:peerId` | participants / admin | Fetch a thread |
| `GET /api/messages` | super_admin | All messages (grouped client-side) |
| `DELETE /api/messages/:id` | super_admin | Delete one message |
| `DELETE /api/messages/conversation/:userId/:peerId` | super_admin | Delete a conversation |
| `GET /api/users` | doctor, super_admin | List users |
| `PATCH /api/users/:id` | self / super_admin | Update profile / role / assignment (multipart avatar) |
| `DELETE /api/users/:id` | super_admin | Delete user |

### 6.4 Non-functional requirements
- **Security** — role checks enforced server-side on every route; passwords bcrypt-hashed; JWT expiry configurable; doctor notes filtered out of patient responses.
- **Responsiveness** — mobile-first layout; bottom navigation on mobile, sidebar on desktop.
- **Chat freshness** — threads poll every ~4 seconds (near-real-time without websockets).
- **Uploads** — images only where applicable, 10 MB max per file.

---

## 7. Design Requirements

- **Brand**: teal `#33E4DB` (primary) on white; glassmorphism cards; pastel accent chips (lavender, pink, peach, blue).
- **Layout shell**: top bar with page title; sidebar navigation on desktop, bottom tab bar on mobile.
- **Chat**: sender-aligned bubbles — own messages in a brand gradient, received messages in white/glass.
- **Status language**: consultations use badge chips — Pending (amber/clock) and Reviewed (teal/check); emergency items use urgent (siren/pink) iconography.
- **Tone**: warm and reassuring — this is a recovery product for a sensitive patient population.

---

## 8. Future Considerations

Not in current scope, but natural next steps:

1. **Real-time messaging** — replace 4-second polling with WebSockets/SSE; add unread indicators and notifications.
2. **Delete confirmations in chat moderation** — message/conversation deletion currently fires immediately; align with the Confirm/Cancel pattern used for user deletion.
3. **Email/push notifications** — alert doctors to new emergency consultations and patients to review outcomes.
4. **Database migrations** — move from Sequelize auto-sync to versioned migrations for safe production schema changes.
5. **Cloud file storage** — move uploads off local disk (e.g., S3) for durability and horizontal scaling.
6. **Audit logging** — record admin actions (deletions, role changes) for clinical-governance traceability.
7. **Appointment scheduling** — book in-person visits when a photo review isn't sufficient.
8. **Analytics** — trends over time per patient (e.g., recurring color-fading reports) to inform prosthesis replacement cycles.
