# MVP Definition — Find Your Job

> **Last updated**: 2026-06-11

---

## MVP Scope

The MVP is a **demo-ready local application** that demonstrates the core value proposition for university presentation and initial user validation.

---

## In Scope (MVP)

| Feature | Status | Notes |
|---------|--------|-------|
| Auth (register/login) | ✅ Implemented | JWT + bcrypt, candidate/recruiter/admin roles |
| Candidate profile | ✅ Implemented | View/edit profile, skills |
| Job listings | ✅ Implemented | CRUD for recruiters, browse for candidates |
| Applications | ✅ Implemented | Apply, track status, recruiter review |
| Matching engine | ✅ Implemented | Weighted scoring (50/25/15/10) |
| Evaluations | ✅ Implemented | Submit results, contribute to matching |
| Certifications | ✅ Implemented | CRUD + admin verification |
| Interviews | ✅ Implemented | Create, manage, track status |
| Seed data | ✅ Implemented | Demo scenario with all entities |
| Frontend connection | ✅ Implemented | 14 pages connected to real API |

---

## Out of Scope (Post-MVP)

| Feature | Planned Phase | Dependencies |
|---------|---------------|--------------|
| AI/NLP matching | Phase 11+ | Ollama, Groq, pgvector |
| CV intelligence | Future | AI foundation |
| Learning paths | Future | AI foundation |
| Challenges | Future | AI foundation |
| Billing/payments | Future | Stripe integration |
| Cloud deployment | Future | Infrastructure setup |
| Multi-tenant | Future | Architecture changes |

---

## MVP Acceptance Criteria

- [ ] Backend and frontend run locally with documented commands
- [ ] Seed data creates complete demo scenario (candidate, recruiter, admin, jobs, applications, evaluations, certifications, interviews)
- [ ] Candidate demo flow works end-to-end
- [ ] Recruiter demo flow works end-to-end
- [ ] Admin certification verification works end-to-end
- [ ] Matching output is visible and explainable
- [ ] Documentation does not overclaim AI capabilities

---

## Demo Flow (University Presentation)

### Setup
1. Run seed script to populate database
2. Start backend server
3. Start frontend dev server

### Candidate Journey (5 min)
1. Login as candidate (seeded user)
2. Browse jobs with match scores
3. View job detail and match context
4. Apply to a job
5. Check application status
6. View evaluations and certifications

### Recruiter Journey (3 min)
1. Login as recruiter (seeded user)
2. View posted jobs
3. Review applicants for a job
4. Inspect match evidence
5. Update application status
6. Schedule interview

### Admin Journey (2 min)
1. Login as admin (seeded user)
2. Review pending certifications
3. Verify a certification
4. Show trust level change

---

## Technical Constraints

- **Local-only**: All services bind to localhost
- **No external APIs**: No API keys required for demo
- **Single binary**: One Go binary for backend
- **No Docker required**: Can run without Docker for demo
- **Seed-first**: Demo relies on seeded data, not manual entry

---

## Quality Bar

- No mock-only pages for features with real endpoints
- Proper error messages (not generic "Error occurred")
- Loading states for async operations
- Empty states guide user to next action
- Responsive on desktop and tablet

---

## Reference

- Full PRD: `docs/PRD.md`
- Demo preparation: `.atl/goals/demo.md`
- Current status: `docs/PROJECT_STATUS.md`
