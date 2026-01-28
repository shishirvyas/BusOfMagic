-- ========================================================================
-- MAGIC BUS - Individual Signup & Onboarding Database Schema
-- ========================================================================
-- This script creates all necessary tables for the individual signup and
-- onboarding process. Execute this in PostgreSQL.
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
    gender VARCHAR(20) NOT NULL, -- MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    mother_tongue VARCHAR(100),
    religion VARCHAR(100),
    caste VARCHAR(100),
    marital_status VARCHAR(20), -- SINGLE, MARRIED, DIVORCED, WIDOWED
    
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
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED, REJECTED
    onboarding_status VARCHAR(50) DEFAULT 'INCOMPLETE', -- INCOMPLETE, IN_PROGRESS, COMPLETED
    
    -- Scoring & Engagement
    dropout_risk_score DECIMAL(5, 2) DEFAULT 0.0,
    engagement_score DECIMAL(5, 2) DEFAULT 0.0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for common queries
    CONSTRAINT candidate_check_gender CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')),
    CONSTRAINT candidate_check_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'REJECTED')),
    CONSTRAINT candidate_check_onboarding_status CHECK (onboarding_status IN ('INCOMPLETE', 'IN_PROGRESS', 'COMPLETED'))
);

CREATE INDEX idx_candidate_phone ON candidate(phone_number);
CREATE INDEX idx_candidate_email ON candidate(email);
CREATE INDEX idx_candidate_status ON candidate(status);
CREATE INDEX idx_candidate_onboarding_status ON candidate(onboarding_status);
CREATE INDEX idx_candidate_dropout_risk ON candidate(dropout_risk_score);
CREATE INDEX idx_candidate_engagement ON candidate(engagement_score);
CREATE INDEX idx_candidate_created_at ON candidate(created_at);
CREATE INDEX idx_candidate_city_state ON candidate(city, state);
CREATE INDEX idx_candidate_dob ON candidate(date_of_birth);

-- ========================================================================
-- 2. PERSONAL_DETAILS TABLE - Extended personal information
-- ========================================================================
CREATE TABLE IF NOT EXISTS personal_details (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL UNIQUE,
    
    -- Background & Employment
    employment_status VARCHAR(50), -- EMPLOYED, SELF_EMPLOYED, UNEMPLOYED, STUDENT
    current_job_title VARCHAR(255),
    current_company_name VARCHAR(255),
    years_of_experience DECIMAL(3, 1),
    previous_employers TEXT, -- JSON array
    
    -- Financial Information
    bank_account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    bank_name VARCHAR(255),
    account_holder_name VARCHAR(255),
    aadhar_verified BOOLEAN DEFAULT FALSE,
    
    -- Interests & Preferences
    career_interests TEXT, -- JSON array
    preferred_job_roles TEXT, -- JSON array
    preferred_locations TEXT, -- JSON array
    preferred_job_types VARCHAR(100), -- FULL_TIME, PART_TIME, INTERNSHIP, FREELANCE
    
    -- Personal Circumstances
    has_disability BOOLEAN DEFAULT FALSE,
    disability_type VARCHAR(255),
    is_first_generation_learner BOOLEAN DEFAULT FALSE,
    migration_status VARCHAR(50), -- RESIDENT, MIGRANT
    
    -- Availability
    earliest_join_date DATE,
    availability_to_relocate BOOLEAN DEFAULT FALSE,
    availability_for_internship BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    CONSTRAINT pd_check_employment_status CHECK (employment_status IN ('EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'STUDENT')),
    CONSTRAINT pd_check_job_types CHECK (preferred_job_types IN ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'FREELANCE')),
    CONSTRAINT pd_check_migration_status CHECK (migration_status IN ('RESIDENT', 'MIGRANT'))
);

CREATE INDEX idx_personal_details_candidate ON personal_details(candidate_id);
CREATE INDEX idx_personal_details_employment ON personal_details(employment_status);

-- ========================================================================
-- 3. EDUCATION_DETAILS TABLE - Complete educational background
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
    tenth_stream VARCHAR(50), -- SCIENCE, COMMERCE, ARTS
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
    graduation_status VARCHAR(50), -- PURSUING, COMPLETED, DROPPED
    
    -- Post-Graduation
    post_graduation_degree VARCHAR(100),
    post_graduation_year INTEGER,
    post_graduation_percentage DECIMAL(5, 2),
    post_graduation_university VARCHAR(255),
    post_graduation_status VARCHAR(50),
    
    -- Certifications & Additional Qualifications
    certifications TEXT, -- JSON array
    additional_qualifications TEXT, -- JSON array
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    CONSTRAINT ed_check_tenth_stream CHECK (tenth_stream IN ('SCIENCE', 'COMMERCE', 'ARTS')),
    CONSTRAINT ed_check_twelfth_stream CHECK (twelfth_stream IN ('SCIENCE', 'COMMERCE', 'ARTS')),
    CONSTRAINT ed_check_graduation_status CHECK (graduation_status IN ('PURSUING', 'COMPLETED', 'DROPPED')),
    CONSTRAINT ed_check_post_graduation_status CHECK (post_graduation_status IN ('PURSUING', 'COMPLETED', 'DROPPED'))
);

CREATE INDEX idx_education_details_candidate ON education_details(candidate_id);
CREATE INDEX idx_education_details_graduation_year ON education_details(graduation_year);

-- ========================================================================
-- 4. CANDIDATE_SKILLS TABLE - Skills possessed by candidate
-- ========================================================================
CREATE TABLE IF NOT EXISTS candidate_skills (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50), -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    years_of_experience DECIMAL(3, 1),
    verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    UNIQUE(candidate_id, skill_name),
    CONSTRAINT cs_check_proficiency CHECK (proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'))
);

CREATE INDEX idx_candidate_skills_candidate ON candidate_skills(candidate_id);
CREATE INDEX idx_candidate_skills_skill_name ON candidate_skills(skill_name);

-- ========================================================================
-- 5. CANDIDATE_LANGUAGES TABLE - Languages known by candidate
-- ========================================================================
CREATE TABLE IF NOT EXISTS candidate_languages (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    language_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50), -- BASIC, INTERMEDIATE, FLUENT
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    UNIQUE(candidate_id, language_name),
    CONSTRAINT cl_check_proficiency CHECK (proficiency_level IN ('BASIC', 'INTERMEDIATE', 'FLUENT'))
);

CREATE INDEX idx_candidate_languages_candidate ON candidate_languages(candidate_id);

-- ========================================================================
-- 6. ONBOARDING_PROGRESS TABLE - Track onboarding workflow
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
    current_step VARCHAR(50), -- signup, personal, education, skills, completed
    progress_percentage DECIMAL(3, 0) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE INDEX idx_onboarding_progress_candidate ON onboarding_progress(candidate_id);
CREATE INDEX idx_onboarding_progress_overall ON onboarding_progress(overall_completed);

-- ========================================================================
-- 7. OTP_VERIFICATION TABLE - Store OTP for email/phone verification
-- ========================================================================
CREATE TABLE IF NOT EXISTS otp_verification (
    id BIGSERIAL PRIMARY KEY,
    contact VARCHAR(255) NOT NULL,
    contact_type VARCHAR(20) NOT NULL, -- email, mobile
    otp_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 5,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL, -- OTP expires after 10 minutes
    verified_at TIMESTAMP,
    
    CONSTRAINT otpv_check_contact_type CHECK (contact_type IN ('EMAIL', 'PHONE'))
);

CREATE INDEX idx_otp_verification_contact ON otp_verification(contact);
CREATE INDEX idx_otp_verification_expires ON otp_verification(expires_at);

-- ========================================================================
-- 8. AUDIT_LOG TABLE - Track all changes for compliance
-- ========================================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT,
    action_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, VIEW
    entity_type VARCHAR(100) NOT NULL, -- candidate, personal_details, etc
    entity_id BIGINT,
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_log_candidate ON audit_log(candidate_id);
CREATE INDEX idx_audit_log_action ON audit_log(action_type);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ========================================================================
-- 9. ONBOARDING_STEP TABLE - Define onboarding flow steps
-- ========================================================================
CREATE TABLE IF NOT EXISTS onboarding_step (
    id BIGSERIAL PRIMARY KEY,
    step_order INTEGER NOT NULL,
    step_key VARCHAR(50) NOT NULL UNIQUE,
    step_name VARCHAR(100) NOT NULL,
    step_description TEXT,
    required_fields TEXT, -- JSON array
    validation_rules TEXT, -- JSON
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed onboarding steps
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
-- SUMMARY OF TABLES CREATED:
-- ========================================================================
-- 1. candidate - Core candidate information
-- 2. personal_details - Extended personal information
-- 3. education_details - Educational background
-- 4. candidate_skills - Skills with proficiency levels
-- 5. candidate_languages - Languages known
-- 6. onboarding_progress - Track onboarding workflow completion
-- 7. otp_verification - OTP management for verification
-- 8. audit_log - Audit trail for compliance
-- 9. onboarding_step - Define onboarding workflow steps
--
-- TOTAL TABLES: 9
-- ========================================================================

-- Grant permissions (if using a separate user)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO magicbus_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO magicbus_user;

-- Display confirmation
SELECT 'Individual Signup & Onboarding Tables Created Successfully!' AS status;
