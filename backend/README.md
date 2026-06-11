# Find Your Job — Backend

Go REST API for the Find Your Job platform. Built with **Gin**, connected to **PostgreSQL**, following a modular monolith structure.

## Quick Start

### Prerequisites

- Go 1.23+
- PostgreSQL 15+ (running locally or via Docker)

### Setup

```bash
# 1. Copy environment configuration
cp .env.example .env

# 2. Edit .env with your PostgreSQL credentials

# 3. Run database migrations
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/findyourjob?sslmode=disable" up

# 4. Run seeds (optional — creates test users)
go run ./cmd/seed

# 5. Start the server
go run ./cmd/api
# → http://localhost:8080
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | — | Server health |
| `GET` | `/health/db` | — | Database health |
| `POST` | `/api/v1/auth/register` | — | Register user |
| `POST` | `/api/v1/auth/login` | — | Login, get JWT |
| `GET` | `/api/v1/me` | JWT | Authenticated user profile |
| `GET` | `/api/v1/profile` | JWT | Candidate profile |
| `PUT` | `/api/v1/profile` | JWT | Update candidate profile |
| `GET` | `/api/v1/jobs` | — | List jobs (filters, pagination) |
| `GET` | `/api/v1/jobs/:id` | — | Job detail + skills |
| `POST` | `/api/v1/jobs` | Recruiter | Create job |
| `PUT` | `/api/v1/jobs/:id` | Recruiter | Update job |
| `DELETE` | `/api/v1/jobs/:id` | Recruiter | Delete job |
| `POST` | `/api/v1/jobs/:id/apply` | Candidate | Apply to job |
| `GET` | `/api/v1/applications/me` | Candidate | My applications |
| `GET` | `/api/v1/jobs/:id/applications` | Recruiter | Job applications |
| `PATCH` | `/api/v1/applications/:id/status` | Recruiter | Update app status |
| `GET` | `/api/v1/evaluations` | JWT | List evaluations |
| `GET` | `/api/v1/evaluations/:id` | JWT | Evaluation detail |
| `POST` | `/api/v1/evaluations` | Recruiter/Admin | Create evaluation |
| `PUT` | `/api/v1/evaluations/:id` | Recruiter/Admin | Update evaluation |
| `DELETE` | `/api/v1/evaluations/:id` | Recruiter/Admin | Delete evaluation |
| `POST` | `/api/v1/evaluations/:id/results` | Candidate | Submit result |
| `GET` | `/api/v1/evaluation-results/me` | Candidate | My results |
| `GET` | `/api/v1/evaluations/:id/results` | Recruiter/Admin | Evaluation results |
| `GET` | `/api/v1/matching/jobs/:id/me` | Candidate | Match score (real) |
| `GET` | `/api/v1/matching/recommendations` | Candidate | Job recommendations (real) |
| `GET` | `/api/v1/matching/jobs/:id/applicants` | Recruiter/Admin | Applicant ranking (real) |
| `GET` | `/api/v1/certifications` | JWT | List certifications |
| `GET` | `/api/v1/certifications/:id` | JWT | Certification detail |
| `POST` | `/api/v1/certifications` | Candidate | Create certification |
| `PUT` | `/api/v1/certifications/:id` | Owner/Admin | Update certification |
| `DELETE` | `/api/v1/certifications/:id` | Owner/Admin | Delete certification |
| `PATCH` | `/api/v1/certifications/:id/verify` | Admin | Verify/unverify |
| `GET` | `/api/v1/candidate/certifications` | Candidate | My certifications |
| `POST` | `/api/v1/applications/:id/interviews` | Recruiter/Admin | Create interview |
| `GET` | `/api/v1/interviews/me` | All auth | My interviews |
| `GET` | `/api/v1/interviews/:id` | All auth | Interview detail |
| `PUT` | `/api/v1/interviews/:id` | Recruiter/Admin | Update interview |
| `PATCH` | `/api/v1/interviews/:id/status` | Recruiter/Admin | Update status |
| `DELETE` | `/api/v1/interviews/:id` | Recruiter/Admin | Delete interview |
| `GET` | `/api/v1/jobs/:id/interviews` | Recruiter/Admin | Job interviews |

> **Nota**: `POST /api/v1/jobs` crea jobs como `draft` por defecto (ignora el campo `status` si se envía).  
> Para publicar un job, usar `PUT /api/v1/jobs/:id` con `{"status":"published"}`.

### Example Flows

**Recruiter flow:**
```bash
# 1. Login
TOKEN=$(curl -s -X POST /api/v1/auth/login -d '{"email":"recruiter@test.com","password":"password123"}' | jq -r .token.access_token)

# 2. Create job
curl -X POST /api/v1/jobs -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Go Developer","description":"...","job_type":"full_time"}'

# 3. List applications for your job
curl /api/v1/jobs/$JOB_ID/applications -H "Authorization: Bearer $TOKEN"

# 4. Update application status
curl -X PATCH /api/v1/applications/$APP_ID/status -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"shortlisted"}'
```

**Candidate flow:**
```bash
# 1. Register
curl -X POST /api/v1/auth/register \
  -d '{"email":"dev@test.com","password":"password123","name":"Dev","role":"candidate"}'

# 2. Login
TOKEN=$(curl -s -X POST /api/v1/auth/login -d '{"email":"dev@test.com","password":"password123"}' | jq -r .token.access_token)

# 3. View jobs
curl "/api/v1/jobs?status=published&search=golang"

# 4. Apply
curl -X POST /api/v1/jobs/$JOB_ID/apply -H "Authorization: Bearer $TOKEN" \
  -d '{"cover_letter":"I am very interested"}'

# 5. View my applications
curl /api/v1/applications/me -H "Authorization: Bearer $TOKEN"
```

**Evaluations flow:**
```bash
# Recruiter: create evaluation
curl -X POST /api/v1/evaluations -H "Authorization: Bearer $R_TOKEN" \
  -d '{"title":"Go Test","type":"technical_test","duration_minutes":60,"passing_score":70,"max_score":100}'

# Candidate: submit result
curl -X POST /api/v1/evaluations/$EVAL_ID/results -H "Authorization: Bearer $C_TOKEN" \
  -d '{"score":85}'

# Recruiter: view results
curl /api/v1/evaluations/$EVAL_ID/results -H "Authorization: Bearer $R_TOKEN"

# Candidate: my results
curl /api/v1/evaluation-results/me -H "Authorization: Bearer $C_TOKEN"
```

### Health Endpoints

```bash
curl http://localhost:8080/health       # → {"status":"ok"}
curl http://localhost:8080/health/db    # → {"status":"ok","database":"healthy"}
```

## Project Structure

```
backend/
├── cmd/
│   └── api/              # Application entry point
├── internal/
│   ├── config/           # Environment & app configuration
│   ├── database/         # PostgreSQL connection & pool
│   ├── server/           # Gin server setup & routes
│   └── modules/          # Business modules
│       ├── auth/         # Authentication
│       ├── users/        # User management
│       ├── jobs/         # Job listings
│       ├── evaluations/  # Skill evaluations
│       └── certifications/ # Certifications
├── migrations/           # SQL migration files
├── .env.example          # Environment template
├── go.mod                # Go module definition
└── README.md
```

### Architecture

The backend follows a **modular monolith** structure. Each module under `modules/` encapsulates its own handler, service, repository, and models — keeping concerns isolated while running as a single process.

```
cmd/api/main.go
  ├── 1. config.Load()          → .env + validation
  ├── 2. database.Connect()     → PostgreSQL (optional)
  ├── 3. server.New(cfg, db)    → Gin engine + routes
  └── 4. server.Run()           → graceful shutdown
        └── server/routes.go
              ├── GET /health         → server/handlers.go
              └── GET /health/db      → server/handlers.go
```

### Design Decisions

- **Dependency injection at main.go**: `server.New()` receives config and db as parameters instead of creating them internally. This keeps the server package testable and free of hidden side effects.
- **Handlers separated from routes**: `routes.go` only registers routes; `handlers.go` contains the Gin handler functions — following Clean Architecture where the HTTP layer is distinct from routing.
- **Config validation**: `config.Load()` validates APP_PORT range (1–65535), DB_SSLMODE against allowed values, and requires DB credentials when APP_ENV=production.
- **Database is optional**: The server starts even without PostgreSQL. `/health` returns 200 always; `/health/db` reports the real DB status.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_ENV` | `development` | Environment: development, production, test |
| `APP_PORT` | `8080` | HTTP server port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `DB_NAME` | `findyourjob` | Database name |
| `DB_SSLMODE` | `disable` | SSL mode |
| `DB_MAX_OPEN_CONNS` | `25` | Max open connections |
| `DB_MAX_IDLE_CONNS` | `10` | Max idle connections |
| `DB_CONN_MAX_LIFETIME` | `5m` | Connection max lifetime |

## Migrations

Migrations use [golang-migrate](https://github.com/golang-migrate/migrate).  
They are ordered by dependency — run them all with a single command.

### Install golang-migrate

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

### Run migrations

```bash
# Apply all pending migrations
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/findyourjob?sslmode=disable" up

# Rollback the last migration
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/findyourjob?sslmode=disable" down 1

# Check current version
migrate -path migrations -database "postgres://postgres:postgres@localhost:5432/findyourjob?sslmode=disable" version
```

### Migration files

| Version | Name | Tables |
|---------|------|--------|
| 000001 | extensions | `pg_trgm` |
| 000002 | core_schema | `users`, `candidate_profiles`, `companies`, `recruiters`, `skills`, `candidate_skills` |
| 000003 | jobs | `jobs`, `job_skills` |
| 000004 | applications | `applications` |
| 000005 | evaluations | `evaluations`, `evaluation_results` |
| 000006 | certifications | `certifications` |
| 000007 | interviews | `interviews` |

## Seeds

Populate the database with development data (users, profiles, company).

```bash
# Run the seed (idempotent — safe to run multiple times)
go run ./cmd/seed
```

### Seed data

| Email | Password | Role |
|-------|----------|------|
| `admin@test.com` | `password123` | admin |
| `candidate@test.com` | `password123` | candidate (with profile) |
| `recruiter@test.com` | `password123` | recruiter (with company) |

## Development

```bash
# Run the server
go run ./cmd/api

# Build binary
go build -o bin/api.exe ./cmd/api

# Run tests (coming soon)
go test ./...

# Watch mode (requires air)
go install github.com/air-verse/air@latest
air
```
