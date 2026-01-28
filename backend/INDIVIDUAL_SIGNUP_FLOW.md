# Individual Signup & Onboarding Flow Documentation

## Overview
This document describes the complete HTTP flow for the individual signup process at `http://localhost:3001/individualsignup` and the subsequent onboarding process.

## Flow Architecture

### Step 1: Initial Contact (Signup Form)
**Endpoint:** `POST /api/auth/send-otp`
```json
Request:
{
  "contact": "user@example.com" or "9876543210",
  "contactType": "email" or "mobile"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600  // seconds
}
```

**Frontend Flow:**
- User visits `/individualsignup`
- Enters email OR mobile number
- Clicks "Send OTP"
- Frontend calls `/api/auth/send-otp`
- Backend stores OTP in `otp_verification` table
- Backend sends OTP via email/SMS

---

### Step 2: OTP Verification
**Endpoint:** `POST /api/auth/verify-otp`
```json
Request:
{
  "contact": "user@example.com" or "9876543210",
  "contactType": "email" or "mobile",
  "otp": "123456"
}

Response:
{
  "success": true,
  "verified": true,
  "message": "OTP verified successfully",
  "sessionToken": "jwt_token_here"
}
```

**Frontend Flow:**
- User receives OTP in email/SMS
- Enters OTP in verification form
- Clicks "Verify OTP"
- Frontend calls `/api/auth/verify-otp`
- Backend validates OTP against `otp_verification` table
- Backend creates a temporary session
- Moves to Profile Completion (Onboarding)

---

### Step 3: Personal Details Form
**Endpoint:** `POST /api/candidates/personal-details`
```json
Request:
{
  "sessionToken": "jwt_token",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1995-06-15",
  "gender": "MALE",
  "address": "123 Main Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "aadhar": "1234 5678 9012",
  "pan": "ABCDE1234F",
  "bankAccount": "1234567890123456"
}

Response:
{
  "success": true,
  "candidateId": 1,
  "message": "Personal details saved successfully"
}
```

**Database Impact:**
- Creates record in `candidate` table
- Creates/Updates record in `personal_details` table
- Updates `onboarding_progress.personal_details_completed`

---

### Step 4: Education Details Form
**Endpoint:** `POST /api/candidates/{candidateId}/education-details`
```json
Request:
{
  "sessionToken": "jwt_token",
  "education10th": "CBSE",
  "score10th": "85%",
  "education12th": "CBSE",
  "score12th": "90%",
  "graduationDegree": "B.Tech",
  "graduationField": "Computer Science",
  "graduationScore": "8.2"
}

Response:
{
  "success": true,
  "candidateId": 1,
  "message": "Education details saved successfully"
}
```

**Database Impact:**
- Creates/Updates record in `education_details` table
- Updates `onboarding_progress.education_details_completed`

---

### Step 5: Skills & Languages Form
**Endpoint:** `POST /api/candidates/{candidateId}/skills`
```json
Request:
{
  "sessionToken": "jwt_token",
  "skills": ["JavaScript", "React", "Node.js", "Python"],
  "languagesKnown": ["English", "Hindi", "Marathi"],
  "certifications": ["AWS Solutions Architect", "Google Cloud Associate"]
}

Response:
{
  "success": true,
  "candidateId": 1,
  "message": "Skills saved successfully"
}
```

**Database Impact:**
- Creates records in `candidate_skills` table
- Creates records in `candidate_languages` table
- Stores certifications in `education_details.certifications`
- Updates `onboarding_progress.skills_completed`

---

### Step 6: Review & Final Submission
**Endpoint:** `POST /api/candidates/{candidateId}/complete-onboarding`
```json
Request:
{
  "sessionToken": "jwt_token"
}

Response:
{
  "success": true,
  "candidateId": 1,
  "message": "Onboarding completed successfully",
  "redirectUrl": "/dashboard"
}
```

**Database Impact:**
- Updates `candidate.onboarding_status = 'COMPLETED'`
- Updates `onboarding_progress.overall_completed = true`
- Updates `onboarding_progress.overall_completed_at = NOW()`
- Updates `onboarding_progress.progress_percentage = 100`
- Creates audit log entry

---

## Database Schema Summary

### Tables Required:

1. **candidate**
   - Core user information
   - 20+ columns for personal details
   - Indexes on: email, phone, status, created_at

2. **personal_details**
   - Extended personal information
   - Employment status, preferences, availability
   - Links to candidate via candidate_id

3. **education_details**
   - 10th, 12th, Graduation, Post-graduation info
   - Links to candidate via candidate_id

4. **candidate_skills**
   - Many-to-many relationship with skills
   - Includes proficiency level and experience

5. **candidate_languages**
   - Many-to-many relationship with languages
   - Includes proficiency level

6. **onboarding_progress**
   - Tracks completion status of each step
   - Current step and overall progress percentage

7. **otp_verification**
   - Stores OTPs for verification
   - Tracks verification status and attempts
   - Auto-expires after 10 minutes

8. **audit_log**
   - Compliance and audit trail
   - Records all CREATE, UPDATE, DELETE operations

9. **onboarding_step**
   - Configuration table for workflow steps
   - Allows dynamic workflow modification

---

## API Error Handling

### Common Error Responses:

```json
{
  "success": false,
  "error": "INVALID_OTP",
  "message": "The OTP you entered is incorrect",
  "timestamp": "2026-01-28T10:30:00Z"
}
```

### Error Codes:
- `INVALID_OTP` - OTP is incorrect or expired
- `MAX_ATTEMPTS_EXCEEDED` - Too many OTP verification attempts
- `CONTACT_ALREADY_EXISTS` - Email/Phone already registered
- `VALIDATION_ERROR` - Required fields missing or invalid
- `UNAUTHORIZED` - Invalid or expired session token
- `SERVER_ERROR` - Internal server error

---

## Security Considerations

1. **OTP Management**
   - OTP valid for 10 minutes
   - Maximum 5 verification attempts
   - OTP stored hashed in database

2. **Session Tokens**
   - JWT tokens for stateless authentication
   - Token expires after 24 hours
   - Required for all onboarding endpoints

3. **Data Validation**
   - Email validation (RFC 5322)
   - Phone validation (10 digits for India)
   - Date of birth validation (age >= 18)
   - Aadhar number validation (12 digits)

4. **Audit Trail**
   - All changes logged to audit_log table
   - IP address and user agent captured
   - Timestamp recorded for compliance

---

## Data Flow Diagram

```
User Visits /individualsignup
        ↓
   Send OTP (email/phone)
        ↓
   Verify OTP
        ↓
   Personal Details Form
        ↓
   Education Details Form
        ↓
   Skills & Languages Form
        ↓
   Review Page
        ↓
   Submit & Complete Onboarding
        ↓
   Redirect to /dashboard
```

---

## Backend Implementation Checklist

- [ ] Create database tables (SQL migration)
- [ ] Implement `AuthController` with `/send-otp` and `/verify-otp` endpoints
- [ ] Implement `CandidateController` with:
  - [ ] `/candidates/personal-details` (POST)
  - [ ] `/candidates/{candidateId}/education-details` (POST)
  - [ ] `/candidates/{candidateId}/skills` (POST)
  - [ ] `/candidates/{candidateId}/complete-onboarding` (POST)
  - [ ] `/candidates/{candidateId}` (GET)
- [ ] Implement services for:
  - [ ] OTP generation and verification
  - [ ] Candidate data persistence
  - [ ] Onboarding progress tracking
- [ ] Add validation layer
- [ ] Implement audit logging
- [ ] Add error handling and exception handling
- [ ] Add JWT authentication
- [ ] Add email/SMS service integration

---

## Frontend Flow Path

```
IndividualSignup.tsx (Coordinator)
├── SignupForm.tsx → Send OTP
├── OTPVerification.tsx → Verify OTP
└── CompleteSignup.tsx
    ├── PersonalDetailsForm.tsx
    ├── EducationDetailsForm.tsx
    ├── SkillsForm.tsx
    └── ReviewForm.tsx → Submit
```

---

## Testing the Flow

1. **Test OTP Flow**
   ```bash
   curl -X POST http://localhost:8080/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"contact":"test@example.com","contactType":"email"}'
   ```

2. **Test Onboarding Data Submission**
   ```bash
   curl -X POST http://localhost:8080/api/candidates/personal-details \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer JWT_TOKEN" \
     -d '{...personal details...}'
   ```

3. **Verify Database**
   ```sql
   SELECT * FROM candidate;
   SELECT * FROM personal_details;
   SELECT * FROM education_details;
   SELECT * FROM candidate_skills;
   SELECT * FROM onboarding_progress;
   ```

---

## Next Steps

1. Execute the SQL migration script to create tables
2. Implement backend API endpoints
3. Connect frontend to backend
4. Test the complete flow
5. Monitor audit logs for compliance
