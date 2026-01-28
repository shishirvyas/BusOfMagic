# 🎯 Complete Onboarding Workflow - Setup & Usage Guide

## ✅ What Was Created

Your application now has a **complete multi-step candidate onboarding workflow** that matches your database schema and business requirements.

---

## 📍 How to Access the Workflow

### Option 1: Via Navigation (Recommended)
1. Go to **http://localhost:3001/dashboard** (or after sign-in)
2. Look at the **left sidebar**
3. Click on **"Onboard New Candidate"** button (highlighted in blue at the bottom)

### Option 2: Direct URL
Navigate directly to: **http://localhost:3001/onboard**

---

## 📋 Workflow Steps

The onboarding process is a **4-step workflow**:

### Step 1: Personal Details
Collect basic candidate information:
- ✓ First Name & Last Name
- ✓ Email & Phone
- ✓ Date of Birth & Gender
- ✓ Address, City, State, Pincode
- ✓ Optional: Aadhar, PAN, Bank Account

### Step 2: Education Details
Track educational background:
- ✓ 10th Board/School & Score
- ✓ Optional: 12th Board/School & Score
- ✓ Optional: Graduation Degree, Field & Score

### Step 3: Skills & Languages
Add technical & soft skills:
- ✓ Select from 15+ predefined skills
- ✓ Add custom skills
- ✓ Select languages (8 predefined options)
- ✓ Add certifications

### Step 4: Review & Submit
Review all information before submitting:
- ✓ Complete summary of all details
- ✓ Edit button to go back to any step
- ✓ Submit to save to database

---

## 🔌 Backend API Endpoints

### Onboard a Candidate
```
POST /api/candidates/onboard
Content-Type: application/json

Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1998-05-15",
  "gender": "male",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "aadhar": "1234 5678 9012",
  "pan": "ABCDE1234F",
  "bankAccount": "123456789",
  "education10th": "CBSE",
  "score10th": "85%",
  "education12th": "CBSE",
  "score12th": "90%",
  "graduationDegree": "B.Tech",
  "graduationField": "Computer Science",
  "graduationScore": "7.8",
  "skills": ["JavaScript", "React", "Node.js"],
  "languagesKnown": ["English", "Hindi"],
  "certifications": ["AWS Certified"]
}

Response: {
  "candidateId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "message": "Candidate John Doe onboarded successfully",
  "success": true
}
```

### Get All Candidates
```
GET /api/candidates
Response: List of all candidates with all details
```

### Get Active Candidates
```
GET /api/candidates/active
Response: Only candidates with status = ACTIVE
```

### Get At-Risk Candidates
```
GET /api/candidates/at-risk?riskThreshold=50
Response: Candidates with dropout_risk_score >= 50
```

### Get Candidate by ID
```
GET /api/candidates/{id}
Response: Single candidate with all details
```

### Get Candidates by Location
```
GET /api/candidates/location?city=Mumbai&state=Maharashtra
Response: Candidates in specified city/state
```

### Get Candidate Statistics
```
GET /api/candidates/stats
Response: {
  "totalCandidates": 10,
  "activeCandidates": 8,
  "atRiskCandidates": 2
}
```

---

## 💾 Database Tables Updated

When a candidate is onboarded, the following tables are populated:

| Table | Records | Info |
|-------|---------|------|
| `candidate` | 1 | Core candidate info + AI fields |
| `education_details` | 1 | Education background |
| `personal_details` | 1 | Employment & financial info |
| `skill_assessment` | N | One per selected skill |
| `candidate_onboarding_progress` | 6 | Tracks workflow step completion |

---

## 🔄 Workflow Flow

```
┌─────────────────────────────────────┐
│   Start: Onboard New Candidate      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 1: Personal Details Form      │
│  ✓ Name, Email, Phone               │
│  ✓ Address, City, State             │
│  ✓ Aadhar, PAN, Bank (optional)     │
└──────────────┬──────────────────────┘
               │ [Click Next]
               ▼
┌─────────────────────────────────────┐
│  Step 2: Education Details Form     │
│  ✓ 10th, 12th, Graduation           │
│  ✓ Boards, Fields, Scores           │
└──────────────┬──────────────────────┘
               │ [Click Next]
               ▼
┌─────────────────────────────────────┐
│  Step 3: Skills & Languages Form    │
│  ✓ Add skills (from list or custom) │
│  ✓ Select languages                 │
│  ✓ Add certifications               │
└──────────────┬──────────────────────┘
               │ [Click Next]
               ▼
┌─────────────────────────────────────┐
│  Step 4: Review & Submit            │
│  ✓ Review all information           │
│  ✓ Edit or Submit                   │
└──────────────┬──────────────────────┘
               │ [Click Submit]
               ▼
┌─────────────────────────────────────┐
│  Success! Candidate Saved           │
│  ↓ Redirect to Customers            │
└─────────────────────────────────────┘
```

---

## 🛠️ Technical Architecture

### Frontend Components
```
pages/
├── Onboarding.tsx                    # Main orchestrator
components/onboarding/
├── PersonalDetailsForm.tsx           # Step 1
├── EducationDetailsForm.tsx          # Step 2
├── SkillsForm.tsx                    # Step 3
└── ReviewForm.tsx                    # Step 4
```

### Backend Stack
```
Controllers:
├── CandidateController.java          # 7 API endpoints

Services:
├── OnboardingService.java            # Business logic

Repositories:
├── CandidateRepository.java
├── EducationDetailsRepository.java
├── PersonalDetailsRepository.java
└── SkillAssessmentRepository.java

DTOs:
├── OnboardingRequestDTO.java         # Input validation
└── OnboardingResponseDTO.java        # API response
```

---

## 🧪 Testing the Workflow

### Test Case 1: Happy Path
1. Go to http://localhost:3001/onboard
2. Fill in all fields with valid data
3. Click "Next" through each step
4. Click "Submit" on review page
5. **Expected**: Success message + redirect to customers page

### Test Case 2: Validation
1. Go to http://localhost:3001/onboard
2. Try to click "Next" without filling required fields
3. **Expected**: Error message appears

### Test Case 3: Edit Before Submit
1. Go to http://localhost:3001/onboard
2. Fill Step 1 & 2
3. On Step 3, click "Back"
4. Modify information
5. **Expected**: Changes preserved, can continue

### Test Case 4: Direct API Call
```bash
curl -X POST http://localhost:3001/api/candidates/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "9123456789",
    "dateOfBirth": "1999-03-20",
    "gender": "female",
    "address": "456 Oak Ave",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "education10th": "ICSE",
    "score10th": "92%",
    "skills": ["Python", "SQL"],
    "languagesKnown": ["English", "Tamil"]
  }'
```

---

## 🎨 User Interface Features

### Form Validation
- ✅ Real-time error messages
- ✅ Required field indicators
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Date picker for DOB

### Interactive Elements
- ✅ Skill suggestions (15 predefined options)
- ✅ Language selection (8 options)
- ✅ Chip-based tag system for skills
- ✅ Add custom skills/certifications
- ✅ Edit any step before submitting

### Progress Indicators
- ✅ Step indicator showing current position
- ✅ Back/Next navigation
- ✅ Success message with redirect
- ✅ Loading states during submission

---

## 📊 Data Saved to Database

When onboarding completes, the system:

### 1. Creates Candidate Record
```sql
INSERT INTO candidate (
  first_name, last_name, email, phone_number,
  date_of_birth, gender, address, city, state, pincode,
  aadhar, pan, bank_account_number,
  status, engagement_score, dropout_risk_score,
  risk_category, created_at, updated_at
) VALUES (...)
```

### 2. Creates Education Details
```sql
INSERT INTO education_details (
  candidate_id, board_10th, percentage_10th,
  board_12th, percentage_12th, graduation_degree,
  graduation_field, graduation_percentage, created_at
) VALUES (...)
```

### 3. Creates Personal Details
```sql
INSERT INTO personal_details (
  candidate_id, employment_status, created_at
) VALUES (...)
```

### 4. Creates Skill Assessments (one per skill)
```sql
INSERT INTO skill_assessment (
  candidate_id, skill_name, proficiency_level,
  score, created_at
) VALUES (...)
```

### 5. Initializes Onboarding Progress
```sql
INSERT INTO candidate_onboarding_progress (
  candidate_id, onboarding_step_id, status,
  completion_percentage, created_at
) VALUES (...)
```

---

## 🚀 Next Steps After Onboarding

After a candidate is onboarded, you can:

### 1. View All Candidates
- Go to **Customers** page to see all onboarded candidates

### 2. Access API Data
- Use `/api/candidates` endpoints to fetch data
- Dashboard can use `/api/candidates/stats` for metrics
- View at-risk candidates with `/api/candidates/at-risk`

### 3. Track Engagement
- As candidates engage with platform, `engagement_score` updates
- System monitors `dropout_risk_score` automatically

### 4. Manage Mentors
- Assign mentors to candidates
- Track interactions and follow-ups
- Generate intervention recommendations

### 5. Process Placement
- Match candidates to job openings
- Track placement outcomes
- Monitor retention and success rates

---

## 🔐 Security & Validation

### Data Protection
- ✅ Email validation before saving
- ✅ Phone number format validation
- ✅ Sensitive data (Aadhar, PAN) optional
- ✅ Date validation (cannot be future date)

### API Security
- ✅ CORS enabled for frontend
- ✅ Input validation on all fields
- ✅ Transaction rollback on error
- ✅ Comprehensive error logging

### Error Handling
- ✅ Duplicate email/phone detection
- ✅ Invalid date format handling
- ✅ Database constraint violations caught
- ✅ User-friendly error messages

---

## 📈 Monitoring & Metrics

### Available Endpoints for Analytics
```
GET /api/candidates/stats
Response: {
  "totalCandidates": 25,
  "activeCandidates": 23,
  "atRiskCandidates": 5
}
```

### Key Metrics Tracked
- Total onboarded candidates
- Candidates by location
- Engagement score distribution
- Dropout risk distribution
- Skill distribution across candidates

---

## 🐛 Troubleshooting

### Issue: "Onboard New Candidate" button not visible
**Solution**: 
- Refresh the page (Cmd+R or Ctrl+R)
- Make sure you're logged in
- Check sidebar scrolls if button is below fold

### Issue: Form won't submit
**Solution**:
- Check browser console for errors (F12)
- Verify all required fields are filled
- Check backend is running (http://localhost:3001)

### Issue: Data not saved
**Solution**:
- Verify PostgreSQL is running
- Check backend logs for database errors
- Ensure migration ran successfully: `V1__initial_schema.sql`

### Issue: API returning 404
**Solution**:
- Ensure `/api/candidates` endpoint is accessible
- Check backend is running on correct port
- Verify CandidateController is deployed

---

## 📞 Support Resources

| Component | Location | Purpose |
|-----------|----------|---------|
| Frontend Form | `/frontend/src/pages/Onboarding.tsx` | Main orchestrator |
| Form Components | `/frontend/src/components/onboarding/` | Step forms |
| Backend Service | `/backend/src/main/java/.../service/OnboardingService.java` | Business logic |
| API Controller | `/backend/src/main/java/.../controller/CandidateController.java` | REST endpoints |
| Database Schema | `/backend/src/main/resources/db/migration/V1__initial_schema.sql` | Tables & constraints |

---

## ✅ Verification Checklist

Before using the workflow, verify:

- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:5173 (or configured port)
- [ ] PostgreSQL database created and migration applied
- [ ] Can see "Onboard New Candidate" in sidebar
- [ ] Can load http://localhost:3001/onboard without errors
- [ ] Form fields appear and are interactive
- [ ] Can submit sample data and see success message

---

## 🎯 Success Criteria

Workflow is working correctly when:

✅ Can access onboarding page via navigation  
✅ All 4 form steps work and validate  
✅ Can navigate back and forth between steps  
✅ Data persists when moving between steps  
✅ Review page shows all entered data  
✅ Submission succeeds with success message  
✅ Candidate appears in `/api/candidates` endpoint  
✅ Candidate data is in PostgreSQL database  

---

**Your onboarding workflow is now ready! Start onboarding candidates! 🚀**
