# 🚀 Backend API - Quick Start Guide

## ✅ What's Done

- ✅ Database schema created (9 tables on Azure PostgreSQL)
- ✅ JPA entity models implemented
- ✅ Spring Data repositories created
- ✅ DTOs for all requests/responses
- ✅ SignupService with business logic
- ✅ SignupController with 6 REST endpoints
- ✅ Global exception handling
- ✅ PostgreSQL driver configured
- ✅ Environment variables set up (.env.local)

---

## 🎯 Running the Backend

### Step 1: Verify Environment Setup

```bash
# Check if .env.local exists (should have Azure credentials)
cat c:\projects\magic-bus\.env.local

# Should show:
# DB_HOST=recursive-kind-db.postgres.database.azure.com
# DB_PORT=5432
# DB_USER=recursivekindadmin
# DB_PASSWORD=Shishir#901
# DB_NAME=postgres
```

### Step 2: Start the Backend

```bash
cd c:\projects\magic-bus\backend
./gradlew bootRun
```

**Expected Output**:
```
Started MagicBusApplication in X.XXX seconds
HikariPool-1 - Starting...
HikariPool-1 - Added connection conn0
Database available
```

### Step 3: Verify Backend is Running

```bash
# Test health endpoint
curl http://localhost:8080/api/health

# Should return 200 OK
```

---

## 📝 Testing the Signup Flow

### Method 1: Using curl (Command Line)

```bash
# Step 1: Send OTP
curl -X POST http://localhost:8080/api/signup/send-otp \
  -H "Content-Type: application/json" \
  -d '{"contact":"john@example.com","contactType":"EMAIL"}'

# Response:
# {
#   "success": true,
#   "message": "OTP sent successfully",
#   "otpCode": "123456",
#   "expiryMinutes": 10
# }

# Copy the otpCode from response

# Step 2: Verify OTP
curl -X POST http://localhost:8080/api/signup/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"contact":"john@example.com","otpCode":"123456"}'

# Response:
# {
#   "success": true,
#   "message": "OTP verified successfully",
#   "candidateId": 1,
#   "nextStep": "personal-details"
# }

# Copy the candidateId from response

# Step 3: Save Personal Details
curl -X POST http://localhost:8080/api/signup/personal-details \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": 1,
    "employmentStatus": "EMPLOYED",
    "currentJobTitle": "Software Engineer",
    "currentCompanyName": "Tech Corp",
    "careerInterests": "[\"Web Development\"]",
    "preferredJobTypes": "FULL_TIME",
    "availabilityForInternship": true
  }'

# Step 4: Save Education Details
curl -X POST http://localhost:8080/api/signup/education-details \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": 1,
    "tenthBoard": "CBSE",
    "tenthYearOfPassing": 2015,
    "tenthPercentage": 85.5,
    "graduationDegree": "B.Tech",
    "graduationYear": 2021,
    "graduationPercentage": 82.3,
    "graduationUniversity": "Bangalore University"
  }'

# Step 5: Save Skills
curl -X POST http://localhost:8080/api/signup/skills \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": 1,
    "skills": [
      {"skillName": "Java", "proficiencyLevel": "EXPERT"},
      {"skillName": "Spring Boot", "proficiencyLevel": "ADVANCED"}
    ],
    "languages": [
      {"languageName": "English", "proficiencyLevel": "FLUENT"}
    ]
  }'

# Step 6: Complete Signup
curl -X POST "http://localhost:8080/api/signup/complete?candidateId=1"

# All done! ✅
```

### Method 2: Using Postman

1. **Import Collection**:
   - Open Postman
   - File → Import
   - Select: `POSTMAN_COLLECTION.json`

2. **Run Requests**:
   - Click "1. Send OTP"
   - Copy `otpCode` from response
   - Click "2. Verify OTP"
   - Paste OTP code
   - Copy `candidateId` from response
   - Update `candidateId` in remaining requests
   - Run "3. Save Personal Details" → "6. Complete Signup"

### Method 3: Using Frontend

Start the frontend and complete signup flow:

```bash
cd c:\projects\magic-bus\frontend
npm run dev
```

Open: `http://localhost:3001/individualsignup`

The frontend will automatically call the backend endpoints!

---

## 🔍 Database Verification

### Connect to Azure PostgreSQL

```bash
# Using psql (if installed)
psql -U recursivekindadmin \
  -h recursive-kind-db.postgres.database.azure.com \
  -d postgres

# When prompted for password, enter: Shishir#901
```

### Query the Data

```sql
-- Check if candidate was created
SELECT * FROM candidate;

-- Check OTP records
SELECT * FROM otp_verification;

-- Check personal details
SELECT * FROM personal_details;

-- Check education details
SELECT * FROM education_details;

-- Check skills
SELECT * FROM candidate_skills;

-- Check languages
SELECT * FROM candidate_languages;

-- Check onboarding progress
SELECT * FROM onboarding_progress;
```

---

## 📊 Expected Database State After Complete Signup

```
candidate table (1 row)
├── id: 1
├── firstName: "John"
├── lastName: "Doe"
├── email: "john@example.com"
├── phoneNumber: "9876543210"
├── gender: "MALE"
├── status: "ACTIVE"
├── onboarding_status: "COMPLETE"
└── created_at: 2026-01-28 10:30:00

personal_details table (1 row)
├── id: 1
├── candidate_id: 1
├── employmentStatus: "EMPLOYED"
├── currentJobTitle: "Software Engineer"
├── careerInterests: "[\"Web Development\"]"
└── ...

education_details table (1 row)
├── id: 1
├── candidate_id: 1
├── tenthBoard: "CBSE"
├── graduationDegree: "B.Tech"
├── graduationYear: 2021
└── ...

candidate_skills table (2 rows)
├── id: 1, candidate_id: 1, skillName: "Java", proficiencyLevel: "EXPERT"
└── id: 2, candidate_id: 1, skillName: "Spring Boot", proficiencyLevel: "ADVANCED"

candidate_languages table (1 row)
├── id: 1, candidate_id: 1, languageName: "English", proficiencyLevel: "FLUENT"

onboarding_progress table (1 row)
├── id: 1
├── candidate_id: 1
├── personalDetailsCompleted: true
├── educationDetailsCompleted: true
├── skillsCompleted: true
├── overallCompleted: true
├── progressPercentage: 100
└── ...
```

---

## ⚡ Quick Test Script

Save as `test-signup.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"
CONTACT="test-$(date +%s)@example.com"

echo "🔵 Testing Signup Flow..."
echo "Contact: $CONTACT"
echo ""

# Step 1: Send OTP
echo "1️⃣  Sending OTP..."
OTP_RESPONSE=$(curl -s -X POST $BASE_URL/signup/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"contact\":\"$CONTACT\",\"contactType\":\"EMAIL\"}")

echo "$OTP_RESPONSE" | jq '.'
OTP_CODE=$(echo "$OTP_RESPONSE" | jq -r '.otpCode')
echo "OTP Code: $OTP_CODE"
echo ""

# Step 2: Verify OTP
echo "2️⃣  Verifying OTP..."
VERIFY_RESPONSE=$(curl -s -X POST $BASE_URL/signup/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"contact\":\"$CONTACT\",\"otpCode\":\"$OTP_CODE\"}")

echo "$VERIFY_RESPONSE" | jq '.'
CANDIDATE_ID=$(echo "$VERIFY_RESPONSE" | jq -r '.candidateId')
echo "Candidate ID: $CANDIDATE_ID"
echo ""

# Step 3: Personal Details
echo "3️⃣  Saving Personal Details..."
curl -s -X POST $BASE_URL/signup/personal-details \
  -H "Content-Type: application/json" \
  -d "{\"candidateId\":$CANDIDATE_ID,\"employmentStatus\":\"EMPLOYED\"}" | jq '.'
echo ""

# Step 4: Education Details
echo "4️⃣  Saving Education Details..."
curl -s -X POST $BASE_URL/signup/education-details \
  -H "Content-Type: application/json" \
  -d "{\"candidateId\":$CANDIDATE_ID,\"graduationDegree\":\"B.Tech\",\"graduationYear\":2021}" | jq '.'
echo ""

# Step 5: Skills
echo "5️⃣  Saving Skills..."
curl -s -X POST $BASE_URL/signup/skills \
  -H "Content-Type: application/json" \
  -d "{\"candidateId\":$CANDIDATE_ID,\"skills\":[{\"skillName\":\"Java\",\"proficiencyLevel\":\"EXPERT\"}],\"languages\":[{\"languageName\":\"English\",\"proficiencyLevel\":\"FLUENT\"}]}" | jq '.'
echo ""

# Step 6: Complete
echo "6️⃣  Completing Signup..."
curl -s -X POST "$BASE_URL/signup/complete?candidateId=$CANDIDATE_ID" | jq '.'
echo ""

echo "✅ Signup flow completed!"
```

Run it:
```bash
chmod +x test-signup.sh
./test-signup.sh
```

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution**: 
- Verify `.env.local` exists with correct credentials
- Check Azure PostgreSQL is accessible
- Run: `ping recursive-kind-db.postgres.database.azure.com`

### Issue: "Port 8080 already in use"
**Solution**:
```bash
# Find and kill the process
lsof -i :8080
kill -9 <PID>

# Or use different port
./gradlew bootRun -Dserver.port=8081
```

### Issue: "OTP verification failed"
**Solution**:
- Check OTP hasn't expired (valid for 10 minutes)
- Verify OTP code from response
- Maximum 5 attempts allowed

### Issue: "Candidate ID not found"
**Solution**:
- Verify OTP was verified first
- Use the candidateId from verify-otp response
- Don't skip steps

---

## 📚 API Summary

| Step | Endpoint | Method | Input | Output |
|------|----------|--------|-------|--------|
| 1 | `/send-otp` | POST | contact, contactType | otpCode |
| 2 | `/verify-otp` | POST | contact, otpCode | candidateId |
| 3 | `/personal-details` | POST | candidateId, details | success |
| 4 | `/education-details` | POST | candidateId, education | success |
| 5 | `/skills` | POST | candidateId, skills, languages | success |
| 6 | `/complete` | POST | candidateId | status |

---

## 🎉 Success!

When everything works:

1. ✅ Backend starts without errors
2. ✅ Health endpoint responds
3. ✅ OTP endpoint returns code
4. ✅ All 6 endpoints work in sequence
5. ✅ Data appears in database
6. ✅ Frontend can call backend

**You're ready to integrate with the React frontend!**

---

## 🔗 Next Steps

1. **Test Backend**: Follow this guide
2. **Test Frontend**: `cd frontend && npm run dev`
3. **Full Integration**: Complete signup flow in browser
4. **Production**: Deploy to cloud

Happy coding! 🚀
