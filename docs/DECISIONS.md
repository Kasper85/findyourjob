# Architecture Decision Records — Find Your Job

> **Last updated**: 2026-06-11

---

## ADR Template

When recording a new decision, use this format:

```markdown
### ADR-{NUMBER}: {TITLE}

**Date**: YYYY-MM-DD  
**Status**: Proposed | Accepted | Deprecated | Superseded  
**Deciders**: {who was involved}

**Context**: What is the issue that we're seeing that is motivating this decision?

**Decision**: What is the change that we're proposing or have agreed to implement?

**Consequences**: What becomes easier or more difficult to do because of this change?
```

---

## ADR-001: Modular Monolith over Microservices

**Date**: 2026-06-01  
**Status**: Accepted  
**Deciders**: Chief Architect

**Context**: Original proposal (Phase 4) suggested pseudo-microservices: Go+Playwright scraper, Python NLP, Tauri desktop app. This would require multiple processes, service discovery, and distributed tracing.

**Decision**: Adopt modular monolith architecture with Clean Architecture patterns. Single Go binary, modules in `internal/modules/`, explicit dependency injection in `main.go`.

**Consequences**:
- ✅ Simpler development, testing, and deployment
- ✅ Single binary, no runtime dependencies
- ✅ Easier debugging (single process)
- ❌ Cannot scale individual modules independently
- ❌ Must maintain module boundaries manually

---

## ADR-002: database/sql + lib/pq over ORM

**Date**: 2026-06-01  
**Status**: Accepted  
**Deciders**: Chief Architect, Backend Engineer

**Context**: Go has several ORM options (GORM, Ent, sqlx). ORMs provide convenience but hide SQL generation and can produce inefficient queries.

**Decision**: Use standard `database/sql` with `lib/pq` driver. Write SQL queries directly in repository layer. Use `golang-migrate` for schema management.

**Consequences**:
- ✅ Full control over SQL queries
- ✅ No hidden query generation
- ✅ Better performance understanding
- ❌ More boilerplate code
- ❌ Must handle scanning manually

---

## ADR-003: UUID over SERIAL for Primary Keys

**Date**: 2026-06-01  
**Status**: Accepted  
**Deciders**: Chief Architect

**Context**: PostgreSQL supports both SERIAL (auto-increment) and UUID primary keys. SERIAL is simpler but leaks sequential information.

**Decision**: Use UUID (v4) for all primary keys. Generate in Go using `github.com/google/uuid`.

**Consequences**:
- ✅ No sequential ID leakage
- ✅ Better for distributed scenarios if multi-user later
- ✅ Safer for external exposure
- ❌ Slightly larger storage (16 bytes vs 4 bytes)
- ❌ Cannot sort by creation time from ID

---

## ADR-004: JWT (HS256) for Authentication

**Date**: 2026-06-05  
**Status**: Accepted  
**Deciders**: Chief Architect, Security Reviewer

**Context**: Need stateless authentication for API. Options: sessions (server-side), JWT (stateless), OAuth (external provider).

**Decision**: Use JWT with HS256 signing. Store secret in environment variable. Token expiry: 24 hours. Include user ID and role in claims.

**Consequences**:
- ✅ Stateless, no session storage
- ✅ Simple implementation
- ✅ Works with any client
- ❌ Cannot revoke tokens before expiry (without blocklist)
- ❌ Secret must be kept secure

---

## ADR-005: File-based Routing (TanStack Router)

**Date**: 2026-06-03  
**Status**: Accepted  
**Deciders**: Frontend Engineer

**Context**: React routing options: React Router (v6), TanStack Router, Next.js file-based routing. Need type-safe routing with code splitting.

**Decision**: Use TanStack Router with file-based routing convention. Routes in `src/routes/`, auto-generated route tree.

**Consequences**:
- ✅ Type-safe routing
- ✅ Automatic code splitting
- ✅ Collocated route logic
- ❌ Must follow naming conventions strictly
- ❌ Route tree generation step required

---

## ADR-006: Matching Algorithm (Weighted Scoring)

**Date**: 2026-06-08  
**Status**: Accepted  
**Deciders**: Chief Architect, Product Manager

**Context**: Need to match candidates to jobs. Options: simple keyword matching, weighted scoring, ML-based semantic matching.

**Decision**: Start with weighted scoring algorithm. Weights: Skills (50%), Evaluations (25%), Experience (15%), Certifications (10%). Defer ML-based matching to post-MVP.

**Consequences**:
- ✅ Explainable scoring
- ✅ No ML dependencies for MVP
- ✅ Easy to adjust weights
- ❌ Less sophisticated than semantic matching
- ❌ Requires manual skill matching

---

## ADR-007: Trust Model (Claimed/Measured/Verified)

**Date**: 2026-06-09  
**Status**: Accepted  
**Deciders**: Chief Architect, Product Manager

**Context**: Candidates provide self-reported skills and certifications. Not all claims are equally trustworthy.

**Decision**: Implement three trust levels:
- **Claimed**: User-provided, not verified (profile skills, unverified certs)
- **Measured**: Based on product activity (evaluations, application history)
- **Verified**: Confirmed by admin (verified certifications)

**Consequences**:
- ✅ Clear trust distinction for recruiters
- ✅ Incentivizes verification
- ✅ Honest about data quality
- ❌ More complex UI to show trust levels
- ❌ Requires admin verification workflow

---

## New Decisions

Record new decisions by appending to this file using the ADR template above.

---

## Reference

- Architecture overview: `docs/ARCHITECTURE.md`
- Product requirements: `docs/PRD.md`
