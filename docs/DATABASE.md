# Database — Find Your Job

> **Implementation**: `backend/migrations/` (golang-migrate)  
> **Engine**: PostgreSQL 15+  
> **Tables**: 13 · **Indexes**: 31 · **FKs**: 19 · **CHECK constraints**: 11

---

## Entity Relationship Diagram

```
users ──1:1── candidate_profiles ──M:N── skills (via candidate_skills)
  │                    │
  │                    ├── 1:N ── certifications
  │                    ├── 1:N ── applications ──1:N── interviews
  │                    ├── 1:N ── evaluation_results
  │                    └── 1:N ── interviews
  │
  ├──1:1── recruiters ──N:1── companies
  │              │                 │
  │              │                 └── 1:N ── jobs ──M:N── skills (via job_skills)
  │              │                               │
  │              ├── 1:N ── interviews            └── 1:N ── applications
  │              │
  └── 1:N ── evaluations

evaluations ──1:N── evaluation_results ──N:1── candidate_profiles
```

## Tables

### 1. `users` — Authentication base
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | `gen_random_uuid()` |
| `email` | `VARCHAR(255) UNIQUE` | |
| `password_hash` | `VARCHAR(255)` | bcrypt (Phase 7) |
| `role` | `VARCHAR(20)` | `CHECK (candidate, recruiter, admin)` |
| `name` | `VARCHAR(255)` | |

### 2. `candidate_profiles` — 1:1 extension of users
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `user_id` | `UUID UNIQUE FK → users` | `ON DELETE CASCADE` |
| `location`, `summary`, `experience_years`, `resume_url` | | |
| `linkedin_url`, `github_url`, `portfolio_url` | | |
| `preferred_remote`, `salary_min`, `salary_max` | | |

### 3. `companies` — Employer entities
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `name`, `description`, `website`, `logo_url` | | |
| `location`, `size`, `industry` | | `CHECK size` |

### 4. `recruiters` — 1:1 extension of users
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `user_id` | `UUID UNIQUE FK → users` | |
| `company_id` | `UUID FK → companies` | `NOT NULL` |

### 5. `skills` — Skill catalog
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `name` | `VARCHAR(100) UNIQUE` | |
| `category` | `VARCHAR(50)` | `CHECK (technical, soft, language, …)` |

### 6. `candidate_skills` — M:N candidate ↔ skills
| Column | Type | Notes |
|--------|------|-------|
| `candidate_id` | `UUID FK → candidate_profiles` | Part of composite PK |
| `skill_id` | `UUID FK → skills` | Part of composite PK |
| `proficiency` | `VARCHAR(20)` | `CHECK (beginner, intermediate, advanced, expert)` |
| `years_of_experience` | `NUMERIC(4,1)` | |

### 7. `jobs` — Job listings
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `company_id` | `UUID FK → companies` | |
| `recruiter_id` | `UUID FK → recruiters` | `ON DELETE SET NULL` |
| `title`, `description`, `requirements`, `responsibilities` | | |
| `location`, `is_remote`, `salary_min`, `salary_max`, `currency` | | |
| `job_type` | `VARCHAR(30)` | `CHECK (full_time, part_time, contract, …)` |
| `status` | `VARCHAR(20)` | `CHECK (draft, published, closed, archived)` |
| `source` | `VARCHAR(50)` | `CHECK (computrabajo, remoteok, linkedin, manual, …)` |

### 8. `job_skills` — M:N job ↔ skills
| Column | Type | Notes |
|--------|------|-------|
| `job_id` | `UUID FK → jobs` | Part of composite PK |
| `skill_id` | `UUID FK → skills` | Part of composite PK |
| `is_required` | `BOOLEAN` | |
| `importance` | `INTEGER 1–5` | |

### 9. `applications` — Job applications
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `job_id` | `UUID FK → jobs` | |
| `candidate_id` | `UUID FK → candidate_profiles` | |
| `status` | `VARCHAR(20)` | `CHECK (pending, reviewed, shortlisted, rejected, offered, accepted, withdrawn)` |
| `cover_letter`, `resume_snapshot_url` | | |
| | | `UNIQUE (job_id, candidate_id)` |

### 10. `evaluations` — Test definitions
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `title`, `description` | | |
| `type` | `VARCHAR(30)` | `CHECK (technical_test, soft_skills, language, …)` |
| `duration_minutes`, `passing_score`, `max_score` | | |

### 11. `evaluation_results` — Candidate test results
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `evaluation_id` | `UUID FK → evaluations` | |
| `candidate_id` | `UUID FK → candidate_profiles` | |
| `score`, `passed`, `answers (JSONB)`, `feedback` | | |
| | | `UNIQUE (evaluation_id, candidate_id)` |

### 12. `certifications` — Candidate certifications
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `candidate_id` | `UUID FK → candidate_profiles` | |
| `name`, `issuer`, `issue_date`, `expiration_date` | | |
| `credential_id`, `credential_url`, `verified` | | |

### 13. `interviews` — Scheduled interviews
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID PK` | |
| `application_id` | `UUID FK → applications` | |
| `recruiter_id` | `UUID FK → recruiters` | |
| `candidate_id` | `UUID FK → candidate_profiles` | Denormalized for query simplicity |
| `scheduled_at`, `duration_minutes`, `type`, `location_or_link` | | |
| `status` | `VARCHAR(20)` | `CHECK (scheduled, confirmed, completed, cancelled, no_show)` |

## CHECK Constraints Reference

| Table | Column | Valid values |
|-------|--------|-------------|
| `users` | `role` | `candidate`, `recruiter`, `admin` |
| `skills` | `category` | `technical`, `soft`, `language`, `tool`, `certification`, `domain` |
| `candidate_skills` | `proficiency` | `beginner`, `intermediate`, `advanced`, `expert` |
| `jobs` | `job_type` | `full_time`, `part_time`, `contract`, `freelance`, `internship` |
| `jobs` | `status` | `draft`, `published`, `closed`, `archived` |
| `jobs` | `source` | `computrabajo`, `remoteok`, `linkedin`, `indeed`, `manual`, `other` |
| `applications` | `status` | `pending`, `reviewed`, `shortlisted`, `rejected`, `offered`, `accepted`, `withdrawn` |
| `evaluations` | `type` | `technical_test`, `soft_skills`, `language`, `personality`, `custom` |
| `interviews` | `type` | `phone`, `video`, `in_person`, `technical`, `hr` |
| `interviews` | `status` | `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show` |
| `companies` | `size` | `startup`, `small`, `medium`, `large`, `enterprise` |

## Migrations

Migrations are in `backend/migrations/` using **golang-migrate** format:

| Version | Name | Tables created |
|---------|------|---------------|
| `000001` | `extensions` | `pg_trgm` extension |
| `000002` | `core_schema` | `users`, `candidate_profiles`, `companies`, `recruiters`, `skills`, `candidate_skills` |
| `000003` | `jobs` | `jobs`, `job_skills` |
| `000004` | `applications` | `applications` |
| `000005` | `evaluations` | `evaluations`, `evaluation_results` |
| `000006` | `certifications` | `certifications` |
| `000007` | `interviews` | `interviews` |

Each migration has `.up.sql` and `.down.sql`. Execution:

```bash
cd backend
migrate -path migrations \
  -database "postgres://postgres:postgres@localhost:5432/findyourjob?sslmode=disable" \
  up
```

## Design Principles

- **UUIDs everywhere**: `gen_random_uuid()` (PostgreSQL 13+ native, no extension needed)
- **TIMESTAMPTZ**: All timestamps timezone-aware with `DEFAULT NOW()`
- **CASCADE deletes**: Parent deletions propagate to children where appropriate
- **CHECK constraints**: Data integrity enforced at the database level
- **Composite keys**: M:N relationships use composite PKs (`candidate_skills`, `job_skills`)
- **Soft deletes not used**: MVP simplicity — hard deletes with CASCADE
