-- ============================================================
-- HireSense Database Schema
-- Platform: Supabase (PostgreSQL)
-- Safe to run multiple times (IF NOT EXISTS + ON CONFLICT)
-- ============================================================

CREATE TABLE IF NOT EXISTS companies (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL UNIQUE,
    description     TEXT,
    industry        TEXT,
    linkedin_url    TEXT,
    careers_url     TEXT,
    logo_url        TEXT,
    headquarters    TEXT,
    founded_year    INT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_postings (
    id              SERIAL PRIMARY KEY,
    company_id      INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    location        TEXT,
    season          TEXT,
    year            INT,
    apply_url       TEXT,
    source          TEXT,
    raw_description TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    scraped_at      TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, title, season, year)
);

CREATE TABLE IF NOT EXISTS posting_analysis (
    id                      SERIAL PRIMARY KEY,
    posting_id              INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    est_applicants_low      INT,
    est_applicants_high     INT,
    applicant_confidence    FLOAT,
    applicant_source        TEXT,
    accept_rate_low         FLOAT,
    accept_rate_high        FLOAT,
    compensation_hourly     FLOAT,
    compensation_notes      TEXT,
    workload_score          INT CHECK (workload_score BETWEEN 1 AND 6),
    workload_label          TEXT,
    selectivity_label       TEXT,
    typical_background      TEXT,
    updated_at              TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(posting_id)
);

CREATE TABLE IF NOT EXISTS legitimacy_flags (
    id          SERIAL PRIMARY KEY,
    posting_id  INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    flag_color  TEXT NOT NULL CHECK (flag_color IN ('green', 'yellow', 'red')),
    flag_text   TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS required_skills (
    id          SERIAL PRIMARY KEY,
    posting_id  INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    skill_name  TEXT NOT NULL,
    is_core     BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(posting_id, skill_name)
);

CREATE TABLE IF NOT EXISTS intern_reviews (
    id               SERIAL PRIMARY KEY,
    company_id       INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    source           TEXT,
    rating           FLOAT CHECK (rating BETWEEN 1.0 AND 5.0),
    role_title       TEXT,
    review_text      TEXT,
    workload_notes   TEXT,
    management_style TEXT,
    resume_value     TEXT,
    scraped_at       TIMESTAMPTZ DEFAULT NOW(),
    review_date      DATE
);

CREATE TABLE IF NOT EXISTS interview_questions (
    id          SERIAL PRIMARY KEY,
    company_id  INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    question    TEXT NOT NULL,
    category    TEXT,
    source      TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_reputation (
    id                  SERIAL PRIMARY KEY,
    company_id          INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    overall_score       INT CHECK (overall_score BETWEEN 0 AND 100),
    avg_intern_rating   FLOAT,
    return_offer_rate   FLOAT,
    alumni_outcome_note TEXT,
    prestige_note       TEXT,
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id)
);

CREATE INDEX IF NOT EXISTS idx_job_postings_company ON job_postings(company_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_season  ON job_postings(season, year);
CREATE INDEX IF NOT EXISTS idx_legitimacy_posting   ON legitimacy_flags(posting_id);
CREATE INDEX IF NOT EXISTS idx_skills_posting       ON required_skills(posting_id);
CREATE INDEX IF NOT EXISTS idx_reviews_company      ON intern_reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_questions_company    ON interview_questions(company_id);

-- ============================================================
-- SEED DATA — safe to run multiple times
-- ============================================================

INSERT INTO companies (name, description, industry, linkedin_url, careers_url, headquarters)
VALUES (
    'Google',
    'Multinational technology company focused on search, cloud, and AI.',
    'Technology',
    'https://linkedin.com/company/google',
    'https://careers.google.com',
    'Mountain View, CA'
) ON CONFLICT (name) DO NOTHING;

INSERT INTO job_postings (company_id, title, location, season, year, apply_url, source)
VALUES (
    1, 'Software Engineering Intern', 'New York, NY', 'Summer', 2026,
    'https://careers.google.com/jobs/results/', 'manual'
) ON CONFLICT (company_id, title, season, year) DO NOTHING;

INSERT INTO posting_analysis (
    posting_id, est_applicants_low, est_applicants_high, applicant_confidence,
    accept_rate_low, accept_rate_high, compensation_hourly,
    workload_score, workload_label, selectivity_label, typical_background
) VALUES (
    1, 15000, 20000, 0.72, 0.01, 0.03, 50.0, 4, 'Moderate', 'Very High',
    'Previous interns typically had 2+ prior internships and strong algorithms backgrounds.'
) ON CONFLICT (posting_id) DO NOTHING;

INSERT INTO legitimacy_flags (posting_id, flag_color, flag_text) VALUES
    (1, 'green',  'Compensation clearly disclosed (~$50/hr)'),
    (1, 'green',  'Structured 12-week program with dedicated mentors'),
    (1, 'green',  'Clear deliverables outlined in job description'),
    (1, 'yellow', '"Fast-paced environment" language may signal long hours'),
    (1, 'yellow', '"Must be comfortable with ambiguity" — genuine at Google scale')
ON CONFLICT DO NOTHING;

INSERT INTO required_skills (posting_id, skill_name, is_core) VALUES
    (1, 'Python',              TRUE),
    (1, 'Java',                TRUE),
    (1, 'Data Structures',     TRUE),
    (1, 'Algorithms',          TRUE),
    (1, 'Systems Design',      TRUE),
    (1, 'Distributed Systems', FALSE),
    (1, 'Go',                  FALSE)
ON CONFLICT (posting_id, skill_name) DO NOTHING;

INSERT INTO intern_reviews (company_id, source, rating, role_title, review_text, resume_value, management_style)
VALUES (
    1, 'glassdoor', 4.1, 'SWE Intern',
    'Great mentorship and real ownership of a product feature. Independence required — you drive your own project.',
    'Very High', 'Autonomous'
) ON CONFLICT DO NOTHING;

INSERT INTO interview_questions (company_id, question, category, source) VALUES
    (1, 'Merge intervals (greedy + sorting)',     'algorithms',    'glassdoor'),
    (1, 'Using hash maps for frequency problems', 'algorithms',    'glassdoor'),
    (1, 'Graph traversal — BFS/DFS variants',     'algorithms',    'leetcode discuss'),
    (1, 'Design a URL shortener',                 'system design', 'glassdoor')
ON CONFLICT DO NOTHING;

INSERT INTO company_reputation (company_id, overall_score, avg_intern_rating, return_offer_rate, alumni_outcome_note)
VALUES (1, 78, 4.1, 0.70, 'Strong placement across big tech, startups, and academia.')
ON CONFLICT (company_id) DO NOTHING;
