# Individual Signup Flow - Visual Guide & Data Model

## Complete HTTP Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Browser: /individualsignup                          │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: INITIAL SIGNUP - Send OTP                                       │
│                                                                          │
│ User enters: Email or Phone Number                                      │
│ Frontend URL: http://localhost:3001/individualsignup                    │
│                                                                          │
│ ┌─ Form ────────────────────────────────────────────────────────────┐   │
│ │ ○ Email   ○ Mobile                                               │   │
│ │ [ ] user@example.com                                             │   │
│ │ [Send OTP]                                                       │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ API Call:                                                              │
│ POST http://localhost:8080/api/auth/send-otp                          │
│ {                                                                       │
│   "contact": "user@example.com",                                       │
│   "contactType": "email"                                               │
│ }                                                                       │
│                                                                          │
│ Database Action:                                                        │
│ INSERT INTO otp_verification (contact, contact_type, otp_code,        │
│                              expires_at, is_verified)                 │
│ VALUES ('user@example.com', 'email', '123456',                        │
│         NOW() + INTERVAL '10 minutes', FALSE)                         │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: OTP VERIFICATION                                               │
│                                                                          │
│ User enters: OTP from email/SMS                                        │
│                                                                          │
│ ┌─ Form ────────────────────────────────────────────────────────────┐   │
│ │ Enter OTP:                                                       │   │
│ │ [ ][ ][ ][ ][ ][ ]  (6 digits)                                   │   │
│ │ [Verify OTP]                                                     │   │
│ │ Didn't receive? [Resend]                                         │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ API Call:                                                              │
│ POST http://localhost:8080/api/auth/verify-otp                        │
│ {                                                                       │
│   "contact": "user@example.com",                                       │
│   "contactType": "email",                                              │
│   "otp": "123456"                                                      │
│ }                                                                       │
│                                                                          │
│ Database Action:                                                        │
│ UPDATE otp_verification SET is_verified = TRUE,                       │
│                            verified_at = NOW()                        │
│ WHERE contact = 'user@example.com' AND otp_code = '123456'            │
│                                                                          │
│ Response:                                                               │
│ {                                                                       │
│   "success": true,                                                      │
│   "verified": true,                                                     │
│   "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."           │
│ }                                                                       │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: PERSONAL DETAILS (Onboarding - Page 1)                         │
│                                                                          │
│ ┌─ Stepper ──────────────────────────────────────────────────────────┐  │
│ │ [✓] Personal   [2] Education   [3] Skills   [4] Review           │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌─ Form ────────────────────────────────────────────────────────────┐  │
│ │ First Name: [John            ]  Last Name: [Doe              ]   │  │
│ │ Email: [john@example.com     ]  Phone: [9876543210         ]   │  │
│ │ Date of Birth: [1995-06-15   ]  Gender: [Male ▼]           │  │  │
│ │ Address: [123 Main Street    ]                              │  │  │
│ │ City: [Bangalore             ]  State: [Karnataka ▼]       │  │  │
│ │ Pincode: [560001             ]                              │  │  │
│ │ Aadhar: [1234 5678 9012     ]                              │  │  │
│ │ PAN: [ABCDE1234F             ]                              │  │  │
│ │ Bank Account: [1234567890    ]                              │  │  │
│ │                                 [Back] [Next: Education]    │  │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ API Call:                                                              │
│ POST http://localhost:8080/api/candidates/personal-details             │
│ Headers: Authorization: Bearer SESSION_TOKEN                          │
│ {                                                                       │
│   "firstName": "John",                                                  │
│   "lastName": "Doe",                                                    │
│   "email": "john@example.com",                                          │
│   "phone": "9876543210",                                                │
│   "dateOfBirth": "1995-06-15",                                          │
│   "gender": "MALE",                                                     │
│   "address": "123 Main Street",                                         │
│   "city": "Bangalore",                                                  │
│   "state": "Karnataka",                                                 │
│   "pincode": "560001",                                                  │
│   "aadhar": "1234567890123",                                            │
│   "pan": "ABCDE1234F",                                                  │
│   "bankAccount": "1234567890123456"                                     │
│ }                                                                       │
│                                                                          │
│ Database Actions:                                                       │
│ 1) INSERT INTO candidate (first_name, last_name, email,               │
│       phone_number, date_of_birth, address_line_1, city,              │
│       state, pincode, gender, aadhar_number, pan_number,              │
│       onboarding_status, created_at)                                  │
│    VALUES ('John', 'Doe', 'john@example.com', '9876543210', ...)      │
│    RETURNING id;                                                       │
│                                                                          │
│ 2) INSERT INTO personal_details (candidate_id, bank_account_number,   │
│       aadhar_verified, created_at)                                    │
│    VALUES (1, '1234567890123456', false, NOW());                       │
│                                                                          │
│ 3) INSERT INTO onboarding_progress (candidate_id, personal_details    │
│       _completed, personal_details_completed_at, current_step,        │
│       progress_percentage)                                             │
│    VALUES (1, true, NOW(), 'education', 25);                           │
│                                                                          │
│ 4) INSERT INTO audit_log (candidate_id, action_type, entity_type,     │
│       entity_id, new_values, created_at)                              │
│    VALUES (1, 'CREATE', 'candidate', 1, '{...}', NOW());               │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: EDUCATION DETAILS (Onboarding - Page 2)                        │
│                                                                          │
│ ┌─ Stepper ──────────────────────────────────────────────────────────┐  │
│ │ [✓] Personal   [✓] Education   [3] Skills   [4] Review           │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌─ Form ────────────────────────────────────────────────────────────┐  │
│ │ 10th Board: [CBSE           ]  10th Score: [85%            ]    │  │
│ │ 12th Board: [CBSE           ]  12th Score: [90%            ]    │  │
│ │ Graduation: [B.Tech         ]  Field: [Computer Science    ]    │  │
│ │ Graduation Score: [8.2 CGPA ]                                  │  │
│ │                                 [Back] [Next: Skills]         │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ API Call:                                                              │
│ POST http://localhost:8080/api/candidates/1/education-details         │
│ {                                                                       │
│   "education10th": "CBSE",                                              │
│   "score10th": "85%",                                                   │
│   "education12th": "CBSE",                                              │
│   "score12th": "90%",                                                   │
│   "graduationDegree": "B.Tech",                                         │
│   "graduationField": "Computer Science",                                │
│   "graduationScore": "8.2"                                              │
│ }                                                                       │
│                                                                          │
│ Database Action:                                                        │
│ INSERT INTO education_details (candidate_id, tenth_board,             │
│       tenth_percentage, twelfth_board, twelfth_percentage,            │
│       graduation_degree, graduation_specialization,                   │
│       graduation_percentage, created_at)                              │
│ VALUES (1, 'CBSE', 85.00, 'CBSE', 90.00, 'B.Tech',                   │
│         'Computer Science', 8.2, NOW());                               │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 5: SKILLS & LANGUAGES (Onboarding - Page 3)                       │
│                                                                          │
│ ┌─ Stepper ──────────────────────────────────────────────────────────┐  │
│ │ [✓] Personal   [✓] Education   [✓] Skills   [4] Review           │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌─ Form ────────────────────────────────────────────────────────────┐  │
│ │ Skills: [JavaScript] [React] [Node.js] [Python]                │  │
│ │         [Add Skill Input:______] [+]                            │  │
│ │                                                                  │  │
│ │ Languages: [English ✓] [Hindi ✓] [Marathi]                     │  │
│ │            [Add Language:______] [+]                            │  │
│ │                                                                  │  │
│ │ Certifications: [AWS Solutions Architect] [GCP Associate]       │  │
│ │                 [Add Cert:______] [+]                           │  │
│ │                                 [Back] [Next: Review]          │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ API Call:                                                              │
│ POST http://localhost:8080/api/candidates/1/skills                    │
│ {                                                                       │
│   "skills": ["JavaScript", "React", "Node.js", "Python"],             │
│   "languagesKnown": ["English", "Hindi", "Marathi"],                  │
│   "certifications": ["AWS Solutions Architect", "GCP Associate"]       │
│ }                                                                       │
│                                                                          │
│ Database Actions:                                                       │
│ 1) INSERT INTO candidate_skills (candidate_id, skill_name,            │
│       created_at) VALUES (1, 'JavaScript', NOW());                    │
│    INSERT INTO candidate_skills (candidate_id, skill_name,            │
│       created_at) VALUES (1, 'React', NOW());                         │
│    ... (repeat for each skill)                                        │
│                                                                          │
│ 2) INSERT INTO candidate_languages (candidate_id,                     │
│       language_name, created_at) VALUES (1, 'English', NOW());        │
│    ... (repeat for each language)                                     │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 6: REVIEW & SUBMIT (Onboarding - Page 4)                          │
│                                                                          │
│ ┌─ Stepper ──────────────────────────────────────────────────────────┐  │
│ │ [✓] Personal   [✓] Education   [✓] Skills   [✓] Review          │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌─ Review Cards ────────────────────────────────────────────────────┐  │
│ │ Personal Details                                                 │  │
│ │ Name: John Doe                 Email: john@example.com           │  │
│ │ Phone: 9876543210             DOB: 1995-06-15                   │  │
│ │ Location: Bangalore, Karnataka - 560001                          │  │
│ │                                                                  │  │
│ │ Education Details                                                │  │
│ │ 10th: CBSE - 85%               12th: CBSE - 90%                 │  │
│ │ Degree: B.Tech in Computer Science - 8.2 CGPA                   │  │
│ │                                                                  │  │
│ │ Skills & Languages                                               │  │
│ │ Skills: JavaScript, React, Node.js, Python                       │  │
│ │ Languages: English, Hindi, Marathi                               │  │
│ │ Certifications: AWS Solutions Architect, GCP Associate           │  │
│ │                                                                  │  │
│ │                              [Back] [Submit & Complete]         │  │
│ └────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ API Call:                                                              │
│ POST http://localhost:8080/api/candidates/1/complete-onboarding      │
│                                                                          │
│ Database Actions:                                                       │
│ 1) UPDATE candidate SET onboarding_status = 'COMPLETED',              │
│       updated_at = NOW() WHERE id = 1;                               │
│                                                                          │
│ 2) UPDATE onboarding_progress SET overall_completed = TRUE,           │
│       overall_completed_at = NOW(),                                  │
│       skills_completed = TRUE,                                        │
│       skills_completed_at = NOW(),                                    │
│       current_step = 'completed',                                     │
│       progress_percentage = 100 WHERE candidate_id = 1;               │
│                                                                          │
│ 3) INSERT INTO audit_log (candidate_id, action_type, entity_type,    │
│       new_values) VALUES (1, 'UPDATE', 'candidate', '{...}');        │
│                                                                          │
│ Response:                                                               │
│ {                                                                       │
│   "success": true,                                                      │
│   "candidateId": 1,                                                     │
│   "message": "Onboarding completed successfully",                       │
│   "redirectUrl": "/dashboard"                                           │
│ }                                                                       │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
                    ✓ Onboarding Complete!
                       Redirecting to Dashboard...
```

---

## Data Model - Entity Relationship Diagram

```
                          ┌─────────────────────┐
                          │     candidate       │
                          │ ─────────────────── │
                          │ id (PK)             │
                          │ first_name          │
                          │ last_name           │
                          │ email (UNIQUE)      │
                          │ phone_number (UNIQ) │
                          │ date_of_birth       │
                          │ address_line_1      │
                          │ address_line_2      │
                          │ city                │
                          │ state               │
                          │ pincode             │
                          │ country             │
                          │ gender              │
                          │ mother_tongue       │
                          │ religion            │
                          │ caste               │
                          │ marital_status      │
                          │ guardian_name       │
                          │ guardian_phone      │
                          │ guardian_email      │
                          │ father_name         │
                          │ mother_name         │
                          │ aadhar_number       │
                          │ pan_number          │
                          │ status              │
                          │ onboarding_status   │
                          │ dropout_risk_score  │
                          │ engagement_score    │
                          │ created_at          │
                          │ updated_at          │
                          └──────────┬──────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         │ (1:1)                  (1:1)                        (1:1)
         ▼                           ▼                           ▼
    ┌─────────────┐        ┌──────────────────┐      ┌─────────────────┐
    │personal_    │        │education_        │      │onboarding_      │
    │details      │        │details           │      │progress         │
    ├─────────────┤        ├──────────────────┤      ├─────────────────┤
    │id (PK)      │        │id (PK)           │      │id (PK)          │
    │candidate_id │        │candidate_id (FK) │      │candidate_id(FK) │
    │employment   │        │tenth_board       │      │signup_completed │
    │_status      │        │tenth_year_of_    │      │personal_details_│
    │current_     │        │passing           │      │completed        │
    │job_title    │        │tenth_percentage  │      │education_       │
    │current_     │        │tenth_stream      │      │details_         │
    │company_name │        │tenth_school_name │      │completed        │
    │years_of_    │        │twelfth_board     │      │skills_completed │
    │experience   │        │twelfth_year_of_  │      │overall_         │
    │previous_    │        │passing           │      │completed        │
    │employers    │        │twelfth_          │      │current_step     │
    │bank_        │        │percentage        │      │progress_        │
    │account_     │        │twelfth_stream    │      │percentage       │
    │number       │        │twelfth_college_  │      │created_at       │
    │ifsc_code    │        │name              │      │updated_at       │
    │bank_name    │        │graduation_degree │      └─────────────────┘
    │aadhar_      │        │graduation_       │
    │verified     │        │specialization    │
    │career_      │        │graduation_year   │
    │interests    │        │graduation_       │
    │preferred_   │        │percentage        │
    │locations    │        │graduation_       │
    │earliest_    │        │university        │
    │join_date    │        │graduation_status │
    │created_at   │        │post_graduation_  │
    │updated_at   │        │degree            │
    └─────────────┘        │post_graduation_  │
                           │year              │
                           │post_graduation_  │
                           │percentage        │
                           │post_graduation_  │
                           │university        │
                           │certifications    │
                           │additional_       │
                           │qualifications    │
                           │created_at        │
                           │updated_at        │
                           └──────────────────┘
         │
         │ (1:N)                           (1:N)
         ├─ candidate_skills  ────────  candidate_languages
         │  ├─ id (PK)                  ├─ id (PK)
         │  ├─ candidate_id (FK)        ├─ candidate_id (FK)
         │  ├─ skill_name               ├─ language_name
         │  ├─ proficiency_level        ├─ proficiency_level
         │  ├─ years_of_experience      └─ created_at
         │  ├─ verified
         │  └─ created_at
         │
         └─ audit_log
            ├─ id (PK)
            ├─ candidate_id (FK)
            ├─ action_type (CREATE/UPDATE/DELETE)
            ├─ entity_type (candidate/personal_details/etc)
            ├─ entity_id
            ├─ old_values (JSON)
            ├─ new_values (JSON)
            └─ created_at


         otp_verification (No FK, standalone)
         ├─ id (PK)
         ├─ contact (email or phone)
         ├─ contact_type (email/mobile)
         ├─ otp_code
         ├─ is_verified
         ├─ attempts
         ├─ expires_at
         └─ verified_at


         onboarding_step (Configuration table)
         ├─ id (PK)
         ├─ step_order
         ├─ step_key (contact, otp, personal, education, skills, review)
         ├─ step_name
         ├─ step_description
         ├─ required_fields (JSON)
         ├─ validation_rules (JSON)
         └─ is_active
```

---

## Sample Database Queries After Signup

### Get Complete Candidate Profile
```sql
SELECT 
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    c.phone_number,
    c.date_of_birth,
    pd.employment_status,
    pd.bank_account_number,
    ed.graduation_degree,
    ed.graduation_specialization,
    op.overall_completed,
    op.progress_percentage
FROM candidate c
LEFT JOIN personal_details pd ON c.id = pd.candidate_id
LEFT JOIN education_details ed ON c.id = ed.candidate_id
LEFT JOIN onboarding_progress op ON c.id = op.candidate_id
WHERE c.id = 1;
```

### Get All Skills for a Candidate
```sql
SELECT skill_name, proficiency_level
FROM candidate_skills
WHERE candidate_id = 1;
```

### Get All Languages for a Candidate
```sql
SELECT language_name, proficiency_level
FROM candidate_languages
WHERE candidate_id = 1;
```

### Get Onboarding Progress
```sql
SELECT 
    candidate_id,
    personal_details_completed,
    education_details_completed,
    skills_completed,
    overall_completed,
    progress_percentage,
    current_step
FROM onboarding_progress
WHERE candidate_id = 1;
```

### Audit Trail for a Candidate
```sql
SELECT 
    action_type,
    entity_type,
    new_values,
    created_at
FROM audit_log
WHERE candidate_id = 1
ORDER BY created_at DESC;
```

---

## API Response Examples

### Successful Signup Response
```json
{
  "success": true,
  "candidateId": 1,
  "message": "Candidate created successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "status": "ACTIVE",
    "onboardingStatus": "IN_PROGRESS",
    "createdAt": "2026-01-28T10:30:00Z"
  }
}
```

### Onboarding Complete Response
```json
{
  "success": true,
  "candidateId": 1,
  "message": "Onboarding completed successfully",
  "data": {
    "id": 1,
    "status": "ACTIVE",
    "onboardingStatus": "COMPLETED",
    "progressPercentage": 100,
    "completedAt": "2026-01-28T11:45:00Z"
  },
  "redirectUrl": "/dashboard"
}
```

### Error Response
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Email is already registered",
  "timestamp": "2026-01-28T10:30:00Z",
  "details": {
    "field": "email",
    "value": "john@example.com",
    "constraint": "UNIQUE"
  }
}
```
