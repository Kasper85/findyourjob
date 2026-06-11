-- 000002_core_schema.up.sql
-- Core tables: users, candidate_profiles, companies, recruiters, skills, candidate_skills

-- ============================================================
-- Users (authentication base for all roles)
-- ============================================================
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('candidate', 'recruiter', 'admin')),
    name          VARCHAR(255) NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users (role);

-- ============================================================
-- Candidate Profiles (extends users with role=candidate, 1:1)
-- ============================================================
CREATE TABLE candidate_profiles (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID          NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    phone              VARCHAR(50),
    location           VARCHAR(255),
    summary            TEXT,
    experience_years   INTEGER       DEFAULT 0,
    resume_url         TEXT,
    linkedin_url       VARCHAR(500),
    github_url         VARCHAR(500),
    portfolio_url      VARCHAR(500),
    preferred_remote   BOOLEAN       DEFAULT TRUE,
    preferred_location VARCHAR(255),
    salary_min         INTEGER,
    salary_max         INTEGER,
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_candidate_profiles_user_id   ON candidate_profiles (user_id);
CREATE INDEX idx_candidate_profiles_location  ON candidate_profiles (location);

-- ============================================================
-- Companies
-- ============================================================
CREATE TABLE companies (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    website     VARCHAR(500),
    logo_url    TEXT,
    location    VARCHAR(255),
    size        VARCHAR(50)  CHECK (size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    industry    VARCHAR(100),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_name     ON companies (name);
CREATE INDEX idx_companies_industry ON companies (industry);

-- ============================================================
-- Recruiters (extends users with role=recruiter, 1:1)
-- ============================================================
CREATE TABLE recruiters (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    company_id UUID         NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    position   VARCHAR(255),
    phone      VARCHAR(50),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recruiters_user_id    ON recruiters (user_id);
CREATE INDEX idx_recruiters_company_id ON recruiters (company_id);

-- ============================================================
-- Skills Catalog
-- ============================================================
CREATE TABLE skills (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name      VARCHAR(100) NOT NULL UNIQUE,
    category  VARCHAR(50)  CHECK (category IN ('technical', 'soft', 'language', 'tool', 'certification', 'domain')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills (category);

-- ============================================================
-- Candidate Skills (M:N)
-- ============================================================
CREATE TABLE candidate_skills (
    candidate_id        UUID         NOT NULL REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    skill_id            UUID         NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    proficiency         VARCHAR(20)  CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience NUMERIC(4,1) DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    PRIMARY KEY (candidate_id, skill_id)
);

CREATE INDEX idx_candidate_skills_skill_id ON candidate_skills (skill_id);

