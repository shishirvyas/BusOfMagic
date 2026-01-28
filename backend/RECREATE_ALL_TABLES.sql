-- ========================================================================
-- MAGIC BUS - Complete Database Recreation Script
-- ========================================================================
-- Execute this script to recreate all tables from scratch
-- WARNING: This will DROP existing tables and data!
-- ========================================================================

-- ========================================================================
-- DROP EXISTING TABLES (in correct order due to foreign keys)
-- ========================================================================
DROP TABLE IF EXISTS candidate_answer CASCADE;
DROP TABLE IF EXISTS onboarding_question CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS onboarding_progress CASCADE;
DROP TABLE IF EXISTS otp_verification CASCADE;
DROP TABLE IF EXISTS candidate_languages CASCADE;
DROP TABLE IF EXISTS candidate_skills CASCADE;
DROP TABLE IF EXISTS education_details CASCADE;
DROP TABLE IF EXISTS personal_details CASCADE;
DROP TABLE IF EXISTS onboarding_step CASCADE;
DROP TABLE IF EXISTS candidate CASCADE;

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
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
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
    
    -- Questions Step Status
    questions_completed BOOLEAN DEFAULT FALSE,
    questions_completed_at TIMESTAMP,
    
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
-- 10. ONBOARDING_QUESTION TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS onboarding_question (
    id BIGSERIAL PRIMARY KEY,
    
    -- Question Details
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- TEXT, SINGLE_CHOICE, MULTIPLE_CHOICE, RATING
    question_category VARCHAR(100), -- Career, Personal, Skills, etc.
    description TEXT,
    
    -- For choice-based questions (stored as JSON array)
    options TEXT, -- JSON array: ["Option 1", "Option 2", "Option 3"]
    
    -- Validation & Configuration
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    
    -- Help text for users
    help_text VARCHAR(500),
    placeholder_text VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_onboarding_question_category ON onboarding_question(question_category);
CREATE INDEX IF NOT EXISTS idx_onboarding_question_type ON onboarding_question(question_type);
CREATE INDEX IF NOT EXISTS idx_onboarding_question_active ON onboarding_question(is_active);
CREATE INDEX IF NOT EXISTS idx_onboarding_question_order ON onboarding_question(display_order);

-- ========================================================================
-- 11. CANDIDATE_ANSWER TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS candidate_answer (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    
    -- Answer Details
    answer_text TEXT, -- For TEXT, SINGLE_CHOICE questions
    answer_array TEXT, -- For MULTIPLE_CHOICE (JSON array)
    rating_score INTEGER, -- For RATING questions (1-5 or 1-10)
    
    -- Metadata
    answer_confidence DECIMAL(3, 2), -- 0-1 scale for confidence
    is_partially_answered BOOLEAN DEFAULT FALSE,
    is_submitted BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES onboarding_question(id) ON DELETE CASCADE,
    UNIQUE(candidate_id, question_id) -- One answer per candidate per question
);

CREATE INDEX IF NOT EXISTS idx_candidate_answer_candidate ON candidate_answer(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_answer_question ON candidate_answer(question_id);
CREATE INDEX IF NOT EXISTS idx_candidate_answer_submitted ON candidate_answer(is_submitted);
CREATE INDEX IF NOT EXISTS idx_candidate_answer_answered_at ON candidate_answer(answered_at);

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
    (6, 'review', 'Review & Submit', 'Review and confirm your information', TRUE),
    (7, 'questions', 'Questions & Answers', 'Answer additional questions', TRUE)
ON CONFLICT (step_key) DO NOTHING;

-- ========================================================================
-- SEED DATA - Sample Questions
-- ========================================================================
INSERT INTO onboarding_question (
    question_text, 
    question_type, 
    question_category, 
    description, 
    options, 
    is_mandatory, 
    is_active, 
    display_order, 
    help_text, 
    placeholder_text
) VALUES
-- Career Questions
(
    'What is your primary career goal?',
    'SINGLE_CHOICE',
    'Career',
    'Help us understand your career aspirations',
    '["Software Development", "Data Science", "Product Management", "Business Development", "Other"]',
    TRUE,
    TRUE,
    1,
    'Select the career path that aligns best with your interests',
    'Select an option'
),
(
    'What industries interest you the most?',
    'MULTIPLE_CHOICE',
    'Career',
    'You can select multiple industries',
    '["Technology", "Finance", "Healthcare", "E-commerce", "Education", "Manufacturing", "Media & Entertainment"]',
    TRUE,
    TRUE,
    2,
    'You can select multiple options that interest you',
    'Select one or more options'
),
(
    'What is your preferred work environment?',
    'SINGLE_CHOICE',
    'Career',
    'Help us find the best fit for you',
    '["Startup", "Mid-sized Company", "Large Corporation", "Freelance/Self-employed", "No Preference"]',
    FALSE,
    TRUE,
    3,
    'Think about where you would be most productive and happy',
    'Select your preference'
),
-- Personal Development Questions
(
    'On a scale of 1-10, how would you rate your communication skills?',
    'RATING',
    'Personal Development',
    'Self-assess your current communication abilities',
    NULL,
    TRUE,
    TRUE,
    4,
    'Be honest about your current level; we will help you improve',
    ''
),
(
    'What areas of professional development are you most interested in?',
    'MULTIPLE_CHOICE',
    'Personal Development',
    'Select multiple areas if applicable',
    '["Leadership", "Technical Skills", "Communication", "Problem Solving", "Time Management", "Project Management"]',
    TRUE,
    TRUE,
    5,
    'These will help us tailor learning opportunities for you',
    'Select areas of interest'
),
-- Learning & Commitment Questions
(
    'How many hours per week can you dedicate to learning and development?',
    'SINGLE_CHOICE',
    'Learning',
    'Your commitment helps us plan better',
    '["Less than 5 hours", "5-10 hours", "10-15 hours", "15-20 hours", "More than 20 hours"]',
    TRUE,
    TRUE,
    6,
    'Consider your current work and personal commitments',
    'Select your availability'
),
(
    'What is your preferred learning style?',
    'SINGLE_CHOICE',
    'Learning',
    'Understanding how you learn best',
    '["Video Lectures", "Interactive Workshops", "Self-paced Reading", "Hands-on Projects", "Group Discussions", "Mixed approach"]',
    TRUE,
    TRUE,
    7,
    'Your preferred method helps us deliver content effectively',
    'Select your learning preference'
),
-- Open-ended Feedback
(
    'What are your expectations from this program?',
    'TEXT',
    'Expectations',
    'Share your hopes and expectations in your own words',
    NULL,
    TRUE,
    TRUE,
    8,
    'Tell us what you hope to achieve and learn',
    'Type your expectations here...'
),
(
    'Do you have any specific challenges or barriers we should know about?',
    'TEXT',
    'Challenges',
    'Help us understand any obstacles you might face',
    NULL,
    FALSE,
    TRUE,
    9,
    'This helps us provide better support and accommodations',
    'Describe any challenges (optional)...'
),
(
    'Tell us about a recent accomplishment you are proud of',
    'TEXT',
    'Personal',
    'We love hearing success stories',
    NULL,
    FALSE,
    TRUE,
    10,
    'Help us understand your strengths and capabilities',
    'Share a recent achievement (optional)...'
);

-- ========================================================================
-- VERIFY TABLES CREATED
-- ========================================================================
SELECT 'Tables created successfully!' AS status;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
