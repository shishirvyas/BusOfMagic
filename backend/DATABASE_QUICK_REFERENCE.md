# Database Schema - Quick Reference Guide

## 📊 Entity Summary Table

| Entity | Purpose | Records | AI-Used | Key Index |
|--------|---------|---------|---------|-----------|
| **CANDIDATE** | Core person records | ✅ Millions | ✅ engagement_score, dropout_risk_score, risk_category | phone, status, dropout_risk |
| **EDUCATION_DETAILS** | Academic background | ✅ 1:1 Candidate | ✅ estimatedLearningCapacity | candidate_id |
| **PERSONAL_DETAILS** | Work & preferences | ✅ 1:1 Candidate | ✅ Skill gap matching | candidate_id |
| **MOBILISATION_SOURCE** | Recruitment channels | ~20-50 | N/A | channel |
| **ONBOARDING_STEP** | Workflow definition | ~6-10 | N/A | stepKey |
| **CANDIDATE_ONBOARDING_PROGRESS** | Progress tracking | ✅ Millions | N/A | candidate_id, step_id |
| **SKILL_ASSESSMENT** | Skill evaluations | ✅ Millions | ✅ skillGapAnalysis, improvementSuggestions | candidate_id, skill_name |
| **ENGAGEMENT_EVENT** | Activity tracking | ✅✅ Billions | ✅ engagementWeightPoints, sentimentScore | candidate_id, event_date, event_type |
| **DROPOUT_RISK** | At-risk predictions | ✅ Millions | ✅ riskScore, riskCategory, suggestedInterventions | candidate_id, risk_score, category |
| **EMPLOYER** | Partner companies | ~100-1000 | N/A | partnership_status |
| **JOB_OPENING** | Positions available | ~1000-10000 | N/A | status, closing_date |
| **PLACEMENT** | Job placements | ✅ Millions | ✅ placementMatchScore, expectedRetention | candidate_id, status |
| **MENTOR** | Staff/mentors | ~50-200 | N/A | status |
| **CANDIDATE_MENTOR_MAPPING** | Mentor assignments | ✅ Millions | N/A | candidate_id, mentor_id |
| **INTERACTION_LOG** | Communications | ✅✅ Billions | N/A | candidate_id, interaction_date |
| **AUDIT_LOG** | Change tracking | ✅✅ Billions | N/A | entity_type, created_at |

---

## 🎯 Core AI Fields by Entity

### CANDIDATE (Main AI Hub)
```
engagement_score         → Calculated from EngagementEvent
dropout_risk_score       → ML model prediction
risk_category           → Derived from risk_score
recommendation_status   → AI decision: ONBOARD/MONITOR/INTERVENTION
```

### ENGAGEMENT_EVENT (AI Input Data)
```
engagementWeightPoints  → Points for engagement calculation
sentimentScore          → AI sentiment analysis (-100 to 100)
eventImportance         → AI prioritization
status                  → Event completion
```

### DROPOUT_RISK (Core AI Output)
```
riskScore              → 0-100 ML prediction
riskCategory           → LOW/MEDIUM/HIGH/CRITICAL
riskFactors            → JSON: identified risk factors
suggestedInterventions → JSON: recommended actions
interventionPriority   → IMMEDIATE/URGENT/HIGH/MEDIUM/LOW
modelVersion           → ML model version
confidenceScore        → Model confidence
```

### SKILL_ASSESSMENT (AI Recommendations)
```
skillGapAnalysis       → AI identified gaps
improvementSuggestions → AI learning recommendations
learningPathSuggested  → Personalized learning path
```

### PLACEMENT (AI Matching)
```
placementMatchScore           → Job-candidate fit 0-100
expectedSuccessProbability    → AI success prediction 0-100
expectedRetentionMonths       → AI tenure prediction
expectedRetentionScore        → Retention likelihood 0-100
```

---

## 🔄 Relationship Map

```
CANDIDATE (1) ──┬── (1) EDUCATION_DETAILS
                ├── (1) PERSONAL_DETAILS
                ├── (N) SKILL_ASSESSMENT
                ├── (N) ENGAGEMENT_EVENT ──→ [Feeds AI Scoring]
                ├── (N) DROPOUT_RISK ──────→ [AI Output]
                ├── (1) DROPOUT_RISK
                ├── (N) CANDIDATE_ONBOARDING_PROGRESS
                ├── (N) PLACEMENT
                ├── (N) INTERACTION_LOG
                ├── (N) CANDIDATE_MENTOR_MAPPING ──→ MENTOR
                └── (N) AUDIT_LOG

ONBOARDING_STEP (1) ──── (N) CANDIDATE_ONBOARDING_PROGRESS ──── (N) CANDIDATE

MOBILISATION_SOURCE (1) ──── (N) CANDIDATE

EMPLOYER (1) ──┬── (N) JOB_OPENING ──── (N) PLACEMENT ──── CANDIDATE
               └── (N) PLACEMENT ────────────────────────────────→

MENTOR (1) ──┬── (N) CANDIDATE_MENTOR_MAPPING ──── (N) CANDIDATE
             └── (N) DROPOUT_RISK (assigned_mentor_id)
```

---

## 📈 Engagement Scoring Algorithm

```
engagement_score = SUM(engagement_event.engagementWeightPoints)

Event Weights:
├─ Course Started: 5 points
├─ Course Completed: 25 points
├─ Quiz Attempted: 10 points
├─ Quiz Passed: 15 points
├─ Assignment Submitted: 10 points
├─ Assignment Graded: 10 points
├─ Session Attended: 5 points
├─ Certification Earned: 30 points
├─ Milestone Achieved: 20 points
└─ Mentor Interaction: 5 points

Score Categories:
├─ 0-25: Very Low
├─ 26-50: Low
├─ 51-75: Moderate
└─ 76-100: High
```

---

## ⚠️ Dropout Risk Prediction

```
Input Variables (from database):
├─ engagement_score (CANDIDATE)
├─ days_since_last_activity (DROPOUT_RISK calculated)
├─ attendance_rate (from ENGAGEMENT_EVENT session count)
├─ assessment_pass_rate (from SKILL_ASSESSMENT)
├─ family_monthly_income (PERSONAL_DETAILS)
├─ education_level (EDUCATION_DETAILS)
├─ profile_completion_percentage (CANDIDATE)
├─ days_in_program (CANDIDATE created_at vs today)
└─ motivationScore (AI calculated)

ML Model Output:
├─ riskScore: 0-100
├─ confidenceScore: 0-100
├─ riskFactors: [list of identified factors]
└─ suggestedInterventions: [recommended actions]

Risk Categories:
├─ LOW (0-25): No intervention needed
├─ MEDIUM (26-50): Monitor closely
├─ HIGH (51-75): Assign mentor, increase contact
└─ CRITICAL (76-100): Immediate intervention
```

---

## 🎯 Dashboard Queries

### Candidate Overview Dashboard
```sql
SELECT 
  c.id, c.first_name, c.email, c.status,
  c.engagement_score, c.dropout_risk_score, c.risk_category,
  COUNT(DISTINCT ee.id) as activity_count,
  MAX(ee.event_date) as last_activity,
  COUNT(DISTINCT dr.id) as risk_assessments,
  COUNT(DISTINCT cop.id) as onboarding_steps_completed
FROM candidate c
LEFT JOIN engagement_event ee ON c.id = ee.candidate_id
LEFT JOIN dropout_risk dr ON c.id = dr.candidate_id
LEFT JOIN candidate_onboarding_progress cop ON c.id = cop.candidate_id 
  AND cop.status = 'COMPLETED'
GROUP BY c.id
```

### At-Risk Candidates
```sql
SELECT 
  c.id, c.first_name, c.email,
  dr.risk_score, dr.risk_category,
  dr.suggested_interventions,
  m.first_name as mentor_name
FROM dropout_risk dr
JOIN candidate c ON dr.candidate_id = c.id
LEFT JOIN mentor m ON dr.assigned_mentor_id = m.id
WHERE dr.risk_category IN ('HIGH', 'CRITICAL')
  AND dr.intervention_status != 'COMPLETED'
ORDER BY dr.risk_score DESC
```

### Placement Success Metrics
```sql
SELECT 
  e.company_name,
  COUNT(p.id) as total_placements,
  SUM(CASE WHEN p.is_currently_active THEN 1 ELSE 0 END) as active,
  AVG(p.total_months_employed) as avg_retention,
  AVG(p.candidate_satisfaction_score) as satisfaction
FROM placement p
JOIN employer e ON p.employer_id = e.id
GROUP BY e.company_name
HAVING COUNT(p.id) > 0
ORDER BY total_placements DESC
```

### Engagement Trend
```sql
SELECT 
  DATE_TRUNC('week', ee.event_date)::DATE as week,
  COUNT(DISTINCT ee.candidate_id) as active_candidates,
  SUM(ee.engagement_weight_points) as total_points,
  AVG(ee.engagement_weight_points) as avg_points
FROM engagement_event ee
WHERE ee.event_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY week
ORDER BY week DESC
```

---

## 🔑 Critical Indexes

### Query Performance Indexes
```sql
-- Candidate lookups
CREATE INDEX idx_candidate_phone ON candidate(phone_number);
CREATE INDEX idx_candidate_status ON candidate(status);

-- AI Scoring & Analytics
CREATE INDEX idx_candidate_dropout_risk ON candidate(dropout_risk_score DESC);
CREATE INDEX idx_candidate_engagement ON candidate(engagement_score DESC);

-- Engagement analysis
CREATE INDEX idx_engagement_event_candidate_date 
  ON engagement_event(candidate_id, event_date DESC);

-- Dashboard queries
CREATE INDEX idx_engagement_event_weight 
  ON engagement_event(engagement_weight_points);

-- Risk monitoring
CREATE INDEX idx_dropout_risk_category ON dropout_risk(risk_category);
CREATE INDEX idx_dropout_risk_status ON dropout_risk(intervention_status);

-- Placement tracking
CREATE INDEX idx_placement_candidate_status 
  ON placement(candidate_id, placement_status);
```

---

## 📊 Sample Data Structure

### New Candidate Onboarding
```
1. Register Candidate
   INSERT INTO candidate (
     first_name, email, phone_number, date_of_birth, status
   ) VALUES (
     'Ravi', 'ravi@example.com', '9876543210', '2005-05-15', 'REGISTERED'
   );

2. Initialize Onboarding Progress
   INSERT INTO candidate_onboarding_progress (
     candidate_id, onboarding_step_id, status
   ) SELECT c.id, os.id, 'PENDING'
     FROM candidate c, onboarding_step os
     WHERE c.id = 1001 AND os.is_mandatory = true;

3. Assign Mentor
   INSERT INTO candidate_mentor_mapping (
     candidate_id, mentor_id, is_active
   ) VALUES (1001, 5, true);
```

### Track Engagement
```
INSERT INTO engagement_event (
  candidate_id, event_type, event_category,
  engagement_weight_points, sentiment_score, event_date
) VALUES (
  1001, 'COURSE_COMPLETED', 'LEARNING', 
  25.0, 85.0, NOW()
);

-- Trigger: Recalculate engagement_score
UPDATE candidate SET 
  engagement_score = (
    SELECT SUM(engagement_weight_points) 
    FROM engagement_event 
    WHERE candidate_id = 1001
  )
WHERE id = 1001;
```

### Create Dropout Risk Alert
```
INSERT INTO dropout_risk (
  candidate_id, risk_score, risk_category, risk_factors,
  engagement_decline_detected, attendance_decline_detected,
  motivation_score, suggested_interventions, 
  intervention_priority, model_version, confidence_score
) VALUES (
  1001, 72.5, 'HIGH', 
  '["engagement_decline_25%", "no_activity_7_days"]'::jsonb,
  true, false, 35.0,
  '["1:1_mentor_meeting", "skill_assessment"]'::jsonb,
  'URGENT', 'v2.1', 87.3
);

-- Trigger: Assign mentor if at-risk
UPDATE dropout_risk SET assigned_mentor_id = 5 
WHERE candidate_id = 1001 AND assigned_mentor_id IS NULL;
```

### Match & Place Candidate
```
INSERT INTO placement (
  candidate_id, job_opening_id, employer_id,
  placement_status, placement_match_score,
  expected_success_probability, expected_retention_months
) VALUES (
  1001, 150, 25,
  'OFFERED', 88.5, 92.0, 24
);

-- Update placement status
UPDATE placement SET
  placement_status = 'JOINED',
  joining_date = CURRENT_DATE
WHERE id = <placement_id>;
```

---

## 🛠️ Useful SQL Queries

### Find Candidates Needing Intervention
```sql
SELECT c.id, c.first_name, dr.risk_factors
FROM candidate c
JOIN dropout_risk dr ON c.id = dr.candidate_id
WHERE dr.risk_category IN ('HIGH', 'CRITICAL')
  AND dr.intervention_status = 'NOT_STARTED'
LIMIT 20
```

### Engagement Trend Analysis
```sql
SELECT 
  DATE(ee.event_date) as date,
  COUNT(DISTINCT ee.candidate_id) as engaged_users,
  SUM(ee.engagement_weight_points) as total_engagement
FROM engagement_event ee
GROUP BY DATE(ee.event_date)
ORDER BY date DESC
LIMIT 30
```

### Placement Success Rate by Employer
```sql
SELECT 
  e.company_name,
  COUNT(*) FILTER (WHERE p.is_currently_active) as active_placements,
  COUNT(*) as total_placements,
  ROUND(100.0 * COUNT(*) FILTER (WHERE p.total_months_employed >= 6) 
    / NULLIF(COUNT(*), 0), 2) as retention_rate_pct
FROM placement p
JOIN employer e ON p.employer_id = e.id
GROUP BY e.company_name
ORDER BY retention_rate_pct DESC
```

### Identify Dropout Candidates
```sql
SELECT c.id, c.first_name, c.email,
  DATE_TRUNC('day', NOW() - ee.event_date) as days_inactive
FROM candidate c
LEFT JOIN engagement_event ee ON c.id = ee.candidate_id
WHERE c.status = 'ACTIVE'
  AND (ee.event_date IS NULL OR ee.event_date < NOW() - INTERVAL '30 days')
ORDER BY days_inactive DESC
```

---

## 📋 Migrations & Setup

### PostgreSQL Flyway Migration
File: `V1__initial_schema.sql`
- Creates all 16 tables
- Sets up indexes
- Creates analytical views

### Spring Boot Application Properties
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Use migrations only
  flyway:
    baseline-on-migrate: true
    locations: classpath:db/migration
```

### Entity Relationships in Code
```java
// Candidate → DropoutRisk (One-to-Many)
@OneToMany(mappedBy = "candidate")
private List<DropoutRisk> dropoutRisks;

// Candidate → EngagementEvent (One-to-Many)
@OneToMany(mappedBy = "candidate")
private List<EngagementEvent> engagementEvents;

// DropoutRisk → Mentor (Many-to-One)
@ManyToOne
@JoinColumn(name = "assigned_mentor_id")
private Mentor assignedMentor;
```

---

## ⚡ Performance Tips

1. **Engagement Score Calculation**
   - Run as nightly batch job
   - Cache results for 24 hours
   - Use materialized views

2. **Dropout Risk Prediction**
   - Run daily at 2 AM
   - Cache predictions for analytics
   - Use PostgreSQL partitioning for DROPOUT_RISK table

3. **Onboarding Progress**
   - Pre-compute next steps
   - Cache in Redis
   - Use async notifications

4. **Placement Matching**
   - Use vector similarity for skill matching
   - Pre-compute match scores
   - Cache for 7 days

---

## 📚 File Locations

```
backend/
├── src/main/java/com/magicbus/entity/
│   ├── Candidate.java
│   ├── EducationDetails.java
│   ├── PersonalDetails.java
│   ├── MobilisationSource.java
│   ├── OnboardingStep.java
│   ├── CandidateOnboardingProgress.java
│   ├── SkillAssessment.java
│   ├── EngagementEvent.java
│   ├── DropoutRisk.java
│   ├── Employer.java
│   ├── JobOpening.java
│   ├── Placement.java
│   ├── Mentor.java
│   ├── CandidateMentorMapping.java
│   ├── InteractionLog.java
│   └── AuditLog.java
│
└── src/main/resources/db/migration/
    └── V1__initial_schema.sql

Documentation/
├── DATABASE_SCHEMA_DESIGN.md (comprehensive)
└── DATABASE_QUICK_REFERENCE.md (this file)
```

---

**Version**: 1.0  
**Status**: ✅ Ready for Implementation  
**Last Updated**: January 28, 2026
