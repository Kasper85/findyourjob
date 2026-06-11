# Architecture — Find Your Job

> **Version**: 2.0 (post-Phase 6)  
> **Previous version**: `archivos_markdown/fase_04_arquitectura_v1.md` (pseudo-microservices — superseded)

---

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────┐
│                  Frontend                     │
│  React 19 · TanStack Start · Tailwind 4      │
│  52 routes · shadcn/ui · mock → real API     │
└──────────────────┬───────────────────────────┘
                   │ HTTP REST (JSON)
                   ▼
┌──────────────────────────────────────────────┐
│                  Backend                      │
│  Go 1.26 · Gin 1.12 · :8080                  │
│  Modular Monolith + Clean Architecture        │
│                                                │
│  cmd/api/main.go                               │
│    ├── config.Load()       → .env             │
│    ├── database.Connect()  → PostgreSQL        │
│    ├── server.New(cfg, db) → Gin engine       │
│    └── server.Run()        → graceful shutdown│
│                                                │
│  internal/                                     │
│    ├── server/    HTTP layer (routes, handlers)│
│    ├── modules/   Business logic (per domain) │
│    │   ├── auth/          (implemented)        │
│    │   ├── users/         (implemented)        │
│    │   ├── jobs/          (implemented)        │
│    │   ├── applications/  (implemented)        │
│    │   ├── matching/       (implemented)        │
│    │   ├── certifications/  (implemented)        │
│    │   └── interviews/      (implemented)        │
│    ├── config/    Environment configuration   │
│    └── database/  PostgreSQL connection       │
└──────────────────┬───────────────────────────┘
                   │ SQL (lib/pq)
                   ▼
┌──────────────────────────────────────────────┐
│              PostgreSQL 15+                    │
│  13 tables · 31 indexes · golang-migrate      │
└──────────────────────────────────────────────┘
```

## 2. Design Decisions

### Why a Monolithic Modular Backend?

| Decision | Rationale |
|----------|-----------|
| **Monolith over microservices** | Single-user local tool. No need for network overhead, service discovery, or distributed tracing. Simpler development and debugging. |
| **Modular over flat** | Domains (auth, users, jobs, evaluations, certifications) are separated into `internal/modules/`. Each module encapsulates its own handler, service, and repository. |
| **Go over Python for API** | Single binary, no runtime dependency, fast compilation, excellent concurrency. Python reserved for AI/NLP tasks (future). |
| **Gin over stdlib net/http** | Mature, performant, middleware ecosystem. Standard in Go REST APIs. |
| **database/sql + lib/pq over ORM** | Direct SQL control, no hidden queries, better performance. Migrations handle schema; Go code handles queries. |
| **UUID over SERIAL** | No sequential ID leakage, better for distributed scenarios if the tool ever becomes multi-user. |

### Clean Architecture (Simplified)

```
Handler (HTTP)  ←  server/handlers.go
    │                 Parses requests, validates input,
    │                 delegates to service, returns responses.
    ▼
Service (logic) ←  modules/*/service.go (auth, users, jobs, applications implemented)
    │                 Business rules, orchestration,
    │                 calls repositories.
    ▼
Repository (data) ← modules/*/repository.go (auth, users, jobs, applications implemented)
                      SQL queries, data mapping,
                      returns domain models.
```

**Current state**: The health endpoints bypass services (no business logic yet). As modules are added, the full chain will be: `handler → service → repository`.

### Dependency Injection

`main.go` explicitly wires dependencies:

```go
cfg, err := config.Load(".env")    // 1. Load configuration
db, err := database.Connect(cfg.DB) // 2. Connect to database (optional)
srv := server.New(cfg, db)          // 3. Create server with deps
srv.Run()                           // 4. Start
```

This keeps `server.New()` testable — it receives dependencies, doesn't create them.

## 3. Frontend Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | TanStack Start | SSR, file-based routing, server functions |
| **Routing** | TanStack Router v1 | 52 routes, layouts, code-splitting |
| **Data** | TanStack Query v5 | Server state, caching (currently mock data) |
| **UI** | shadcn/ui (new-york) | 27 components, custom theme |
| **Styling** | Tailwind CSS 4 | Utility-first, dark mode via CSS class |
| **Forms** | react-hook-form + zod | Validation, form state |
| **Icons** | lucide-react | Tree-shakeable SVG icons |

The frontend currently uses **static mock data**. The migration path is:

```
mock data → TanStack Query + fetch() → backend REST API
```

Routes are being progressively connected to real endpoints starting with Phase 7 (auth).

## 4. Communication

| Connection | Pattern | Protocol |
|-----------|---------|----------|
| Frontend → Backend | HTTP REST | JSON over HTTP |
| Backend → PostgreSQL | Direct SQL | `lib/pq` (database/sql) |
| (Future) Backend → Ollama | HTTP | Ollama REST API |
| (Future) Backend → Groq | HTTP | Groq SDK |

All services bind to `localhost` only — no external network exposure.

## 5. Configuration

Environment variables loaded from `backend/.env`:

| Variable | Purpose |
|----------|---------|
| `APP_ENV` | `development` / `production` / `test` |
| `APP_PORT` | Server port (default `8080`) |
| `DB_*` | PostgreSQL connection settings |
| `DB_MAX_*` | Connection pool tuning |

Validation rules:
- `APP_PORT`: 1–65535
- `DB_SSLMODE`: one of `disable`, `allow`, `prefer`, `require`, `verify-ca`, `verify-full`
- Production: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` required

## 6. Security

- **Local-first**: All services bind to `127.0.0.1`. No external ports.
- **Config validation**: Environment variables validated at startup.
- **JWT + bcrypt**: Auth implemented (Phase 7). Register, login, middleware.
- **Graceful shutdown**: SIGINT/SIGTERM handled, connections drained.

## 7. Historical Context

The original architecture (May 2026) proposed **pseudo-microservices**: Go+Playwright scraper, Python NLP, Tauri desktop app. This was redesigned to a **monolithic modular backend** in June 2026 for the following reasons:

1. **MVP simplicity**: A single Go binary is easier to develop, test, and run than 3+ processes.
2. **No scraping in v1**: Job data will be entered manually or via seed scripts — no need for Playwright.
3. **AI deferred to Phase 11**: Ollama/Groq integration happens later, not blocking core features.
4. **Web-first over desktop**: The React frontend already exists and works — no need for Tauri.

Original documents preserved in `archivos_markdown/fase_04_*.md` for traceability.
