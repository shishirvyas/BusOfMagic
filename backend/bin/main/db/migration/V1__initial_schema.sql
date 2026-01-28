-- ============================================================================
-- Magic Bus: AI-Powered Youth Onboarding Platform
-- Database Schema - Version 1.0
-- Tech Stack: PostgreSQL + Spring Boot
-- Purpose: Track candidate onboarding, engagement, dropout risk, and placement
-- ============================================================================

-- ============================================================================
-- 1. MOBILISATION_SOURCE
-- Tracks how candidates were sourced/recruited
-- ============================================================================
CREATE TABLE mobilisation_source (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    channel VARCHAR(50) NOT NULL,  -- DIRECT_WALK_IN, REFERRAL, SOCIAL_MEDIA, PARTNER_SCHOOL, EVENT, OTHER
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- ============================================================================
-- 2. CANDIDATE
-- Core candidate information and demographics
-- AI Fields: engagement_score, dropout_risk_score, recommendation_status
-- ============================================================================
CREATE TABLE candidate (
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
    gender VARCHAR(20) NOT NULL,  -- MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    mother_tongue VARCHAR(100),
    religion VARCHAR(100),
    caste VARCHAR(100),
    marital_status VARCHAR(20),  -- SINGLE, MARRIED, DIVORCED, WIDOWED
    
    -- Family Information
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(255),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    family_monthly_income DECIMAL(10, 2),
    number_of_siblings INTEGER,
    
    -- Mobilisation
    mobilisation_source_id BIGINT,
    mobilised_by VARCHAR(255),
    mobilisation_date DATE,
    
    -- Profile Status
    status VARCHAR(50) NOT NULL DEFAULT 'REGISTERED',  -- REGISTERED, ACTIVE, INACTIVE, GRADUATED, DROPOUT, PLACED
    profile_completion_percentage INTEGER DEFAULT 0,
    
    -- AI-Related Fields
    engagement_score DECIMAL(5, 2) DEFAULT 50.00,  -- 0-100: AI calculated engagement
    dropout_risk_score DECIMAL(5, 2) DEFAULT 0.00,  -- 0-100: AI predicted dropout risk
    risk_category VARCHAR(50) DEFAULT 'LOW',  -- LOW, MEDIUM, HIGH: Auto-calculated by AI
    recommendation_status VARCHAR(50),  -- AI recommendation: ONBOARD, MONITOR, INTERVENTION_NEEDED
    ai_prediction_date TIMESTAMP,
    ai_prediction_model_version VARCHAR(50),
    
    -- Activity Tracking
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    
    FOREIGN KEY (mobilisation_source_id) REFERENCES mobilisation_source(id),
    INDEX idx_candidate_phone (phone_number),
    INDEX idx_candidate_status (status),
    INDEX idx_candidate_dropout_risk (dropout_risk_score),
    INDEX idx_candidate_engagement (engagement_score)
);

-- ============================================================================
-- 3. EDUCATION_DETAILS
-- Candidate's educational background
-- ============================================================================
CREATE TABLE education_details (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    
    -- 10th Standard
    tenth_board VARCHAR(100),
    tenth_year_of_passing INTEGER,
    tenth_percentage DECIMAL(5, 2),
    tenth_marks_obtained DECIMAL(5, 2),
    tenth_marks_total DECIMAL(5, 2),
    tenth_stream VARCHAR(50),  -- SCIENCE, COMMERCE, ARTS
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
    
    -- Higher Education
    graduation_degree VARCHAR(100),
    graduation_specialization VARCHAR(100),
    graduation_year INTEGER,
    graduation_percentage DECIMAL(5, 2),
    graduation_university VARCHAR(255),
    graduation_status VARCHAR(50),  -- PURSUING, COMPLETED, DROPPED
    
    -- Post-Graduation
    post_graduation_degree VARCHAR(100),
    post_graduation_year INTEGER,
    post_graduation_percentage DECIMAL(5, 2),
    
    -- Skills & Certifications
    certifications TEXT,  -- JSON array of certifications
    languages_known VARCHAR(500),  -- JSON array
    
    -- AI Fields
    education_level_score DECIMAL(5, 2),  -- AI calculated education quality
    estimated_learning_capacity VARCHAR(50),  -- LOW, MEDIUM, HIGH
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    UNIQUE(candidate_id)
);

-- ============================================================================
-- 4. PERSONAL_DETAILS
-- Extended personal information and background
-- ============================================================================
CREATE TABLE personal_details (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    
    -- Background
    employment_status VARCHAR(50),  -- EMPLOYED, SELF_EMPLOYED, UNEMPLOYED, STUDENT
    current_job_title VARCHAR(255),
    current_company_name VARCHAR(255),
    years_of_experience DECIMAL(3, 1),
    previous_employers TEXT,  -- JSON array
    
    -- Financial Information
    bank_account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    bank_name VARCHAR(255),
    account_holder_name VARCHAR(255),
    aadhar_number VARCHAR(20),
    aadhar_verified BOOLEAN DEFAULT false,
    pan_number VARCHAR(20),
    
    -- Interests & Preferences
    career_interests TEXT,  -- JSON array of interests
    preferred_job_roles TEXT,  -- JSON array
    preferred_locations TEXT,  -- JSON array
    preferred_job_types VARCHAR(100),  -- FULL_TIME, PART_TIME, INTERNSHIP, FREELANCE
    
    -- Personal Circumstances
    has_disability BOOLEAN DEFAULT false,
    disability_type VARCHAR(255),
    is_first_generation_learner BOOLEAN DEFAULT false,
    migration_status VARCHAR(50),  -- RESIDENT, MIGRANT
    
    -- Availability
    earliest_join_date DATE,
    availability_to_relocate BOOLEAN DEFAULT false,
    availability_for_internship BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    UNIQUE(candidate_id)
);

-- ============================================================================
-- 5. ONBOARDING_STEP
-- Workflow steps for candidate onboarding
-- Tracks progress through the onboarding process
-- ============================================================================
CREATE TABLE onboarding_step (
    id BIGSERIAL PRIMARY KEY,
    
    step_name VARCHAR(100) NOT NULL,
    step_order INTEGER NOT NULL,
    step_key VARCHAR(50) NOT NULL UNIQUE,  -- PERSONAL_INFO, EDUCATION, SKILLS, ASSESSMENT, PROFILE_VERIFICATION, ORIENTATION
    
    description TEXT,
    category VARCHAR(50),  -- DATA_COLLECTION, ASSESSMENT, VERIFICATION, ORIENTATION, PLACEMENT
    is_mandatory BOOLEAN DEFAULT true,
    estimated_duration_days INTEGER,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. CANDIDATE_ONBOARDING_PROGRESS
-- Tracks candidate progress through onboarding steps
-- ============================================================================
CREATE TABLE candidate_onboarding_progress (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    onboarding_step_id BIGINT NOT NULL,
    
    -- Progress Status
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',  -- PENDING, IN_PROGRESS, COMPLETED, SKIPPED
    completion_percentage INTEGER DEFAULT 0,
    
    -- Timestamps
    started_date TIMESTAMP,
    completed_date TIMESTAMP,
    expected_completion_date TIMESTAMP,
    
    -- Metadata
    notes TEXT,
    assigned_to VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    FOREIGN KEY (onboarding_step_id) REFERENCES onboarding_step(id),
    UNIQUE(candidate_id, onboarding_step_id)
);

-- ============================================================================
-- 7. SKILL_ASSESSMENT
-- Tracks skill assessments and evaluations
-- AI Fields: skill_score, skill_gap_analysis
-- ============================================================================
CREATE TABLE skill_assessment (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    
    -- Assessment Details
    skill_name VARCHAR(100) NOT NULL,
    skill_category VARCHAR(100),  -- TECHNICAL, SOFT_SKILLS, BEHAVIORAL
    assessment_type VARCHAR(50),  -- SELF_ASSESSMENT, EXPERT_EVALUATION, AUTOMATED_TEST, PRACTICAL
    
    -- Scores
    max_score INTEGER DEFAULT 100,
    obtained_score INTEGER,
    skill_score DECIMAL(5, 2),  -- Normalized 0-100
    proficiency_level VARCHAR(50),  -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    
    -- AI Analysis
    skill_gap_analysis TEXT,  -- AI identified gaps
    improvement_suggestions TEXT,  -- AI recommendations
    learning_path_suggested VARCHAR(500),
    
    -- Timestamps
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_assessment_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessed_by VARCHAR(255),
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    INDEX idx_skill_assessment_skill (skill_name),
    INDEX idx_skill_assessment_score (skill_score)
);

-- ============================================================================
-- 8. ENGAGEMENT_EVENT
-- Tracks candidate's interactions with the platform/program
-- AI Fields: event_weight_for_engagement, engagement_trend
-- ============================================================================
CREATE TABLE engagement_event (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    
    -- Event Information
    event_type VARCHAR(100) NOT NULL,  -- COURSE_STARTED, COURSE_COMPLETED, QUIZ_ATTEMPTED, ASSIGNMENT_SUBMITTED,
                                       -- SESSION_ATTENDED, ASSESSMENT_COMPLETED, MATERIAL_VIEWED, CERTIFICATION_EARNED,
                                       -- MILESTONE_ACHIEVED, INTERACTION_WITH_MENTOR
    
    event_category VARCHAR(50),  -- LEARNING, ASSESSMENT, INTERACTION, CERTIFICATION, BEHAVIORAL
    event_description TEXT,
    
    -- Event Details
    reference_id VARCHAR(255),  -- Course ID, Quiz ID, etc.
    reference_type VARCHAR(100),  -- COURSE, QUIZ, ASSIGNMENT, SESSION, etc.
    
    -- AI-Related Fields
    engagement_weight_points DECIMAL(5, 2),  -- Points for engagement calculation
    sentiment_score DECIMAL(5, 2),  -- AI sentiment: positive/negative (-100 to 100)
    event_importance VARCHAR(50),  -- LOW, MEDIUM, HIGH: AI prioritized importance
    
    -- Metadata
    duration_minutes INTEGER,  -- How long the engagement lasted
    score_obtained DECIMAL(5, 2),  -- If applicable
    status VARCHAR(50),  -- INITIATED, COMPLETED, FAILED, IN_PROGRESS
    
    -- Timestamps
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_time TIME,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    INDEX idx_engagement_event_type (event_type),
    INDEX idx_engagement_event_date (event_date),
    INDEX idx_engagement_event_candidate (candidate_id, event_date)
);

-- ============================================================================
-- 9. DROPOUT_RISK
-- AI-predicted dropout risk and mitigation strategies
-- Core AI-powered feature for early intervention
-- ============================================================================
CREATE TABLE dropout_risk (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    
    -- Risk Assessment
    risk_score DECIMAL(5, 2) NOT NULL,  -- 0-100: Higher = Higher risk
    risk_category VARCHAR(50) NOT NULL,  -- LOW, MEDIUM, HIGH, CRITICAL
    
    -- Risk Factors (AI Analyzed)
    risk_factors TEXT NOT NULL,  -- JSON array of identified risk factors
    
    -- AI-Identified Risk Drivers
    engagement_decline_detected BOOLEAN DEFAULT false,
    attendance_decline_detected BOOLEAN DEFAULT false,
    assessment_performance_decline BOOLEAN DEFAULT false,
    social_engagement_decline BOOLEAN DEFAULT false,
    motivation_score DECIMAL(5, 2),  -- AI calculated motivation
    
    -- Risk Indicators
    days_since_last_activity INTEGER,
    missed_sessions_count INTEGER DEFAULT 0,
    failed_assessments_count INTEGER DEFAULT 0,
    incomplete_tasks_count INTEGER DEFAULT 0,
    
    -- Mitigation Strategies (AI Recommended)
    suggested_interventions TEXT,  -- JSON array of AI recommendations
    intervention_priority VARCHAR(50),  -- IMMEDIATE, URGENT, HIGH, MEDIUM, LOW
    
    -- Intervention Actions
    intervention_status VARCHAR(50),  -- NOT_STARTED, IN_PROGRESS, COMPLETED, MONITORING
    assigned_mentor_id BIGINT,
    
    -- Outcome Tracking
    risk_mitigated BOOLEAN DEFAULT false,
    outcome TEXT,  -- Success, Still at Risk, Dropped Out
    
    -- AI Model Information
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50),
    confidence_score DECIMAL(5, 2),  -- Model confidence 0-100
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessed_by VARCHAR(255),
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    INDEX idx_dropout_risk_score (risk_score),
    INDEX idx_dropout_risk_category (risk_category),
    INDEX idx_dropout_risk_status (intervention_status)
);

-- ============================================================================
-- 10. EMPLOYER
-- Employers who recruit candidates for placement
-- ============================================================================
CREATE TABLE employer (
    id BIGSERIAL PRIMARY KEY,
    
    -- Company Information
    company_name VARCHAR(255) NOT NULL UNIQUE,
    company_registration_number VARCHAR(100),
    
    -- Contact Information
    contact_person_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    hr_email VARCHAR(255),
    hr_phone VARCHAR(20),
    
    -- Company Details
    industry VARCHAR(100),
    company_size VARCHAR(50),  -- STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE
    established_year INTEGER,
    headquarters_location VARCHAR(255),
    website_url VARCHAR(500),
    
    -- Hiring Information
    number_of_openings INTEGER DEFAULT 0,
    recruitment_frequency VARCHAR(50),  -- ONGOING, QUARTERLY, ANNUAL, AD_HOC
    preferred_skill_sets TEXT,  -- JSON array
    preferred_educational_background TEXT,  -- JSON array
    
    -- Partnership Status
    partnership_status VARCHAR(50) DEFAULT 'ACTIVE',  -- ACTIVE, INACTIVE, SUSPENDED
    agreement_date DATE,
    
    -- Financial
    average_ctc_offered DECIMAL(10, 2),
    
    -- Metadata
    rating DECIMAL(3, 1),  -- Out of 5
    total_placements_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5, 2),  -- % of candidates who stayed > 6 months
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    
    INDEX idx_employer_status (partnership_status)
);

-- ============================================================================
-- 11. JOB_OPENING
-- Job positions available from employers
-- ============================================================================
CREATE TABLE job_opening (
    id BIGSERIAL PRIMARY KEY,
    employer_id BIGINT NOT NULL,
    
    -- Job Details
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT,
    job_type VARCHAR(50),  -- FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT
    
    -- Requirements
    required_skills TEXT,  -- JSON array
    required_qualifications TEXT,  -- JSON array
    minimum_experience_years DECIMAL(3, 1) DEFAULT 0,
    preferred_education VARCHAR(100),
    
    -- Compensation
    salary_range_min DECIMAL(10, 2),
    salary_range_max DECIMAL(10, 2),
    ctc DECIMAL(10, 2),
    
    -- Location
    job_location VARCHAR(255),
    is_remote BOOLEAN DEFAULT false,
    
    -- Opening Status
    number_of_positions INTEGER DEFAULT 1,
    positions_filled INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'OPEN',  -- OPEN, FILLED, CLOSED, ON_HOLD
    
    posted_date DATE DEFAULT CURRENT_DATE,
    closing_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employer_id) REFERENCES employer(id),
    INDEX idx_job_opening_status (status),
    INDEX idx_job_opening_closing_date (closing_date)
);

-- ============================================================================
-- 12. PLACEMENT
-- Candidate placements with employers
-- AI Fields: placement_probability, expected_retention_score
-- ============================================================================
CREATE TABLE placement (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    job_opening_id BIGINT NOT NULL,
    employer_id BIGINT NOT NULL,
    
    -- Placement Details
    placement_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',  -- PENDING, SELECTED, OFFERED, JOINED, COMPLETED, REJECTED, FAILED
    
    -- Salary & Compensation
    offered_ctc DECIMAL(10, 2),
    offered_base_salary DECIMAL(10, 2),
    offered_variable_pay DECIMAL(10, 2),
    
    -- Important Dates
    offered_date TIMESTAMP,
    joining_date DATE,
    probation_end_date DATE,
    contract_end_date DATE,
    
    -- AI Predictions
    placement_match_score DECIMAL(5, 2),  -- AI calculated job-candidate fit (0-100)
    expected_success_probability DECIMAL(5, 2),  -- AI predicted success %
    expected_retention_months INTEGER,  -- AI predicted months they'll stay
    expected_retention_score DECIMAL(5, 2),  -- 0-100 score
    
    -- Post-Placement Tracking
    is_currently_active BOOLEAN DEFAULT true,
    resignation_date TIMESTAMP,
    resignation_reason VARCHAR(255),
    total_months_employed DECIMAL(3, 1),
    performance_feedback TEXT,
    
    -- Satisfaction
    candidate_satisfaction_score DECIMAL(3, 1),  -- Out of 5
    employer_satisfaction_score DECIMAL(3, 1),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id),
    FOREIGN KEY (job_opening_id) REFERENCES job_opening(id),
    FOREIGN KEY (employer_id) REFERENCES employer(id),
    INDEX idx_placement_status (placement_status),
    INDEX idx_placement_candidate (candidate_id),
    INDEX idx_placement_active (is_currently_active)
);

-- ============================================================================
-- 13. MENTOR
-- Program mentors/coordinators who guide candidates
-- ============================================================================
CREATE TABLE mentor (
    id BIGSERIAL PRIMARY KEY,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    
    specialization TEXT,  -- JSON array of areas they mentor
    experience_years INTEGER,
    
    assigned_candidates_count INTEGER DEFAULT 0,
    
    status VARCHAR(50) DEFAULT 'ACTIVE',  -- ACTIVE, INACTIVE, ON_LEAVE
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 14. CANDIDATE_MENTOR_MAPPING
-- Maps candidates to mentors for guidance
-- ============================================================================
CREATE TABLE candidate_mentor_mapping (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    mentor_id BIGINT NOT NULL,
    
    assignment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    removal_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    mentor_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES mentor(id),
    UNIQUE(candidate_id, mentor_id)
);

-- ============================================================================
-- 15. INTERACTION_LOG
-- Tracks all interactions (calls, messages, meetings) with candidates
-- ============================================================================
CREATE TABLE interaction_log (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    
    interaction_type VARCHAR(50) NOT NULL,  -- CALL, MESSAGE, MEETING, EMAIL, FOLLOW_UP
    interaction_channel VARCHAR(50),  -- PHONE, WHATSAPP, EMAIL, IN_PERSON, VIDEO_CALL
    
    interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    
    purpose TEXT,
    summary TEXT,
    outcome VARCHAR(255),  -- POSITIVE, NEUTRAL, NEGATIVE, ACTION_REQUIRED
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP,
    
    conducted_by VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    INDEX idx_interaction_log_date (interaction_date),
    INDEX idx_interaction_log_type (interaction_type)
);

-- ============================================================================
-- 16. AUDIT_LOG
-- Tracks all system changes for compliance and monitoring
-- ============================================================================
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    
    entity_type VARCHAR(100) NOT NULL,  -- CANDIDATE, PLACEMENT, ASSESSMENT, etc.
    entity_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,  -- CREATE, UPDATE, DELETE, VIEW
    
    old_values TEXT,  -- JSON of previous values
    new_values TEXT,  -- JSON of new values
    changed_fields TEXT,  -- JSON array of fields changed
    
    performed_by VARCHAR(255),
    ip_address VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_audit_log_entity (entity_type, entity_id),
    INDEX idx_audit_log_timestamp (created_at)
);

-- ============================================================================
-- Indexes for Performance Optimization
-- ============================================================================

-- Candidate query optimization
CREATE INDEX idx_candidate_created_at ON candidate(created_at);
CREATE INDEX idx_candidate_city_state ON candidate(city, state);
CREATE INDEX idx_candidate_age ON candidate(date_of_birth);

-- Engagement analysis
CREATE INDEX idx_engagement_event_candidate_date ON engagement_event(candidate_id, event_date DESC);
CREATE INDEX idx_engagement_event_weight ON engagement_event(engagement_weight_points);

-- Dropout risk monitoring
CREATE INDEX idx_dropout_risk_prediction_date ON dropout_risk(prediction_date DESC);
CREATE INDEX idx_dropout_risk_assigned_mentor ON dropout_risk(assigned_mentor_id);

-- Placement tracking
CREATE INDEX idx_placement_candidate_status ON placement(candidate_id, placement_status);
CREATE INDEX idx_placement_joining_date ON placement(joining_date);
CREATE INDEX idx_placement_employer ON placement(employer_id);

-- Performance queries
CREATE INDEX idx_skill_assessment_candidate_score ON skill_assessment(candidate_id, skill_score DESC);
CREATE INDEX idx_onboarding_progress_status ON candidate_onboarding_progress(candidate_id, status);

-- ============================================================================
-- Views for Analytics and Reporting
-- ============================================================================

-- Dashboard Summary View
CREATE VIEW candidate_dashboard_summary AS
SELECT 
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    c.status,
    c.engagement_score,
    c.dropout_risk_score,
    c.risk_category,
    COUNT(DISTINCT de.id) as engagement_events_count,
    COUNT(DISTINCT sa.id) as assessments_count,
    COUNT(DISTINCT p.id) as placements_count,
    MAX(ee.event_date) as last_activity
FROM 
    candidate c
LEFT JOIN dropout_risk dr ON c.id = dr.candidate_id
LEFT JOIN engagement_event ee ON c.id = ee.candidate_id
LEFT JOIN education_details ed ON c.id = ed.candidate_id
LEFT JOIN skill_assessment sa ON c.id = sa.candidate_id
LEFT JOIN candidate_onboarding_progress cop ON c.id = cop.candidate_id
LEFT JOIN placement p ON c.id = p.candidate_id
GROUP BY 
    c.id, c.first_name, c.last_name, c.email, c.status, 
    c.engagement_score, c.dropout_risk_score, c.risk_category;

-- High Risk Candidates View
CREATE VIEW high_risk_candidates_view AS
SELECT 
    c.id,
    c.first_name,
    c.last_name,
    dr.risk_score,
    dr.risk_category,
    dr.risk_factors,
    dr.suggested_interventions,
    dr.intervention_priority,
    c.email,
    c.phone_number
FROM 
    candidate c
INNER JOIN dropout_risk dr ON c.id = dr.candidate_id
WHERE 
    dr.risk_category IN ('HIGH', 'CRITICAL')
    AND dr.intervention_status != 'COMPLETED'
ORDER BY 
    dr.risk_score DESC;

-- Placement Success Metrics View
CREATE VIEW placement_success_metrics AS
SELECT 
    e.company_name,
    COUNT(p.id) as total_placements,
    SUM(CASE WHEN p.is_currently_active = true THEN 1 ELSE 0 END) as currently_active,
    AVG(CAST(p.total_months_employed AS DECIMAL)) as avg_retention_months,
    AVG(p.candidate_satisfaction_score) as avg_candidate_satisfaction,
    AVG(p.employer_satisfaction_score) as avg_employer_satisfaction
FROM 
    placement p
INNER JOIN employer e ON p.employer_id = e.id
GROUP BY 
    e.company_name;

-- ============================================================================
-- End of Schema
-- ============================================================================
