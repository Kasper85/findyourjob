-- 000006_certifications.up.sql
-- Candidate certifications

CREATE TABLE certifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID         NOT NULL REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    issuer          VARCHAR(255) NOT NULL,
    issue_date      DATE,
    expiration_date DATE,
    credential_id   VARCHAR(255),
    credential_url  TEXT,
    verified        BOOLEAN      DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_certifications_candidate_id ON certifications (candidate_id);
CREATE INDEX idx_certifications_name ON certifications (name);

