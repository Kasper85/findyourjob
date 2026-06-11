-- 000003_jobs.up.sql
-- Jobs and Job-Skills relationship

-- ============================================================
-- Jobs
-- ============================================================
CREATE TABLE jobs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id       UUID         NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    recruiter_id     UUID         REFERENCES recruiters (id) ON DELETE SET NULL,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    requirements     TEXT,
    responsibilities TEXT,
    location         VARCHAR(255),
    is_remote        BOOLEAN      DEFAULT FALSE,
    salary_min       INTEGER,
    salary_max       INTEGER,
    currency         VARCHAR(3)   DEFAULT 'USD',
    job_type         VARCHAR(30)  CHECK (job_type IN ('full_time', 'part_time', 'contract', 'freelance', 'internship')),
    status           VARCHAR(20)  NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
    posted_at        TIMESTAMPTZ,
    expires_at       TIMESTAMPTZ,
    external_url     TEXT,
    source           VARCHAR(50)  CHECK (source IN ('computrabajo', 'remoteok', 'linkedin', 'indeed', 'manual', 'other')),
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_company_id   ON jobs (company_id);
CREATE INDEX idx_jobs_recruiter_id ON jobs (recruiter_id);
CREATE INDEX idx_jobs_status       ON jobs (status);
CREATE INDEX idx_jobs_posted_at    ON jobs (posted_at DESC);
CREATE INDEX idx_jobs_location     ON jobs (location);
CREATE INDEX idx_jobs_source       ON jobs (source);

-- ============================================================
-- Job Skills (M:N)
-- ============================================================
CREATE TABLE job_skills (
    job_id      UUID    NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    skill_id    UUID    NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    importance  INTEGER DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),

    PRIMARY KEY (job_id, skill_id)
);

CREATE INDEX idx_job_skills_skill_id ON job_skills (skill_id);

