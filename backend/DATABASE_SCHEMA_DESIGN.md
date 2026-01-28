# AI-Powered Youth Onboarding Platform - Database Schema Design

## 📋 Executive Summary

This comprehensive database schema is designed for a **Magic Bus-style NGO** skilling platform targeting youth aged 18-25. It integrates:

- ✅ Complete candidate lifecycle management
- ✅ AI-powered dropout risk prediction
- ✅ Engagement tracking and analysis
- ✅ Multi-step onboarding workflows
- ✅ Placement tracking and success metrics
- ✅ Mentor assignment and support

---

## 🎯 Design Principles

1. **AI-First Architecture**: Every core entity includes AI prediction fields
2. **Audit Trail**: All changes tracked for compliance
3. **Performance**: Indexed queries for analytics dashboards
4. **Scalability**: Designed for PostgreSQL with millions of records
5. **Flexibility**: JSON columns for evolving data structures

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────┐
│                    CANDIDATE (Core)                         │
├─────────────────────────────────────────────────────────────┤
│ id, firstName, lastName, email, phoneNumber                 │
│ dateOfBirth, address, city, state, pincode                  │
│ gender, caste, maritalStatus, religion                       │
│ familyMonthlyIncome, numberOfSiblings                        │
│ [AI Fields] engagement_score, dropout_risk_score            │
│             risk_category, recommendation_status             │
└────────┬────────────────────────────────────────────────────┘
         │ 1:1
         ├─ EDUCATION_DETAILS (academic records)
         ├─ PERSONAL_DETAILS (work, interests, preferences)
         ├─ SKILL_ASSESSMENT (skill evaluations)
         ├─ ENGAGEMENT_EVENT (activity tracking)
         ├─ DROPOUT_RISK (AI predictions)
         ├─ PLACEMENT (job placement tracking)
         └─ INTERACTION_LOG (mentor communications)

┌──────────────────────────────┐
│  ONBOARDING_STEP             │
├──────────────────────────────┤
│ Define workflow steps         │
│ Track candidate progress      │
└────────┬─────────────────────┘
         │ 1:Many
         └─ CANDIDATE_ONBOARDING_PROGRESS
            (tracks each candidate's step completion)

┌──────────────────────────────┐
│  EMPLOYER                     │
├──────────────────────────────┤
│ Company & partner info        │
└────────┬─────────────────────┘
         │ 1:Many
         └─ JOB_OPENING
            └─ 1:Many
               └─ PLACEMENT (candidate matched to job)

┌──────────────────────────────┐
│  MENTOR                       │
├──────────────────────────────┤
│ Program coordinators          │
└────────┬─────────────────────┘
         │ Many:Many
         └─ CANDIDATE_MENTOR_MAPPING
            └─ DROPOUT_RISK (mentor assigned to at-risk candidates)

┌──────────────────────────────┐
│  AUDIT_LOG                    │
├──────────────────────────────┤
│ Track all system changes      │
└──────────────────────────────┘
```

---

## 🗂️ Core Entities Detailed

### 1. **MOBILISATION_SOURCE**
Tracks how candidates were sourced/recruited

| Field | Type | Purpose |
|-------|------|---------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Source name (e.g., "School Partnership", "Social Media") |
| channel | VARCHAR(50) | DIRECT_WALK_IN, REFERRAL, SOCIAL_MEDIA, PARTNER_SCHOOL, EVENT, OTHER |
| description | TEXT | Channel description |
| is_active | BOOLEAN | Active/inactive status |

**Use Cases**:
- Analyze which recruitment channels are most effective
- Measure ROI of different mobilization strategies

---

### 2. **CANDIDATE** ⭐ (Central Entity)
Core candidate information with AI fields

#### Basic Information
| Field | Type | AI-Use |
|-------|------|--------|
| firstName, lastName | VARCHAR | Name tracking |
| email, phoneNumber | VARCHAR | Primary contacts |
| dateOfBirth | DATE | Age calculation, demographic analysis |
| gender, caste, religion | VARCHAR | Diversity reporting |
| maritalStatus | VARCHAR | Profile completion |

#### Demographics
| Field | Type | AI-Use |
|-------|------|--------|
| familyMonthlyIncome | DECIMAL | Socioeconomic status scoring |
| numberOfSiblings | INTEGER | Family structure analysis |
| guardianName, guardianPhone | VARCHAR | Emergency contact |

#### AI-Powered Fields
| Field | Type | Formula/Update |
|-------|------|--------|
| **engagement_score** | DECIMAL(5,2) | 0-100: Calculated from engagement events |
| **dropout_risk_score** | DECIMAL(5,2) | 0-100: ML model prediction |
| **risk_category** | VARCHAR(50) | LOW/MEDIUM/HIGH/CRITICAL: Derived from risk_score |
| **recommendation_status** | VARCHAR(50) | ONBOARD/MONITOR/INTERVENTION_NEEDED |
| **aiPredictionDate** | TIMESTAMP | When last prediction was made |
| **aiPredictionModelVersion** | VARCHAR(50) | Version of ML model used |

#### Activity Tracking
| Field | Type | Purpose |
|-------|------|---------|
| status | VARCHAR(50) | REGISTERED, ACTIVE, INACTIVE, GRADUATED, DROPOUT, PLACED |
| profileCompletionPercentage | INTEGER | 0-100: Profile completeness |
| lastLogin | TIMESTAMP | User activity tracking |
| loginCount | INTEGER | Engagement metric |

#### Indexes
- `idx_candidate_phone`: Fast lookup by phone
- `idx_candidate_status`: Filter by status
- `idx_candidate_dropout_risk`: Sort by risk score (dashboard)
- `idx_candidate_engagement`: Sort by engagement (AI sorting)
- `idx_candidate_city_state`: Geographic analytics
- `idx_candidate_age`: Age-based filtering

---

### 3. **EDUCATION_DETAILS**
Candidate's educational background (1:1 with Candidate)

#### 10th, 12th, Graduation Details
| Fields | Type | Purpose |
|--------|------|---------|
| tenthBoard, tenthYear, tenthPercentage | VARCHAR, INT, DECIMAL | 10th standard record |
| tenthStream, tenthSchoolName | VARCHAR | School details |
| [Similar for 12th & Graduation] | | Academic progression |

#### Higher Education
| Field | Type | AI-Use |
|-------|------|--------|
| graduationDegree | VARCHAR | Qualification level |
| graduationPercentage | DECIMAL | Academic performance |
| graduationStatus | VARCHAR | PURSUING/COMPLETED/DROPPED |
| postGraduationDegree | VARCHAR | Advanced qualification |

#### Skills & Certifications
| Field | Type | Purpose |
|-------|------|---------|
| certifications | TEXT | JSON: List of certifications |
| languagesKnown | VARCHAR(500) | JSON: Languages spoken |

#### AI Fields
| Field | Type | Purpose |
|-------|------|---------|
| **educationLevelScore** | DECIMAL | 0-100: Quality of education |
| **estimatedLearningCapacity** | VARCHAR | LOW/MEDIUM/HIGH: AI prediction |

---

### 4. **PERSONAL_DETAILS**
Extended personal & professional information (1:1 with Candidate)

#### Employment Background
| Field | Type | AI-Use |
|-------|------|--------|
| employmentStatus | VARCHAR | EMPLOYED, SELF_EMPLOYED, UNEMPLOYED, STUDENT |
| currentJobTitle | VARCHAR | Job role |
| yearsOfExperience | DECIMAL | Experience level |
| previousEmployers | TEXT | JSON array of past employers |

#### Financial Information
| Field | Type | Purpose |
|-------|------|---------|
| bankAccountNumber | VARCHAR | Payment details |
| ifscCode | VARCHAR | Bank routing |
| aadharNumber | VARCHAR | Identity verification |
| panNumber | VARCHAR | Tax ID |

#### Career Preferences
| Field | Type | AI-Use |
|-------|------|--------|
| careerInterests | TEXT | JSON: Domains of interest |
| preferredJobRoles | TEXT | JSON: Desired positions |
| preferredLocations | TEXT | JSON: Geographic preference |
| preferredJobTypes | VARCHAR | FULL_TIME, PART_TIME, INTERNSHIP, FREELANCE |

#### Special Circumstances
| Field | Type | AI-Use |
|-------|------|--------|
| hasDisability | BOOLEAN | Inclusive hiring flag |
| isFirstGenerationLearner | BOOLEAN | Supportive intervention |
| migrationStatus | VARCHAR | RESIDENT/MIGRANT |

#### Availability
| Field | Type | Purpose |
|-------|------|---------|
| earliestJoinDate | DATE | Placement planning |
| availabilityToRelocate | BOOLEAN | Job matching |
| availabilityForInternship | BOOLEAN | Opportunity matching |

---

### 5. **ONBOARDING_STEP**
Defines the workflow steps for candidate onboarding

| Field | Type | Purpose |
|-------|------|---------|
| stepName | VARCHAR | "Personal Information", "Education Details", etc. |
| stepOrder | INTEGER | Sequence in workflow (1, 2, 3, ...) |
| stepKey | VARCHAR | PERSONAL_INFO, EDUCATION, SKILLS, ASSESSMENT, PROFILE_VERIFICATION, ORIENTATION |
| category | VARCHAR | DATA_COLLECTION, ASSESSMENT, VERIFICATION, ORIENTATION, PLACEMENT |
| isMandatory | BOOLEAN | Is this step required? |
| estimatedDurationDays | INTEGER | Expected time to complete |

**Example Workflow**:
```
Step 1: PERSONAL_INFO (Data Collection, 1 day)
Step 2: EDUCATION (Data Collection, 1 day)
Step 3: SKILLS (Assessment, 2 days)
Step 4: PROFILE_VERIFICATION (Verification, 1 day)
Step 5: ORIENTATION (Training, 3 days)
Step 6: PLACEMENT (Placement, 30 days)
```

---

### 6. **CANDIDATE_ONBOARDING_PROGRESS**
Tracks each candidate's progress through the onboarding workflow

| Field | Type | Purpose |
|-------|------|---------|
| candidateId | BIGINT | Foreign key to Candidate |
| onboardingStepId | BIGINT | Foreign key to OnboardingStep |
| status | VARCHAR | PENDING, IN_PROGRESS, COMPLETED, SKIPPED |
| completionPercentage | INTEGER | 0-100: Step progress |
| startedDate | TIMESTAMP | When candidate started |
| completedDate | TIMESTAMP | When candidate finished |
| expectedCompletionDate | TIMESTAMP | SLA deadline |
| assignedTo | VARCHAR | Mentor/coordinator |

**Use Cases**:
- Track onboarding completion rates
- Identify bottleneck steps
- Send reminders for pending steps
- Monitor SLA compliance

---

### 7. **SKILL_ASSESSMENT**
Tracks skill evaluations and improvements

| Field | Type | AI-Use |
|-------|------|--------|
| candidateId | BIGINT | Which candidate |
| skillName | VARCHAR | e.g., "JavaScript", "Communication" |
| skillCategory | VARCHAR | TECHNICAL, SOFT_SKILLS, BEHAVIORAL |
| assessmentType | VARCHAR | SELF_ASSESSMENT, EXPERT_EVALUATION, AUTOMATED_TEST, PRACTICAL |

#### Scores
| Field | Type | Purpose |
|-------|------|---------|
| maxScore | INTEGER | 100 or custom |
| obtainedScore | INTEGER | Raw score |
| skillScore | DECIMAL | Normalized 0-100 |
| proficiencyLevel | VARCHAR | BEGINNER, INTERMEDIATE, ADVANCED, EXPERT |

#### AI Analysis
| Field | Type | Purpose |
|-------|------|---------|
| **skillGapAnalysis** | TEXT | AI identified gaps vs. job requirement |
| **improvementSuggestions** | TEXT | AI recommendations for skill development |
| **learningPathSuggested** | VARCHAR | AI recommended courses/modules |
| nextAssessmentDate | TIMESTAMP | When to reassess |

**AI Features**:
- Compare candidate skills with job requirements
- Generate personalized learning paths
- Predict skill development trajectory
- Identify critical skill gaps

---

### 8. **ENGAGEMENT_EVENT** ⭐ (AI-Critical)
Core entity for tracking all candidate interactions

| Field | Type | Purpose |
|-------|------|---------|
| candidateId | BIGINT | Which candidate |
| eventType | VARCHAR | COURSE_STARTED, COURSE_COMPLETED, QUIZ_ATTEMPTED, ASSIGNMENT_SUBMITTED, SESSION_ATTENDED, etc. |
| eventCategory | VARCHAR | LEARNING, ASSESSMENT, INTERACTION, CERTIFICATION, BEHAVIORAL |
| eventDescription | TEXT | Event details |

#### Event Details
| Field | Type | Purpose |
|-------|------|---------|
| referenceId | VARCHAR | Course ID, Quiz ID, etc. |
| referenceType | VARCHAR | COURSE, QUIZ, ASSIGNMENT, SESSION, etc. |
| durationMinutes | INTEGER | How long engagement lasted |
| scoreObtained | DECIMAL | If applicable (test scores) |
| status | VARCHAR | INITIATED, COMPLETED, FAILED, IN_PROGRESS |

#### AI-Related Fields
| Field | Type | Purpose |
|-------|------|---------|
| **engagementWeightPoints** | DECIMAL | Points for engagement calculation |
| **sentimentScore** | DECIMAL | -100 to 100: AI sentiment analysis |
| **eventImportance** | VARCHAR | LOW/MEDIUM/HIGH: AI prioritized |
| eventDate | TIMESTAMP | When event occurred |

**AI Use Cases**:
- Calculate engagement_score = SUM(engagementWeightPoints) for candidate
- Detect engagement_decline by comparing recent vs. historical data
- Sentiment analysis to identify disengagement
- Predict dropout based on engagement patterns

**Event Examples**:
```json
{
  "eventType": "COURSE_COMPLETED",
  "referenceId": "PYTHON_101",
  "engagementWeightPoints": 25.0,
  "sentimentScore": 85.0,
  "eventImportance": "HIGH"
}
```

---

### 9. **DROPOUT_RISK** ⭐ (Core AI Entity)
AI-powered early warning system for at-risk candidates

#### Risk Assessment
| Field | Type | Formula |
|-------|------|---------|
| **riskScore** | DECIMAL | 0-100: ML model output |
| **riskCategory** | VARCHAR | LOW/MEDIUM/HIGH/CRITICAL: Based on riskScore |
| **riskFactors** | TEXT | JSON: [" low_engagement", "poor_attendance", ...] |

#### AI-Identified Risk Drivers
| Field | Type | Calculation |
|-------|------|-------------|
| **engagementDeclineDetected** | BOOLEAN | engagement_score trend < threshold |
| **attendanceDeclineDetected** | BOOLEAN | missed_sessions_count > threshold |
| **assessmentPerformanceDecline** | BOOLEAN | failed_assessments_count > threshold |
| **socialEngagementDecline** | BOOLEAN | no INTERACTION_LOG in 7 days |
| **motivationScore** | DECIMAL | 0-100: AI calculated |
| daysSinceLastActivity | INTEGER | CURRENT_DATE - MAX(engagement_event.eventDate) |
| missedSessionsCount | INTEGER | Count of missed sessions |
| failedAssessmentsCount | INTEGER | Count of failed tests |
| incompleteTasksCount | INTEGER | Count of incomplete tasks |

#### Mitigation Strategies (AI Recommended)
| Field | Type | Purpose |
|-------|------|---------|
| **suggestedInterventions** | TEXT | JSON: ["increase_mentor_contact", "skill_gap_training", ...] |
| **interventionPriority** | VARCHAR | IMMEDIATE/URGENT/HIGH/MEDIUM/LOW |
| interventionStatus | VARCHAR | NOT_STARTED, IN_PROGRESS, COMPLETED, MONITORING |
| assignedMentor | BIGINT | Mentor assigned |

#### Outcome Tracking
| Field | Type | Purpose |
|-------|------|---------|
| riskMitigated | BOOLEAN | Was dropout prevented? |
| outcome | TEXT | "Success", "Still at Risk", "Dropped Out" |

#### AI Model Information
| Field | Type | Purpose |
|-------|------|---------|
| **predictionDate** | TIMESTAMP | When prediction made |
| **modelVersion** | VARCHAR | ML model version (e.g., "v2.1") |
| **confidenceScore** | DECIMAL | Model confidence 0-100 |
| assessedBy | VARCHAR | Which system/person |

**Example Dropout Risk Record**:
```json
{
  "riskScore": 78.5,
  "riskCategory": "HIGH",
  "riskFactors": ["engagement_decline_20%", "attendance_50%", "no_activity_10_days"],
  "engagementDeclineDetected": true,
  "attendanceDeclineDetected": true,
  "motivationScore": 35.0,
  "suggestedInterventions": ["1:1_mentoring", "skill_remediation", "peer_group_support"],
  "interventionPriority": "URGENT",
  "modelVersion": "v2.1",
  "confidenceScore": 87.3
}
```

**AI Workflow**:
1. Daily batch job calculates engagement_score for all candidates
2. Daily batch job runs dropout risk prediction model
3. If risk_score > 60, create/update DropoutRisk record
4. If risk_category = HIGH/CRITICAL, trigger intervention workflow
5. Assign mentor if not already assigned
6. Track intervention effectiveness

---

### 10. **EMPLOYER**
Partner companies that recruit candidates

| Field | Type | Purpose |
|-------|------|---------|
| companyName | VARCHAR | Official company name |
| companyRegistrationNumber | VARCHAR | GST/CIN number |
| contactPersonName | VARCHAR | HR contact |
| contactEmail, contactPhone | VARCHAR | Contact details |

#### Company Details
| Field | Type | Purpose |
|-------|------|---------|
| industry | VARCHAR | IT, Manufacturing, Services, etc. |
| companySize | VARCHAR | STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE |
| establishedYear | INTEGER | Company age |
| websiteUrl | VARCHAR | Company website |

#### Hiring Information
| Field | Type | Purpose |
|-------|------|---------|
| numberOfOpenings | INTEGER | Active positions |
| recruitmentFrequency | VARCHAR | ONGOING, QUARTERLY, ANNUAL, AD_HOC |
| preferredSkillSets | TEXT | JSON: Required skills |
| preferredEducationalBackground | TEXT | JSON: Education requirements |

#### Partnership Metrics
| Field | Type | Purpose |
|-------|------|---------|
| partnershipStatus | VARCHAR | ACTIVE, INACTIVE, SUSPENDED |
| averageCTCOffered | DECIMAL | Average salary offered |
| rating | DECIMAL | Out of 5: Partnership quality |
| totalPlacementsCount | INTEGER | Number of candidates placed |
| successRate | DECIMAL | % who stayed > 6 months |

---

### 11. **JOB_OPENING**
Specific job positions available

| Field | Type | Purpose |
|-------|------|---------|
| employerId | BIGINT | Which employer |
| jobTitle | VARCHAR | Position title |
| jobDescription | TEXT | Detailed description |
| jobType | VARCHAR | FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT |

#### Requirements
| Field | Type | Purpose |
|-------|------|---------|
| requiredSkills | TEXT | JSON: Technical skills needed |
| requiredQualifications | TEXT | JSON: Education/certifications |
| minimumExperienceYears | DECIMAL | Years required |
| preferredEducation | VARCHAR | Preferred degree |

#### Compensation
| Field | Type | Purpose |
|-------|------|---------|
| salaryRangeMin, salaryRangeMax | DECIMAL | Salary band |
| ctc | DECIMAL | Total compensation |

#### Location & Status
| Field | Type | Purpose |
|-------|------|---------|
| jobLocation | VARCHAR | City/office |
| isRemote | BOOLEAN | Remote eligible |
| numberOfPositions | INTEGER | Openings |
| positionsFilled | INTEGER | Filled count |
| status | VARCHAR | OPEN, FILLED, CLOSED, ON_HOLD |
| closingDate | DATE | Application deadline |

---

### 12. **PLACEMENT** ⭐ (Outcome Tracking)
Candidate placements with employers - **KEY PERFORMANCE INDICATOR**

| Field | Type | Purpose |
|-------|------|---------|
| candidateId | BIGINT | Candidate placed |
| jobOpeningId | BIGINT | Position filled |
| employerId | BIGINT | Employer |

#### Placement Status
| Field | Type | Purpose |
|-------|------|---------|
| placementStatus | VARCHAR | PENDING, SELECTED, OFFERED, JOINED, COMPLETED, REJECTED, FAILED |
| offeredDate | TIMESTAMP | Offer date |
| joiningDate | DATE | First day of work |

#### Compensation
| Field | Type | Purpose |
|-------|------|---------|
| offeredCTC | DECIMAL | Salary offered |
| offeredBaseSalary | DECIMAL | Base component |
| offeredVariablePay | DECIMAL | Variable component |

#### AI Predictions
| Field | Type | Purpose |
|-------|------|---------|
| **placementMatchScore** | DECIMAL | 0-100: Job-candidate fit |
| **expectedSuccessProbability** | DECIMAL | 0-100: AI predicted success % |
| **expectedRetentionMonths** | INTEGER | Predicted tenure |
| **expectedRetentionScore** | DECIMAL | 0-100: Retention likelihood |

#### Post-Placement Tracking
| Field | Type | Purpose |
|-------|------|---------|
| isCurrentlyActive | BOOLEAN | Still employed? |
| resignationDate | TIMESTAMP | When left job |
| resignationReason | VARCHAR | Why they left |
| totalMonthsEmployed | DECIMAL | Duration in role |
| performanceFeedback | TEXT | Employer feedback |

#### Satisfaction Metrics
| Field | Type | Purpose |
|-------|------|---------|
| candidateSatisfactionScore | DECIMAL | Out of 5: Job satisfaction |
| employerSatisfactionScore | DECIMAL | Out of 5: Performance rating |

**Example Placement Success**:
```
Candidate: Ravi Kumar
Job: Python Developer
Employer: TCS
Placement Status: JOINED
Expected Retention: 24 months
Actual: 18 months (success - stayed >6 months)
Salary: ₹6,50,000 CTC
```

---

### 13. **MENTOR**
Program mentors/coordinators guiding candidates

| Field | Type | Purpose |
|-------|------|---------|
| firstName, lastName | VARCHAR | Mentor name |
| email | VARCHAR | Contact |
| phone | VARCHAR | Mobile |
| specialization | TEXT | JSON: Areas they mentor |
| experienceYears | INTEGER | Years of experience |
| assignedCandidatesCount | INTEGER | Current mentees |
| status | VARCHAR | ACTIVE, INACTIVE, ON_LEAVE |

---

### 14. **CANDIDATE_MENTOR_MAPPING**
Many-to-many relationship between candidates and mentors

| Field | Type | Purpose |
|-------|------|---------|
| candidateId | BIGINT | Candidate |
| mentorId | BIGINT | Assigned mentor |
| assignmentDate | TIMESTAMP | When assigned |
| removalDate | TIMESTAMP | When unassigned (if applicable) |
| isActive | BOOLEAN | Current assignment? |
| mentorNotes | TEXT | Mentor observations |

---

### 15. **INTERACTION_LOG**
Track all mentor-candidate interactions

| Field | Type | Purpose |
|-------|------|---------|
| candidateId | BIGINT | Candidate |
| interactionType | VARCHAR | CALL, MESSAGE, MEETING, EMAIL, FOLLOW_UP |
| interactionChannel | VARCHAR | PHONE, WHATSAPP, EMAIL, IN_PERSON, VIDEO_CALL |
| interactionDate | TIMESTAMP | When it happened |
| durationMinutes | INTEGER | Length of interaction |
| purpose | TEXT | Why interaction occurred |
| summary | TEXT | What was discussed |
| outcome | VARCHAR | POSITIVE, NEUTRAL, NEGATIVE, ACTION_REQUIRED |
| followUpRequired | BOOLEAN | Needs follow-up? |
| followUpDate | TIMESTAMP | When to follow up |
| conductedBy | VARCHAR | Mentor/coordinator name |

**Use Cases**:
- Track mentor engagement frequency
- Measure intervention effectiveness
- Calculate social engagement for AI scoring

---

### 16. **AUDIT_LOG**
Track all system changes for compliance

| Field | Type | Purpose |
|-------|------|---------|
| entityType | VARCHAR | CANDIDATE, PLACEMENT, ASSESSMENT, etc. |
| entityId | BIGINT | Which entity was changed |
| actionType | VARCHAR | CREATE, UPDATE, DELETE, VIEW |
| oldValues | TEXT | JSON of previous values |
| newValues | TEXT | JSON of new values |
| changedFields | TEXT | JSON array of changed fields |
| performedBy | VARCHAR | Who made the change |
| ipAddress | VARCHAR | From where |
| createdAt | TIMESTAMP | When changed |

**Audit Example**:
```json
{
  "entityType": "CANDIDATE",
  "entityId": 1001,
  "actionType": "UPDATE",
  "changedFields": ["email", "phone_number"],
  "oldValues": {"email": "old@example.com", "phone": "9999999999"},
  "newValues": {"email": "new@example.com", "phone": "8888888888"},
  "performedBy": "mentor_ravi",
  "ipAddress": "192.168.1.1"
}
```

---

## 🎯 AI Features & Fields Summary

### Engagement Scoring System
**Formula**: engagement_score = SUM(engagement_event.engagementWeightPoints)

| Event | Points | Example |
|-------|--------|---------|
| Course Started | 5 | +5 |
| Course Completed | 25 | +25 |
| Quiz Attempted | 10 | +10 |
| Quiz Passed | 15 | +15 |
| Assignment Submitted | 10 | +10 |
| Session Attended | 5 | +5 |
| Certification Earned | 30 | +30 |

**Engagement Score Bands**:
- 0-25: Very Low
- 26-50: Low
- 51-75: Moderate
- 76-100: High

### Dropout Risk Prediction Model

**Inputs**:
1. engagement_decline_detected (boolean)
2. attendance_decline_detected (boolean)
3. assessment_performance_decline (boolean)
4. social_engagement_decline (boolean)
5. motivation_score (0-100)
6. days_since_last_activity (integer)
7. education_level_score (0-100)
8. family_monthly_income (numeric)
9. number_of_failed_assessments (integer)
10. missing_interactions_days (integer)

**Output**:
- dropout_risk_score: 0-100
- risk_category: LOW/MEDIUM/HIGH/CRITICAL
- suggested_interventions: [action1, action2, ...]
- intervention_priority: IMMEDIATE/URGENT/HIGH/MEDIUM/LOW
- confidence_score: 0-100

### Placement Match Scoring

**Inputs**:
- candidate skill_scores
- job required_skills
- candidate preferred_locations vs job_location
- candidate preferred_salary vs offered_ctc
- candidate experience vs job requirement

**Output**:
- placement_match_score: 0-100
- expected_success_probability: 0-100
- expected_retention_months: integer

---

## 📈 Analytics Views

### 1. Candidate Dashboard Summary View
```sql
SELECT
  candidate_id, name, email, status,
  engagement_score, dropout_risk_score, risk_category,
  COUNT(engagement_events) as engagement_count,
  COUNT(assessments) as assessment_count,
  COUNT(placements) as placement_count,
  MAX(last_event_date) as last_activity
FROM candidate_dashboard_summary
GROUP BY candidate_id
```

### 2. High-Risk Candidates View
Candidates with risk_category IN ('HIGH', 'CRITICAL')

```sql
SELECT
  c.id, c.name, dr.risk_score, dr.risk_factors,
  dr.suggested_interventions, dr.intervention_priority,
  m.mentor_name
FROM high_risk_candidates_view
LEFT JOIN mentor m ON dr.assigned_mentor_id = m.id
ORDER BY risk_score DESC
```

### 3. Placement Success Metrics
```sql
SELECT
  e.company_name,
  COUNT(*) as total_placements,
  SUM(CASE WHEN is_currently_active THEN 1 ELSE 0 END) as active_placements,
  AVG(total_months_employed) as avg_retention_months,
  AVG(candidate_satisfaction) as avg_satisfaction
FROM placement_success_metrics
GROUP BY company_name
ORDER BY success_rate DESC
```

---

## 🔧 Database Setup

### PostgreSQL Configuration
```sql
-- Install required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "json";

-- Create database
CREATE DATABASE magic_bus_onboarding 
  ENCODING 'UTF8'
  LOCALE 'en_US.UTF-8';

-- Run migrations
psql magic_bus_onboarding < V1__initial_schema.sql
```

### Spring Boot Configuration
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/magic_bus_onboarding
    username: postgres
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate  # Don't auto-create, use migrations
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQL10Dialect
        format_sql: true
  flyway:
    locations: classpath:db/migration
    baseline-on-migrate: true
```

---

## 📊 Key Metrics & KPIs

### Candidate Metrics
- **Onboarding Completion Rate**: % candidates completing all steps
- **Engagement Score**: Average engagement across cohort
- **Dropout Rate**: % candidates who dropped out
- **Placement Rate**: % candidates placed within X months
- **Placement Success Rate**: % placements retained > 6 months

### Employer Metrics
- **Hiring Volume**: Positions filled per quarter
- **Time to Fill**: Average days to fill position
- **Candidate Retention**: % candidates retained
- **Satisfaction Score**: Average employer satisfaction

### Program Metrics
- **Cost per Placement**: Total program cost / number of placements
- **Time to Placement**: Average days from enrollment to placement
- **Salary Growth**: Average salary offered vs market
- **ROI**: Program revenue / total investment

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation
- [x] Core schema design
- [x] JPA entity classes
- [x] Database migrations
- [ ] Create repositories (Spring Data)
- [ ] Basic CRUD APIs

### Phase 2: Onboarding Workflow
- [ ] Implement onboarding step service
- [ ] Create progress tracking API
- [ ] Dashboard backend endpoints
- [ ] File upload for documents

### Phase 3: AI Features
- [ ] Engagement scoring calculation
- [ ] Dropout risk model integration
- [ ] Daily batch jobs
- [ ] Risk prediction API

### Phase 4: Placement & Analytics
- [ ] Job matching algorithm
- [ ] Placement tracking service
- [ ] Analytics dashboards
- [ ] Reporting APIs

### Phase 5: Frontend Integration
- [ ] Candidate dashboard UI
- [ ] Onboarding form workflows
- [ ] Mentor dashboard
- [ ] Admin analytics

---

## 🔐 Security Considerations

1. **PII Protection**: Encrypt sensitive fields (Aadhar, PAN, bank account)
2. **Audit Trail**: All changes logged in AUDIT_LOG
3. **Role-Based Access**: Different views for candidates, mentors, admins
4. **Data Privacy**: GDPR compliance for data retention
5. **API Security**: JWT tokens, rate limiting, input validation

---

## 📚 References & Further Reading

- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
- [Spring Data JPA Documentation](https://spring.io/projects/spring-data-jpa)
- [Database Indexing Strategy](https://use-the-index-luke.com/)
- [AI/ML for Education](https://www.tandfonline.com/doi/full/10.1080/15391523.2020.1793667)

---

**Document Version**: 1.0  
**Last Updated**: January 28, 2026  
**Owner**: Architecture Team  
**Status**: ✅ Ready for Implementation
