-- ============================================================
-- HireSense Database Schema
-- Platform: Supabase (PostgreSQL)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- 1. COMPANIES
-- Core info about each company. One row per company.
-- ============================================================
CREATE TABLE companies (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL UNIQUE,          -- "Google"
    description     TEXT,                          -- short blurb about the company
    industry        TEXT,                          -- "Technology", "Finance", etc.
    linkedin_url    TEXT,
    careers_url     TEXT,
    logo_url        TEXT,
    headquarters    TEXT,                          -- "Mountain View, CA"
    founded_year    INT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 2. JOB POSTINGS
-- Each internship posting linked to a company.
-- ============================================================
CREATE TABLE job_postings (
    id              SERIAL PRIMARY KEY,
    company_id      INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,                 -- "Software Engineering Intern"
    location        TEXT,                          -- "New York, NY"
    season          TEXT,                          -- "Summer", "Fall", "Spring"
    year            INT,                           -- 2026
    apply_url       TEXT,                          -- link to original posting
    source          TEXT,                          -- "simplify", "linkedin", "handshake", "manual"
    raw_description TEXT,                          -- full job description text (for AI analysis later)
    is_active       BOOLEAN DEFAULT TRUE,
    scraped_at      TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    -- prevent duplicate postings for same company+title+season
    UNIQUE(company_id, title, season, year)
);


-- ============================================================
-- 3. POSTING ANALYSIS
-- Computed/estimated stats for a specific posting.
-- One row per posting.
-- ============================================================
CREATE TABLE posting_analysis (
    id                      SERIAL PRIMARY KEY,
    posting_id              INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,

    -- Applicant estimates (ranges to avoid false precision)
    est_applicants_low      INT,                   -- 15000
    est_applicants_high     INT,                   -- 20000
    applicant_confidence    FLOAT,                 -- 0.0 to 1.0 (e.g. 0.72)
    applicant_source        TEXT,                  -- "LinkedIn + Handshake data"

    -- Acceptance rate
    accept_rate_low         FLOAT,                 -- 0.01 (1%)
    accept_rate_high        FLOAT,                 -- 0.03 (3%)

    -- Compensation
    compensation_hourly     FLOAT,                 -- 50.0
    compensation_notes      TEXT,                  -- "~$50/hr based on Glassdoor reports"

    -- Workload (1-6 scale to match your wireframe dots)
    workload_score          INT CHECK (workload_score BETWEEN 1 AND 6),
    workload_label          TEXT,                  -- "Moderate", "Intense", "Light"

    -- Selectivity label
    selectivity_label       TEXT,                  -- "Very High", "High", "Moderate", "Low"

    -- Typical background (free text, formatted like "Previous interns had...")
    typical_background      TEXT,

    updated_at              TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(posting_id)     -- one analysis per posting
);


-- ============================================================
-- 4. LEGITIMACY FLAGS
-- Red/yellow/green signals for a posting.
-- Multiple rows per posting (one per flag).
-- ============================================================
CREATE TABLE legitimacy_flags (
    id          SERIAL PRIMARY KEY,
    posting_id  INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    flag_color  TEXT NOT NULL CHECK (flag_color IN ('green', 'yellow', 'red')),
    flag_text   TEXT NOT NULL,                     -- "Compensation clearly disclosed"
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 5. REQUIRED SKILLS
-- Skills extracted from a posting's job description.
-- ============================================================
CREATE TABLE required_skills (
    id          SERIAL PRIMARY KEY,
    posting_id  INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    skill_name  TEXT NOT NULL,                     -- "Python", "Data Structures"
    is_core     BOOLEAN DEFAULT TRUE,              -- TRUE = required, FALSE = nice-to-have
    created_at  TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(posting_id, skill_name)
);


-- ============================================================
-- 6. INTERN REVIEWS
-- Scraped from Glassdoor, Blind, Reddit, etc.
-- Linked to company (not a specific posting — reviews are general).
-- ============================================================
CREATE TABLE intern_reviews (
    id              SERIAL PRIMARY KEY,
    company_id      INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    source          TEXT,                          -- "glassdoor", "blind", "reddit", "manual"
    rating          FLOAT CHECK (rating BETWEEN 1.0 AND 5.0),
    role_title      TEXT,                          -- "SWE Intern" (if available)
    review_text     TEXT,                          -- full review text
    workload_notes  TEXT,                          -- extracted workload-specific snippet
    management_style TEXT,                         -- "Autonomous", "Structured", etc.
    resume_value    TEXT,                          -- "Very High", "High", "Moderate"
    scraped_at      TIMESTAMPTZ DEFAULT NOW(),
    review_date     DATE                           -- when the review was originally posted
);


-- ============================================================
-- 7. INTERVIEW QUESTIONS
-- Common questions reported for a company.
-- ============================================================
CREATE TABLE interview_questions (
    id          SERIAL PRIMARY KEY,
    company_id  INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    question    TEXT NOT NULL,                     -- "Merge intervals"
    category    TEXT,                              -- "algorithms", "system design", "behavioral"
    source      TEXT,                              -- "glassdoor", "leetcode discuss", "manual"
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 8. COMPANY REPUTATION
-- High-level reputation signals per company.
-- One row per company (upserted when new data comes in).
-- ============================================================
CREATE TABLE company_reputation (
    id                  SERIAL PRIMARY KEY,
    company_id          INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    overall_score       INT CHECK (overall_score BETWEEN 0 AND 100),  -- e.g. 78
    avg_intern_rating   FLOAT,                     -- average of intern_reviews.rating
    return_offer_rate   FLOAT,                     -- 0.0 to 1.0 (e.g. 0.70 = 70%)
    alumni_outcome_note TEXT,                      -- "Strong placement in big tech + startups"
    prestige_note       TEXT,                      -- "Prestige is field-general, not niche"
    updated_at          TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id)
);


-- ============================================================
-- INDEXES
-- Speed up the most common lookups your Flask API will do
-- ============================================================
CREATE INDEX idx_job_postings_company    ON job_postings(company_id);
CREATE INDEX idx_job_postings_season     ON job_postings(season, year);
CREATE INDEX idx_legitimacy_posting      ON legitimacy_flags(posting_id);
CREATE INDEX idx_skills_posting          ON required_skills(posting_id);
CREATE INDEX idx_reviews_company         ON intern_reviews(company_id);
CREATE INDEX idx_questions_company       ON interview_questions(company_id);


-- ============================================================
-- SAMPLE SEED DATA
-- Run this to test your schema works before scraping anything
-- ============================================================

-- Seed one company
INSERT INTO companies (name, description, industry, linkedin_url, careers_url, headquarters)
VALUES (
    'Google',
    'Multinational technology company focused on search, cloud, and AI.',
    'Technology',
    'https://linkedin.com/company/google',
    'https://careers.google.com',
    'Mountain View, CA'
);

-- Seed one posting
INSERT INTO job_postings (company_id, title, location, season, year, apply_url, source)
VALUES (
    1,
    'Software Engineering Intern',
    'New York, NY',
    'Summer',
    2026,
    'https://careers.google.com/jobs/results/',
    'manual'
);

-- Seed its analysis
INSERT INTO posting_analysis (
    posting_id, est_applicants_low, est_applicants_high, applicant_confidence,
    accept_rate_low, accept_rate_high, compensation_hourly,
    workload_score, workload_label, selectivity_label, typical_background
) VALUES (
    1, 15000, 20000, 0.72,
    0.01, 0.03, 50.0,
    4, 'Moderate', 'Very High',
    'Previous interns typically had 2+ prior internships and strong algorithms backgrounds.'
);

-- Seed legitimacy flags
INSERT INTO legitimacy_flags (posting_id, flag_color, flag_text) VALUES
    (1, 'green',  'Compensation clearly disclosed (~$50/hr)'),
    (1, 'green',  'Structured 12-week program with dedicated mentors'),
    (1, 'green',  'Clear deliverables outlined in job description'),
    (1, 'yellow', '"Fast-paced environment" language may signal long hours'),
    (1, 'yellow', '"Must be comfortable with ambiguity" — genuine at Google scale');

-- Seed required skills
INSERT INTO required_skills (posting_id, skill_name, is_core) VALUES
    (1, 'Python',           TRUE),
    (1, 'Java',             TRUE),
    (1, 'Data Structures',  TRUE),
    (1, 'Algorithms',       TRUE),
    (1, 'Systems Design',   TRUE),
    (1, 'Distributed Systems', FALSE),
    (1, 'Go',               FALSE);

-- Seed a review
INSERT INTO intern_reviews (company_id, source, rating, role_title, review_text, resume_value, management_style)
VALUES (
    1, 'glassdoor', 4.1, 'SWE Intern',
    'Great mentorship and real ownership of a product feature. Independence required — you drive your own project.',
    'Very High', 'Autonomous'
);

-- Seed interview questions
INSERT INTO interview_questions (company_id, question, category, source) VALUES
    (1, 'Merge intervals (greedy + sorting)',        'algorithms',      'glassdoor'),
    (1, 'Using hash maps for frequency problems',    'algorithms',      'glassdoor'),
    (1, 'Graph traversal — BFS/DFS variants',        'algorithms',      'leetcode discuss'),
    (1, 'Design a URL shortener',                    'system design',   'glassdoor');

-- Seed reputation
INSERT INTO company_reputation (company_id, overall_score, avg_intern_rating, return_offer_rate, alumni_outcome_note)
VALUES (1, 78, 4.1, 0.70, 'Strong placement across big tech, startups, and academia.');