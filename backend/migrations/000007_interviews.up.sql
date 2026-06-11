-- 000007_interviews.up.sql
-- Scheduled interviews between recruiters and candidates

-- NOTE: candidate_id is intentionally included alongside application_id.
-- While candidate_id can be derived from applications.candidate_id via JOIN,
-- keeping it here simplifies the most common query: "show my upcoming interviews"
-- without requiring an extra join. The application layer must ensure consistency
-- between interviews.candidate_id and the underlying applications.candidate_id.

CREATE TABLE interviews (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id    UUID         NOT NULL REFERENCES applications (id) ON DELETE CASCADE,
    recruiter_id      UUID         NOT NULL REFERENCES recruiters (id) ON DELETE CASCADE,
    candidate_id      UUID         NOT NULL REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    scheduled_at      TIMESTAMPTZ  NOT NULL,
    duration_minutes  INTEGER      DEFAULT 60,
    type              VARCHAR(30)  CHECK (type IN ('phone', 'video', 'in_person', 'technical', 'hr')),
    location_or_link  TEXT,
    status            VARCHAR(20)  NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    notes             TEXT,
    feedback          TEXT,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interviews_application_id ON interviews (application_id);
CREATE INDEX idx_interviews_candidate_id   ON interviews (candidate_id);
CREATE INDEX idx_interviews_recruiter_id   ON interviews (recruiter_id);
CREATE INDEX idx_interviews_status         ON interviews (status);
CREATE INDEX idx_interviews_scheduled_at   ON interviews (scheduled_at);

