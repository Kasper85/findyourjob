# Changelog — Find Your Job

All notable changes to this project will be documented in this file.

---

## 2026-06-09

### Fase 14 — Frontend API Integration

- API client layer: 37 functions, types, token management
- Auth UI: login/register real, route protection, role-based redirect
- Jobs UI: list, detail, apply, create (recruiter)
- Applications UI: candidate list, recruiter list + status update
- Profile UI: view/edit with real data
- Certifications UI: CRUD + my certs
- Evaluations UI: catalog + submit result + history
- Matching UI: recommendations on dashboard, match score on job detail
- Interviews UI: recruiter interview list

### Fase 13 — Interviews 🆕

- 7 endpoints: create, get, list mine, list by job, update, update status, delete
- Ownership: recruiter manages own job interviews. Admin full access.

### Fase 12 — Verification 🆕

- `PATCH /certifications/:id/verify` — admin only

### Fase 11 — Certifications 🆕

- CRUD certifications + list mine. Ownership: candidate/admins. Verified by admin.

### Fase 10 — Matching Engine

- `GET /api/v1/matching/jobs/:id/me` — match score real: skills(50%) + evaluations(25%) + experience(15%) + certs(10%)
- `GET /api/v1/matching/recommendations` — jobs publicados ordenados por score, excluye aplicados
- Query params: limit, offset, min_score, include_applied
- `PostgresMatchingStore` — 8 queries SQL para skills, evaluations, certifications

### Fase 9.5 — QA Manual Backend ✅

- 39 tests ejecutados manualmente con PowerShell + curl.exe
- 24 endpoints validados contra DB real: health, auth, users, jobs, applications, evaluations
- Fases 7, 8 y 9 verificadas funcionalmente
- Observación: `POST /api/v1/jobs` crea jobs como `draft` por defecto; usar `PUT` con `status=published`
- Guía QA: `docs/QA_BACKEND_PHASE_9.md`

### Fase 9 — Evaluations + Results

- **Evaluations CRUD**: GET list (JWT, 3 filtros), GET detail, POST (recruiter/admin), PUT/DELETE (recruiter own/admin)
- **Results**: POST submit (candidate, score validations, auto-calculate passed), GET /evaluation-results/me, GET /evaluations/:id/results
- **Passing score**: automatic pass/fail based on evaluation.passing_score vs submitted score
- **Duplicate prevention**: UNIQUE(evaluation_id, candidate_id) → 409 AlreadySubmitted
- **Ownership**: recruiter can only modify/delete own evaluations; admin full access
- 8 endpoints. 24 total API endpoints.
- Repositories: PostgresEvaluationRepo (5 methods), PostgresEvaluationResultRepo (5 methods)

### Fase 8 — Jobs + Applications

- **Jobs CRUD**: GET list (público, 9 filtros), GET detail, POST (recruiter), PUT/DELETE (recruiter ownership)
- **Applications**: POST /jobs/:id/apply (candidate, published-only), GET /applications/me, GET /jobs/:id/applications (recruiter), PATCH status (workflow)
- **Ownership rules**: recruiter.company_id == job.company_id OR recruiter.id == job.recruiter_id
- **Pagination**: limit/offset clamp (1–100, default 20) para jobs y applications
- 16 endpoints total. Backend completamente funcional para flujo jobs+applications.

### Fase 7 — Auth + Users

- **Register**: POST `/api/v1/auth/register` — bcrypt hash, email único, validación de rol
- **Login**: POST `/api/v1/auth/login` — JWT HS256 (access + refresh tokens), bcrypt verify
- **Auth middleware**: JWT validation, stores `user_id`/`email`/`role` in context
- **GET /api/v1/me** — authenticated user profile (user + candidate_profile)
- **GET /api/v1/profile** — alias for /me
- **PUT /api/v1/profile** — create or update candidate profile (partial updates, validations)
- **UserRepository** PostgreSQL: Create, FindByID, FindByEmail, Update, Delete, List
- **CandidateProfileRepository** PostgreSQL: Create, FindByID, FindByUserID, Update
- **TokenService**: JWT generation (HS256) + validation, CustomClaims with sub/email/role
- **Seeds**: `go run ./cmd/seed` — admin, candidate (con perfil), recruiter (con empresa)
- Dependencies: `golang.org/x/crypto` (bcrypt), `github.com/golang-jwt/jwt/v5`
- Domain errors: `ErrUserNotFound`, `ErrEmailAlreadyExists`, `ErrProfileNotFound`, `ErrInvalidCredentials`, `ErrInactiveUser`, validaciones de salario/experiencia
- Endpoints: 7 total (2 auth, 3 users, 2 health) — todos verificados manualmente

### Fase 6 — Database Schema & Migrations

- **13 tablas MVP** implementadas: `users`, `candidate_profiles`, `companies`, `recruiters`, `skills`, `candidate_skills`, `jobs`, `job_skills`, `applications`, `evaluations`, `evaluation_results`, `certifications`, `interviews`
- **7 migraciones** `golang-migrate` con `.up.sql` / `.down.sql` (`000001`–`000007`)
- UUID primary keys con `gen_random_uuid()`
- `TIMESTAMPTZ` en todas las tablas con `DEFAULT NOW()`
- **31 índices** (B-tree, composite, unique)
- **11 CHECK constraints** para estados y enumeraciones
- **19 foreign keys** con `ON DELETE CASCADE` / `SET NULL`
- Extensión `pg_trgm` habilitada para búsqueda futura

### Fase 5 — Backend Bootstrap (Go + Gin)

- `backend/` creado con estructura modular
- `go.mod` inicializado: Go 1.26, Gin 1.12, `lib/pq`, `godotenv`
- Configuración `.env` con validación (`APP_PORT` range, `DB_SSLMODE`, producción)
- Conexión PostgreSQL con pool + retry (3 attempts, 2s delay)
- Endpoints: `GET /health` → `200`, `GET /health/db` → `200/503`
- Graceful shutdown (SIGINT/SIGTERM, 10s timeout)
- Estructura Clean Architecture: `cmd/api`, `internal/{config,database,server,modules/*}`
- `go build` y `go run ./cmd/api` verificados

### Documentación

- `README.md` — Readme raíz con stack, quick start, estructura
- `ARCHITECTURE.md` — Arquitectura actual (monolito modular), decisiones, diagramas
- `DATABASE.md` — Esquema completo, 13 tablas, ERD, constraints, migraciones
- `PROJECT_STATUS.md` — Estado actual del proyecto, fases completadas, next steps
- `ROADMAP.md` — Roadmap completo (15 fases), timeline visual
- `CHANGELOG.md` — Este archivo
- Documentación histórica de Fase 4 movida a `archivos_markdown/historico/`
- Banners de obsolescencia en todos los documentos históricos

---

## 2026-06-08 (early)

### Fase 3 — Frontend Cleanup

- 22 archivos muertos eliminados (UI components sin uso)
- 17 dependencias npm removidas (−26%)
- Landing page refactorizada: 500 → 53 líneas, 14 componentes modulares
- ESLint: 948 errores de formato → 0

### Fase 2 — Frontend (Lovable)

- 52 rutas implementadas con TanStack Start
- 46 componentes shadcn/ui (27 activos post-cleanup)
- Mock data completo (710 líneas, 3 archivos)
- Dark mode funcional con persistence

### Fase 1 — Mockups & UX

- Flujos principales: candidato, empresa, landing
- Design system: HackerRank-style (verde, dark mode, Inter + JetBrains Mono)

### Fase 0 — Idea & Requirements

- Producto: Local Copilot for Job Search and Application
- Usuarios: candidatos tech + empresas/reclutadores
- Core features: job matching, AI scoring, verified certifications
