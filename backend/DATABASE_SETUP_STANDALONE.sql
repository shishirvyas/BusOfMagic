-- ========================================================================
-- MAGIC BUS - Individual Signup & Onboarding Database Schema
-- Standalone SQL Script (Alternative to Migration)
-- ========================================================================
-- Execute this script directly in PostgreSQL if not using Flyway migrations
-- Database: magic_bus (or your configured database)
-- ========================================================================

-- ========================================================================
-- 1. CANDIDATE TABLE - Core user information
-- ========================================================================
CREATE TABLE IF NOT EXISTS candidate (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    alternate_phone VARCHAR(20),
    date_of_birth DATE NOT NULL,
    
    -- Address Information
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    
    -- Demographics
    gender VARCHAR(20) NOT NULL,
    mother_tongue VARCHAR(100),
    religion VARCHAR(100),
    caste VARCHAR(100),
    marital_status VARCHAR(20),
    
    -- Family Information
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(255),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    
    -- Identification Documents
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),
    
    -- Status & Tracking
    status VARCHAR(50) DEFAULT 'ACTIVE',
    onboarding_status VARCHAR(50) DEFAULT 'INCOMPLETE',
    
    -- Scoring & Engagement
    dropout_risk_score DECIMAL(5, 2) DEFAULT 0.0,
    engagement_score DECIMAL(5, 2) DEFAULT 0.0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidate_phone ON candidate(phone_number);
CREATE INDEX IF NOT EXISTS idx_candidate_email ON candidate(email);
CREATE INDEX IF NOT EXISTS idx_candidate_status ON candidate(status);
CREATE INDEX IF NOT EXISTS idx_candidate_onboarding_status ON candidate(onboarding_status);
CREATE INDEX IF NOT EXISTS idx_candidate_dropout_risk ON candidate(dropout_risk_score);
CREATE INDEX IF NOT EXISTS idx_candidate_engagement ON candidate(engagement_score);
CREATE INDEX IF NOT EXISTS idx_candidate_created_at ON candidate(created_at);
CREATE INDEX IF NOT EXISTS idx_candidate_city_state ON candidate(city, state);
CREATE INDEX IF NOT EXISTS idx_candidate_dob ON candidate(date_of_birth);

-- ========================================================================
-- 2. PERSONAL_DETAILS TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS personal_details (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL UNIQUE,
    
    -- Background & Employment
    employment_status VARCHAR(50),
    current_job_title VARCHAR(255),
    current_company_name VARCHAR(255),
    years_of_experience DECIMAL(3, 1),
    previous_employers TEXT,
    
    -- Financial Information
    bank_account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    bank_name VARCHAR(255),
    account_holder_name VARCHAR(255),
    aadhar_verified BOOLEAN DEFAULT FALSE,
    
    -- Interests & Preferences
    career_interests TEXT,
    preferred_job_roles TEXT,
    preferred_locations TEXT,
    preferred_job_types VARCHAR(100),
    
    -- Personal Circumstances
    has_disability BOOLEAN DEFAULT FALSE,
    disability_type VARCHAR(255),
    is_first_generation_learner BOOLEAN DEFAULT FALSE,
    migration_status VARCHAR(50),
    
    -- Availability
    earliest_join_date DATE,
    availability_to_relocate BOOLEAN DEFAULT FALSE,
    availability_for_internship BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_personal_details_candidate ON personal_details(candidate_id);
CREATE INDEX IF NOT EXISTS idx_personal_details_employment ON personal_details(employment_status);

-- ========================================================================
-- 3. EDUCATION_DETAILS TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS education_details (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL UNIQUE,
    
    -- 10th Standard
    tenth_board VARCHAR(100),
    tenth_year_of_passing INTEGER,
    tenth_percentage DECIMAL(5, 2),
    tenth_marks_obtained DECIMAL(5, 2),
    tenth_marks_total DECIMAL(5, 2),
    tenth_stream VARCHAR(50),
    tenth_school_name VARCHAR(255),
    tenth_school_location VARCHAR(255),
    
    -- 12th Standard
    twelfth_board VARCHAR(100),
    twelfth_year_of_passing INTEGER,
    twelfth_percentage DECIMAL(5, 2),
    twelfth_marks_obtained DECIMAL(5, 2),
    twelfth_marks_total DECIMAL(5, 2),
    twelfth_stream VARCHAR(50),
    twelfth_college_name VARCHAR(255),
    twelfth_college_location VARCHAR(255),
    
    -- Higher Education (Graduation)
    graduation_degree VARCHAR(100),
    graduation_specialization VARCHAR(100),
    graduation_year INTEGER,
    graduation_percentage DECIMAL(5, 2),
    graduation_university VARCHAR(255),
    graduation_status VARCHAR(50),
    
    -- Post-Graduation
    post_graduation_degree VARCHAR(100),
    post_graduation_year INTEGER,
    post_graduation_percentage DECIMAL(5, 2),
    post_graduation_university VARCHAR(255),
    post_graduation_status VARCHAR(50),
    
    -- Certifications & Additional Qualifications
    certifications TEXT,
    additional_qualifications TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_education_details_candidate ON education_details(candidate_id);
CREATE INDEX IF NOT EXISTS idx_education_details_graduation_year ON education_details(graduation_year);

-- ========================================================================
-- 4. CANDIDATE_SKILLS TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS candidate_skills (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    years_of_experience DECIMAL(3, 1),
    verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    UNIQUE(candidate_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_candidate_skills_candidate ON candidate_skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_skill_name ON candidate_skills(skill_name);

-- ========================================================================
-- 5. CANDIDATE_LANGUAGES TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS candidate_languages (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    language_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    UNIQUE(candidate_id, language_name)
);

CREATE INDEX IF NOT EXISTS idx_candidate_languages_candidate ON candidate_languages(candidate_id);

-- ========================================================================
-- 6. ONBOARDING_PROGRESS TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS onboarding_progress (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL UNIQUE,
    
    -- Signup Step Status
    signup_completed BOOLEAN DEFAULT FALSE,
    signup_completed_at TIMESTAMP,
    
    -- Personal Details Step Status
    personal_details_completed BOOLEAN DEFAULT FALSE,
    personal_details_completed_at TIMESTAMP,
    
    -- Education Details Step Status
    education_details_completed BOOLEAN DEFAULT FALSE,
    education_details_completed_at TIMESTAMP,
    
    -- Skills Step Status
    skills_completed BOOLEAN DEFAULT FALSE,
    skills_completed_at TIMESTAMP,
    
    -- Overall Status
    overall_completed BOOLEAN DEFAULT FALSE,
    overall_completed_at TIMESTAMP,
    
    -- Progress Tracking
    current_step VARCHAR(50),
    progress_percentage DECIMAL(3, 0) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_onboarding_progress_candidate ON onboarding_progress(candidate_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_overall ON onboarding_progress(overall_completed);

-- ========================================================================
-- 7. OTP_VERIFICATION TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS otp_verification (
    id BIGSERIAL PRIMARY KEY,
    contact VARCHAR(255) NOT NULL,
    contact_type VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 5,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_verification_contact ON otp_verification(contact);
CREATE INDEX IF NOT EXISTS idx_otp_verification_expires ON otp_verification(expires_at);

-- ========================================================================
-- 8. AUDIT_LOG TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_log_candidate ON audit_log(candidate_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);

-- ========================================================================
-- 9. ONBOARDING_STEP TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS onboarding_step (
    id BIGSERIAL PRIMARY KEY,
    step_order INTEGER NOT NULL,
    step_key VARCHAR(50) NOT NULL UNIQUE,
    step_name VARCHAR(100) NOT NULL,
    step_description TEXT,
    required_fields TEXT,
    validation_rules TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================================
-- SEED DATA - Onboarding Steps
-- ========================================================================
INSERT INTO onboarding_step (step_order, step_key, step_name, step_description, is_active)
VALUES
    (1, 'contact', 'Contact Information', 'Provide your email or mobile number', TRUE),
    (2, 'otp', 'OTP Verification', 'Verify your email or mobile number', TRUE),
    (3, 'personal', 'Personal Details', 'Complete your personal information', TRUE),
    (4, 'education', 'Education Details', 'Fill in your educational background', TRUE),
    (5, 'skills', 'Skills & Languages', 'Share your skills and languages', TRUE),
    (6, 'review', 'Review & Submit', 'Review and confirm your information', TRUE)
ON CONFLICT (step_key) DO NOTHING;

-- ========================================================================
-- VERIFY TABLES CREATED
-- ========================================================================
\echo '======================================================================'
\echo 'Individual Signup & Onboarding Tables Created Successfully!'
\echo '======================================================================'
\echo ''
\echo 'Tables Created:'
\echo '1. candidate'
\echo '2. personal_details'
\echo '3. education_details'
\echo '4. candidate_skills'
\echo '5. candidate_languages'
\echo '6. onboarding_progress'
\echo '7. otp_verification'
\echo '8. audit_log'
\echo '9. onboarding_step'
\echo ''

-- List all tables
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN (
    'candidate', 'personal_details', 'education_details',
    'candidate_skills', 'candidate_languages', 'onboarding_progress',
    'otp_verification', 'audit_log', 'onboarding_step'
)
ORDER BY tablename;

\echo ''
\echo 'All tables ready for use!'
\echo '======================================================================'
