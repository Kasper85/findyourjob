-- 000005_evaluations.up.sql
-- Evaluations and evaluation results

-- ============================================================
-- Evaluations (test definitions)
-- ============================================================
CREATE TABLE evaluations (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255)  NOT NULL,
    description      TEXT,
    type             VARCHAR(30)   NOT NULL CHECK (type IN ('technical_test', 'soft_skills', 'language', 'personality', 'custom')),
    duration_minutes INTEGER,
    passing_score    NUMERIC(5,2),
    max_score        NUMERIC(5,2),
    created_by       UUID          REFERENCES users (id) ON DELETE SET NULL,
    is_active        BOOLEAN       DEFAULT TRUE,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evaluations_type      ON evaluations (type);
CREATE INDEX idx_evaluations_is_active ON evaluations (is_active);

-- ============================================================
-- Evaluation Results (candidate takes an evaluation)
-- ============================================================
CREATE TABLE evaluation_results (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID         NOT NULL REFERENCES evaluations (id) ON DELETE CASCADE,
    candidate_id  UUID         NOT NULL REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    score         NUMERIC(5,2) NOT NULL,
    passed        BOOLEAN,
    answers       JSONB,
    feedback      TEXT,
    taken_at      TIMESTAMPTZ  DEFAULT NOW(),
    completed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- A candidate takes each evaluation once (MVP — retakes can add attempt_number later)
    UNIQUE (evaluation_id, candidate_id)
);

CREATE INDEX idx_evaluation_results_evaluation_id ON evaluation_results (evaluation_id);
CREATE INDEX idx_evaluation_results_candidate_id  ON evaluation_results (candidate_id);

