# 🚀 Magic Bus - Project Startup Guide

**Last Updated:** January 28, 2026

---

## ⚡ Quick Start (Copy-Paste Ready)

### Backend Startup
```powershell
cd c:\projects\magic-bus\backend
java -jar build/libs/magic-bus-backend-1.0.0.jar
```

**Alternative (using Gradle):**
```powershell
cd c:\projects\magic-bus\backend
.\gradlew.bat bootRun
```

### Frontend Startup
```powershell
cd c:\projects\magic-bus\frontend
npm run dev
```

---

## 📋 Detailed Startup Instructions

### 1. Backend (Spring Boot)
**Location:** `c:\projects\magic-bus\backend`

**Command:**
```powershell
cd c:\projects\magic-bus\backend
.\gradlew.bat bootRun
```

**Expected Output:**
- Should compile Java files
- Should start on **Port 8080**
- Should show: `Tomcat started on port 8080 (http) with context path '/api'`
- Database migrations auto-run (Flyway)

**Verify Backend is Running:**
```powershell
netstat -ano | findstr ":8080"
```

**Test Endpoint:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/signup/send-otp" -Method POST -ContentType "application/json" -Body '{"contact":"test@example.com","contactType":"EMAIL"}' -UseBasicParsing
```

**Expected Response:**
```json
{"success":true,"otpCode":"0000","expiryMinutes":10,"message":"OTP sent successfully"}
```

---

### 2. Frontend (React + Vite)
**Location:** `c:\projects\magic-bus\frontend`

**Command:**
```powershell
cd c:\projects\magic-bus\frontend
npm run dev
```

**Expected Output:**
- Should show: `VITE v5.4.21  ready in 375 ms`
- Should show: `Local:   http://localhost:3001/`

**Port:** 3001 (if 3000 is in use)

**Access Application:**
- Main app: http://localhost:3001/
- Individual signup: http://localhost:3001/individualsignup
- Onboarding: http://localhost:3001/onboard

---

## 🗄️ Database

**Type:** PostgreSQL (Azure)

**Connection:** `jdbc:postgresql://recursive-kind-db.postgres.database.azure.com:5432/postgres?sslmode=require`

**Auto-Migration:** Flyway (runs automatically on backend startup)

**Migration Files Location:** `backend/src/main/resources/db/migration/`

---

## 🔌 API Endpoints

### Signup Endpoints (Backend Port 8080)

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/signup/send-otp` | POST | `{"contact":"email","contactType":"EMAIL"}` | `{"success":true,"otpCode":"0000"}` |
| `/api/signup/verify-otp` | POST | `{"contact":"email","otpCode":"0000"}` | `{"success":true,"candidateId":123}` |
| `/api/signup/profile-details` | POST | `{"candidateId":123,"firstName":"John","lastName":"Doe","dateOfBirth":"2000-01-01"}` | `{"success":true}` |
| `/api/signup/complete` | POST | Query: `?candidateId=123` | `{"success":true,"message":"Signup completed"}` |

---

## 🔧 Common Issues & Solutions

### Issue: Backend won't start with gradlew.bat
**Solution:**
```powershell
# Make sure you're in the backend directory
cd c:\projects\magic-bus\backend

# Use explicit invocation
.\gradlew.bat bootRun

# OR use explicit path
& ".\gradlew.bat" bootRun
```

**WRONG:**
```powershell
# Don't do this from root directory
cd c:\projects\magic-bus
./gradlew.bat bootRun  # ❌ Will fail
```

---

### Issue: Port already in use
```powershell
# Check what's using port 8080
netstat -ano | findstr ":8080"

# Kill the process (replace PID with actual process ID)
taskkill /PID 9776 /F
```

---

### Issue: Frontend not connecting to backend
- Verify backend is running on port 8080
- Check CORS is enabled in `SignupController.java`: `@CrossOrigin(origins = "http://localhost:3001")`
- Frontend API endpoint: `/signup/send-otp` (not `/api/signup/send-otp` - the `/api` prefix is added by nginx/proxy)

---

### Issue: Database migration failing
- Check migration file in: `backend/src/main/resources/db/migration/`
- Expected format: `V1__name.sql`, `V2__name.sql` (sequential numbering)
- Current migrations:
  - `V1__initial_schema.sql` - Initial database schema
  - `V2__Fix_OTP_Contact_Type_Constraint.sql` - OTP contact type constraint fix

---

## 📊 Project Structure

```
c:\projects\magic-bus\
├── backend/                          # Spring Boot application
│   ├── build.gradle
│   ├── gradlew.bat                   # Gradle wrapper (use this to run)
│   ├── src/
│   │   ├── main/java/com/magicbus/
│   │   │   ├── controller/           # REST controllers
│   │   │   ├── service/              # Business logic
│   │   │   ├── entity/               # JPA entities
│   │   │   ├── dto/                  # Data transfer objects
│   │   │   └── repository/           # Database repositories
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/         # Flyway migrations
│   └── build/                        # Compiled output
│
├── frontend/                         # React + TypeScript application
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── pages/auth/
│   │   │   └── IndividualSignup.tsx  # Main signup page
│   │   ├── components/auth/
│   │   │   ├── IndividualSignupForm.tsx
│   │   │   ├── OTPVerification.tsx
│   │   │   └── CompleteSignup.tsx
│   │   ├── services/
│   │   │   └── api.ts                # API client with interceptors
│   │   └── context/
│   │       └── ErrorContext.tsx      # Global error handling
│   └── node_modules/
│
└── STARTUP_COMMANDS.md              # 👈 This file
```

---

## 🎯 Current Development Focus

### Signup Flow (3 Steps)
1. **Contact Entry** → Send OTP
2. **OTP Verification** → Verify OTP (Backend: `verify-otp`)
3. **Profile Completion** → Save name, DOB, redirect to onboard

### Known Implementation Status
- ✅ Backend API endpoints all working
- ✅ Frontend pages created
- ✅ Database migrations working
- ✅ Error handling system implemented
- ✅ OTP static value "0000" for testing
- ⏳ Frontend state navigation (handleVerifyOTP added)

---

## 🧪 Testing Signup Flow

### Step 1: Send OTP
```powershell
$body = @{
    contact = "test@example.com"
    contactType = "EMAIL"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/signup/send-otp" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Step 2: Verify OTP
```powershell
$body = @{
    contact = "test@example.com"
    otpCode = "0000"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/signup/verify-otp" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

---

## 🔐 Environment Details

- **Java Version:** 17.0.17
- **Spring Boot:** 3.2.0
- **Node.js:** (check with `node --version`)
- **npm:** (check with `npm --version`)
- **Vite:** 5.4.21
- **React:** Latest (check package.json)
- **PostgreSQL:** Version 12+ (Azure managed)

---

## 💡 Quick Commands Reference

| Task | Command |
|------|---------|
| Start Backend | `cd c:\projects\magic-bus\backend && .\gradlew.bat bootRun` |
| Start Frontend | `cd c:\projects\magic-bus\frontend && npm run dev` |
| Build Backend | `cd c:\projects\magic-bus\backend && .\gradlew.bat clean build` |
| Install Dependencies | `cd c:\projects\magic-bus\frontend && npm install` |
| Check Backend Port | `netstat -ano \| findstr ":8080"` |
| Check Frontend Port | `netstat -ano \| findstr ":3001"` |
| Kill Process | `taskkill /PID {pid} /F` |
| Test Signup API | See Testing section above |

---

## 📝 Notes for Future Development

- Test OTP value is hardcoded as "0000" in `SignupService.java` line 45
- All API responses are tested and working (verified via PowerShell)
- Frontend hot-reload enabled (Vite)
- Backend hot-reload enabled (Spring DevTools)
- CORS configured for `http://localhost:3001`

---

**Remember:** Always start from the correct directory (`backend/` or `frontend/`) when using `.\gradlew.bat` or `npm` commands!
