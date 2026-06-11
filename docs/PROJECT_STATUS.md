# Project Status — Find Your Job

> **Last updated**: 2026-06-09 (post-Phase 14)

---

## Completed ✅

### Phase 0–9 ✅
Idea, Mockups, Frontend, Cleanup, Arquitectura, Backend Base, Migraciones, Auth, Jobs, Applications, Evaluations, QA.

### Phase 10 — Matching Engine ✅
- `GET /matching/jobs/:id/me`, `GET /matching/recommendations`, `GET /matching/jobs/:id/applicants`
- Scoring: skills(50%) + evaluations(25%) + experience(15%) + certifications(10%)
- PostgresMatchingStore — 8 queries SQL

### Phase 11 — Certifications ✅
- CRUD certifications: list, get, create, update, delete
- `GET /candidate/certifications` — candidate's own certs
- Ownership: candidate owns their certs, verified only by admin

### Phase 12 — Certification Verification ✅
- `PATCH /certifications/:id/verify` — admin only
- Verify/unverify certifications

### Phase 13 — Interviews ✅
- 7 endpoints: create, get, list mine, list by job, update, update status, delete
- Ownership: recruiter manages interviews for own jobs
- Valid types: phone, video, in_person, technical, hr

### Phase 14 — Frontend ↔ Backend Connection ✅
- **14.0**: API client layer — 37 functions, token management, types
- **14.1**: Auth UI real — login, register, logout, route protection
- **14.2**: Jobs UI real — list, detail, apply, create (recruiter)
- **14.3**: Applications UI real — candidate list, recruiter list + status update
- **14.4**: Profile + Certifications UI real — view/edit profile, CRUD certs
- **14.5**: Evaluations + Matching UI real — catalog, submit result, recommendations
- **14.6**: Interviews UI real — recruiter interview list

---

## Current Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Backend** | Go + Gin + PostgreSQL | 44 endpoints, 7 modules |
| **Frontend** | React 19 + TanStack Start + Tailwind | Connected to real API |
| **Auth** | JWT (HS256) + bcrypt | Full flow |
| **Modules** | auth, users, jobs, applications, evaluations, matching, certifications, interviews | All implemented |

---

## API Endpoints (44 total)

| Module | Endpoints | Status |
|--------|-----------|--------|
| Health | 2 | ✅ |
| Auth | 2 | ✅ |
| Users/Profile | 3 | ✅ |
| Jobs | 5 | ✅ |
| Applications | 4 | ✅ |
| Evaluations | 6 | ✅ |
| Matching | 3 | ✅ |
| Certifications | 7 | ✅ |
| Interviews | 7 | ✅ |
| Seeds | 1 | ✅ |

---

## Next: Phase 15 — Polish & QA

**Objective**: Sistema presentable y completo.

---

## Pending Phases

| Phase | Name | Status |
|-------|------|--------|
| 10 | Matching Engine | ✅ |
| 11 | Certifications | ✅ |
| 12 | Verification | ✅ |
| 13 | Interviews | ✅ |
| 14 | Frontend Connection | ✅ |
| 15 | Polish & QA | ⬜ Next |

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/cmd/api/main.go` | Server entry + module wiring |
| `backend/cmd/seed/main.go` | Dev seed script |
| `backend/internal/modules/` | 8 modules (auth through interviews) |
| `src/lib/api/` | Frontend API client (11 files) |
| `src/hooks/useAuth.ts` | Auth state management |
| `src/routes/` | Real API-connected pages |
