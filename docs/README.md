# Find Your Job

**Local Copilot for Job Search and Application** — inteligencia artificial local para búsqueda de empleo tech.

[![Stack](https://img.shields.io/badge/backend-Go_+_Gin-00ADD8?logo=go)](backend/)
[![Stack](https://img.shields.io/badge/frontend-React_19_+_TanStack-61DAFB?logo=react)](src/)
[![DB](https://img.shields.io/badge/database-PostgreSQL-4169E1?logo=postgresql)](backend/migrations/)
[![Phase](https://img.shields.io/badge/phase-8/15_complete-00EA64)](ROADMAP.md)

---

## What is this?

Find Your Job is a **local-first job search copilot** that helps tech candidates find, match, and apply to jobs — with AI-powered skill analysis, verified certifications, and a Zero Trust verification model.

Everything runs locally: your data, your LLM, your vector DB. No cloud dependency.

## Architecture

```
frontend/ (React + TanStack Start)          backend/ (Go + Gin)
    │                                              │
    ├── 52 routes (candidate + company)            ├── REST API (:8080)
    ├── mock data → migrating to real API          ├── Modular Monolith + Clean Architecture
    ├── shadcn/ui design system                    ├── PostgreSQL (13 tables)
    └── Tailwind 4 + dark mode                     └── golang-migrate migrations
```

## Project Status

| Phase | Status |
|-------|--------|
| 0. Idea & Requirements | ✅ |
| 1. Mockups & UX | ✅ |
| 2. Frontend (Lovable) | ✅ |
| 3. Frontend Cleanup | ✅ |
| 4. Architecture & Data Model | ✅ |
| 5. Backend Bootstrap (Go + Gin) | ✅ |
| 6. Database Schema & Migrations | ✅ |
| 7. Auth + Users | ✅ |
| 8. Jobs + Applications | ✅ |
| 9. Evaluations + Results | ⬜ Next |
| 10–15 | ⬜ Pending |

Full status: [`PROJECT_STATUS.md`](PROJECT_STATUS.md) · Roadmap: [`ROADMAP.md`](ROADMAP.md)

## Quick Start

### Prerequisites

- **Go** 1.23+
- **PostgreSQL** 15+
- **Node.js** 20+ (or Bun)
- **golang-migrate** (for DB migrations)

### Backend

```bash
cd backend
cp .env.example .env          # Edit DB credentials if needed
go run ./cmd/api              # → http://localhost:8080
```

```bash
# Health check
curl http://localhost:8080/health       # → {"status":"ok"}
curl http://localhost:8080/health/db    # → {"status":"ok","database":"healthy"}
```

### Database

```bash
cd backend
migrate -path migrations \
  -database "postgres://postgres:postgres@localhost:5432/findyourjob?sslmode=disable" \
  up
```

### Frontend

```bash
npm install
npm run dev                    # → http://localhost:3000
```

## Documentation

| Document | Description |
|----------|-------------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System architecture, design decisions, tech stack rationale |
| [`DATABASE.md`](DATABASE.md) | Database schema, entity relationships, migration guide |
| [`ROADMAP.md`](ROADMAP.md) | Project phases and progress |
| [`PROJECT_STATUS.md`](PROJECT_STATUS.md) | Current state, completed work, next steps |
| [`backend/README.md`](backend/README.md) | Backend-specific setup and API docs |

## Directory Structure

```
find-your-job/
├── backend/                   # Go + Gin REST API
│   ├── cmd/api/               # Entry point
│   ├── internal/
│   │   ├── config/            # Environment configuration
│   │   ├── database/          # PostgreSQL connection
│   │   ├── server/            # Gin server + routes + handlers
│   │   └── modules/           # Business modules (auth, users, jobs, …)
│   └── migrations/            # golang-migrate SQL files
├── src/                       # React + TanStack frontend
│   ├── components/            # UI components (app, empresa, landing, ui)
│   ├── routes/                # File-based routes (52 pages)
│   └── lib/                   # Utilities, mock data
├── archivos_markdown/         # Historical docs & phase reports
├── ROADMAP.md
├── ARCHITECTURE.md
└── README.md                  # ← You are here
```

---

*Built with Go, React, PostgreSQL, and a lot of cafecito.*
