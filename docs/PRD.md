# Product Requirements Document — Find Your Job

**Status**: Draft  
**Last updated**: 2026-06-11  
**Product**: Find Your Job  
**Scope**: MVP polish and product alignment

## Summary

Find Your Job is a local-first job search and recruiting copilot for tech talent. It helps candidates understand their fit for roles, apply with better context, prove skills through evaluations and certifications, and manage interviews. It helps recruiters publish jobs, evaluate applicants, rank candidates, and reduce hiring uncertainty before interviews.

The current product is closest to a **local/demo-ready MVP**, not a full cloud SaaS platform. The PRD therefore focuses on making the existing candidate, recruiter, verification, and matching flows coherent, demonstrable, and reliable.

## Problem

Tech hiring has two connected problems:

1. **Candidates lack trusted feedback** about which jobs fit their skills, what gaps they have, and how to prove readiness.
2. **Recruiters lack reliable signals** before interviewing, which creates noise, slow screening, and weak confidence in candidate quality.

Find Your Job aims to solve this by combining structured profiles, applications, evaluations, certifications, interviews, and match scoring into one local-first workflow.

## Goals

| Goal | Outcome |
|---|---|
| Improve candidate job search clarity | Candidates can see relevant jobs, match scores, applications, certifications, evaluations, and interview progress. |
| Improve recruiter screening confidence | Recruiters can create jobs, review applicants, inspect match evidence, and manage interviews. |
| Support verifiable trust signals | Certifications can be created by candidates and verified by admins. |
| Deliver a presentable MVP | The app can be seeded, demoed, tested manually, and explained clearly through documentation. |

## Non-goals

- Cloud SaaS deployment, multi-tenant billing, or production infrastructure.
- Real payment processing.
- Fully automated hiring decisions.
- Replacing human recruiter judgment.
- Claiming AI/NLP capabilities that are not implemented in the backend.

## Users

### Candidate

A tech professional looking for jobs and wanting clearer guidance on fit, skill gaps, applications, interviews, evaluations, and verified credentials.

### Recruiter / Company

A hiring user who publishes roles, reviews applicants, compares candidates, and manages interview pipelines.

### Admin / Verifier

A trusted operator who can verify or unverify candidate certifications.

## Core user journeys

### Candidate journey

1. Register or log in.
2. Complete profile.
3. Browse jobs.
4. View job detail and match context.
5. Apply to a job.
6. Track applications.
7. Submit evaluation results.
8. Manage certifications.
9. Track interviews.
10. Use recommendations to decide where to apply next.

### Recruiter journey

1. Register or log in as recruiter.
2. Create and manage jobs.
3. Review applications for owned jobs.
4. Inspect applicant ranking and match evidence.
5. Update application status.
6. Create and manage interviews.

### Admin journey

1. Review candidate certifications.
2. Verify or unverify certifications.
3. Preserve trust boundaries between candidate-provided claims and verified claims.

## Functional requirements

### Authentication and roles

- Users can register and log in.
- Sessions use JWT-based authentication.
- The system supports `candidate`, `recruiter`, and `admin` roles.
- Protected routes and endpoints must respect role boundaries.

### Candidate profile

- Candidates can view and update profile information.
- Profile data should contribute to match quality when relevant.
- Missing profile data should be clearly surfaced as incomplete, not silently ignored.

### Jobs

- Recruiters can create jobs.
- Users can list and inspect jobs.
- Candidates can apply to jobs.
- Recruiters can only manage jobs they own.

### Applications

- Candidates can view their own applications.
- Recruiters can view applications for their own jobs.
- Recruiters can update application status.
- Application state transitions should be clear enough for demo and QA.

### Matching

- Candidates can get job recommendations.
- Candidates can view their own match for a job.
- Recruiters can view applicant ranking for a job.
- Match output must explain the scoring basis.
- Current scoring should be described as structured scoring unless real AI/NLP is added.

Current known formula:

| Signal | Weight |
|---|---:|
| Skills | 50% |
| Evaluations | 25% |
| Experience | 15% |
| Certifications | 10% |

### Evaluations

- Candidates can view available evaluations.
- Candidates can submit evaluation results.
- Evaluation results contribute to matching.
- The product should distinguish between self-entered results and verified assessment signals if that difference exists.

### Certifications

- Candidates can create, update, delete, and list their certifications.
- Admins can verify or unverify certifications.
- Verified certifications contribute more trust than unverified claims.
- Verification actions must be restricted to admins.

### Interviews

- Recruiters can create interviews for applicants.
- Recruiters can list interviews for their jobs.
- Candidates can view their own interviews.
- Recruiters can update interview status.
- Supported interview types include phone, video, in-person, technical, and HR.

## UX requirements

- Candidate and recruiter areas must feel like different workspaces with clear navigation.
- Empty states must guide users toward the next useful action.
- Match scores must be understandable, not magic numbers.
- The MVP must include a reliable demo path from seed data to visible outcome.
- Error messages should explain what failed and what the user can do next.

## Data and trust model

The product should separate three levels of trust:

| Level | Meaning | Examples |
|---|---|---|
| Claimed | User-provided, not independently verified | Profile skills, unverified certifications |
| Measured | Based on product activity | Evaluation results, application history |
| Verified | Confirmed by trusted role or process | Admin-verified certifications |

This distinction is central to the Zero Trust positioning. The product should not treat every candidate claim as equally reliable.

## Success metrics

For the MVP, success is measured by demo readiness and workflow completeness:

- A candidate can complete the main job search journey without mock-only dead ends.
- A recruiter can create a job, receive/review applicants, and manage interviews.
- Match recommendations are explainable.
- Certifications can move from unverified to verified.
- Seed data supports a complete demo flow.
- Documentation explains setup, architecture, and product behavior consistently.

## MVP acceptance criteria

- [ ] Backend and frontend can run locally with documented commands.
- [ ] Seed data creates at least one candidate, recruiter, admin, job, application, evaluation, certification, and interview.
- [ ] Candidate demo flow works end-to-end.
- [ ] Recruiter demo flow works end-to-end.
- [ ] Admin certification verification flow works end-to-end.
- [ ] Matching output is visible and explainable.
- [ ] Documentation does not overclaim AI/NLP capabilities beyond implemented behavior.
- [ ] Phase 15 polish and QA issues are documented or resolved.

## Open questions

1. Should the product be positioned primarily as **local-first personal copilot** or as a **two-sided recruiting platform**?
2. Is “AI-powered” intended to mean real LLM/vector/NLP behavior in this MVP, or explainable weighted scoring?
3. Are CV intelligence, learning paths, challenges, billing, analytics, and ROI screens in MVP scope or future vision?
4. What exact criteria make a certification “verified”?
5. Should admin verification be manual only, or should the product support external evidence URLs/providers?

## Evidence reviewed

- `C:\Users\Julio\Documents\ProyectosProg\find-your-job\docs\README.md`
- `C:\Users\Julio\Documents\ProyectosProg\find-your-job\docs\PROJECT_STATUS.md`
- `C:\Users\Julio\Documents\ProyectosProg\find-your-job\docs\ROADMAP.md`
- `C:\Users\Julio\Documents\ProyectosProg\find-your-job\package.json`
- `C:\Users\Julio\Documents\ProyectosProg\find-your-job\src\routes`
- `C:\Users\Julio\Documents\ProyectosProg\find-your-job\backend\internal\modules`
