-- 000004_applications.up.sql
-- Job applications (candidate → job)

CREATE TABLE applications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id              UUID         NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
    candidate_id        UUID         NOT NULL REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    status              VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'offered', 'accepted', 'withdrawn')),
    cover_letter        TEXT,
    resume_snapshot_url TEXT,
    applied_at          TIMESTAMPTZ  DEFAULT NOW(),
    reviewed_at         TIMESTAMPTZ,
    notes               TEXT,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- A candidate cannot apply twice to the same job
    UNIQUE (job_id, candidate_id)
);

CREATE INDEX idx_applications_job_id       ON applications (job_id);
CREATE INDEX idx_applications_candidate_id ON applications (candidate_id);
CREATE INDEX idx_applications_status       ON applications (status);
CREATE INDEX idx_applications_applied_at   ON applications (applied_at DESC);

