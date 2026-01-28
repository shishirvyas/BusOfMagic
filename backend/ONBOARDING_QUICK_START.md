# 🎯 Onboarding Workflow - Quick Start

## Where to Find It

### Via Navigation (Easy)
1. Sign in to your dashboard
2. Look at **left sidebar**
3. Click **"Onboard New Candidate"** (blue button at bottom)

### Via Direct URL
```
http://localhost:3001/onboard
```

---

## What It Does

Complete 4-step workflow to onboard new candidates:

```
Step 1: Personal Details    → Fill in name, email, address, etc.
Step 2: Education Details   → Fill in school, college, scores
Step 3: Skills & Languages  → Select/add skills, languages
Step 4: Review & Submit     → Review all info, then submit
```

---

## What Gets Saved

When you submit, the system automatically creates/updates:

| Table | Data |
|-------|------|
| `candidate` | Name, email, phone, address, AI fields |
| `education_details` | School, board, degrees, scores |
| `personal_details` | Employment status, financial info |
| `skill_assessment` | Skills with proficiency level |
| `onboarding_progress` | Tracks workflow completion |

---

## API Endpoints

```bash
# Onboard a new candidate
POST /api/candidates/onboard
Body: { firstName, lastName, email, phone, ... }

# Get all candidates
GET /api/candidates

# Get active candidates
GET /api/candidates/active

# Get at-risk candidates
GET /api/candidates/at-risk?riskThreshold=50

# Get candidate by ID
GET /api/candidates/{id}

# Get statistics
GET /api/candidates/stats
```

---

## Workflow at a Glance

```
┌─────────────────────────┐
│  1. Personal Details    │
│  └─ Name, email, phone  │
└────────┬────────────────┘
         │ Next
         ▼
┌─────────────────────────┐
│  2. Education Details   │
│  └─ School, college     │
└────────┬────────────────┘
         │ Next
         ▼
┌─────────────────────────┐
│  3. Skills & Languages  │
│  └─ Technical skills    │
└────────┬────────────────┘
         │ Next
         ▼
┌─────────────────────────┐
│  4. Review & Submit     │
│  └─ Confirm & save      │
└────────┬────────────────┘
         │ Submit
         ▼
   ✅ Success!
   Candidate saved
```

---

## Test It Out

### Quick Test
1. Go to **Dashboard** → **"Onboard New Candidate"**
2. Fill in sample data:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - City: Mumbai, State: Maharashtra
   - School: CBSE, Score: 85%
   - Skills: JavaScript, React
3. Click **Submit**
4. Should see **success message**
5. Check customers list to see new candidate

### Via API (Advanced)
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
    "education10th": "CBSE",
    "score10th": "88%",
    "skills": ["Python", "SQL"],
    "languagesKnown": ["English", "Hindi"]
  }'
```

---

## Key Features

✅ **Multi-step form** with validation  
✅ **Skill suggestions** (15 predefined)  
✅ **Language selection** (8 options)  
✅ **Custom skill/cert input**  
✅ **Review before submit**  
✅ **Navigate back & edit**  
✅ **Auto-save progress**  
✅ **Success messaging**  

---

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| Button not visible | Scroll sidebar down |
| Form won't submit | Check all required fields |
| API error 404 | Ensure backend running on :3001 |
| Data not saved | Check PostgreSQL running |
| Validation error | See error message on form |

---

## What's Next?

After onboarding:
1. **View all candidates** → Go to Customers page
2. **Check stats** → Use `/api/candidates/stats`
3. **Find at-risk** → Use `/api/candidates/at-risk`
4. **Assign mentors** → (Coming soon)
5. **Track engagement** → Dashboard will update automatically

---

**You're all set! Start onboarding candidates! 🚀**
