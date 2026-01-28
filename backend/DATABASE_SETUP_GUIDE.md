# Database Setup - Quick Execution Guide

## Option 1: Using Flyway Migration (Recommended)

The migration file has already been created at:
```
backend/src/main/resources/db/migration/V1__create_onboarding_tables.sql
```

**How it works:**
1. When you run the Spring Boot application, Flyway will automatically:
   - Detect the migration file
   - Execute it against the configured database
   - Track execution in the `flyway_schema_history` table

**Just run your backend:**
```bash
cd backend
./gradlew bootRun
# or
java -jar build/libs/magic-bus-backend-*.jar
```

Flyway will handle the database setup automatically.

---

## Option 2: Manual SQL Execution (PostgreSQL)

If you prefer to execute the SQL manually:

### Step 1: Connect to your PostgreSQL database
```bash
psql -U postgres -h localhost -d magic_bus
```

Or use pgAdmin:
1. Open pgAdmin
2. Navigate to your database
3. Open Query Tool

### Step 2: Execute the standalone SQL script

**Option A: Using psql command line**
```bash
psql -U postgres -h localhost -d magic_bus -f backend/DATABASE_SETUP_STANDALONE.sql
```

**Option B: Copy-paste in pgAdmin**
1. Open the file: `backend/DATABASE_SETUP_STANDALONE.sql`
2. Copy entire content
3. Paste in Query Tool
4. Click "Execute"

### Step 3: Verify tables were created
```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count total records
SELECT COUNT(*) FROM candidate;
SELECT COUNT(*) FROM personal_details;
SELECT COUNT(*) FROM education_details;
```

---

## Database Connection Configuration

Ensure your `application.properties` has the correct database settings:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/magic_bus?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driverClassName=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

**Important:** 
- Change `ddl-auto=update` to `ddl-auto=validate` if using Flyway
- This prevents JPA from trying to modify tables that Flyway is managing

---

## Table Summary

| Table | Purpose | Records Expected |
|-------|---------|------------------|
| **candidate** | Core user info (name, email, phone, address) | 1 per signup |
| **personal_details** | Extended info (employment, preferences, bank) | 1 per candidate |
| **education_details** | Educational background (10th, 12th, degree) | 1 per candidate |
| **candidate_skills** | Skills (many-to-many) | Multiple per candidate |
| **candidate_languages** | Languages known (many-to-many) | Multiple per candidate |
| **onboarding_progress** | Tracks onboarding completion | 1 per candidate |
| **otp_verification** | OTP management | Multiple per signup |
| **audit_log** | Compliance audit trail | Multiple per action |
| **onboarding_step** | Workflow configuration | 6 records (seed data) |

---

## Testing After Setup

### 1. Test OTP Signup Flow
```bash
curl -X POST http://localhost:8080/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"contact":"test@example.com","contactType":"email"}'
```

Expected response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

### 2. Verify OTP
```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"contact":"test@example.com","contactType":"email","otp":"123456"}'
```

### 3. Save Personal Details
```bash
curl -X POST http://localhost:8080/api/candidates/personal-details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "dateOfBirth": "1995-06-15",
    "gender": "MALE",
    "address": "123 Main St",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  }'
```

### 4. Check Database Records
```sql
-- Check candidates created
SELECT id, first_name, last_name, email, status, onboarding_status 
FROM candidate 
LIMIT 10;

-- Check personal details
SELECT * FROM personal_details LIMIT 10;

-- Check skills
SELECT * FROM candidate_skills LIMIT 10;

-- Check onboarding progress
SELECT candidate_id, personal_details_completed, education_details_completed, 
       skills_completed, overall_completed, progress_percentage
FROM onboarding_progress;
```

---

## Common Issues & Solutions

### Issue 1: Tables already exist
**Error:** `ERROR: relation "candidate" already exists`

**Solution:** 
- The script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times
- If you want to reset, drop tables first:
  ```sql
  DROP TABLE IF EXISTS audit_log CASCADE;
  DROP TABLE IF EXISTS otp_verification CASCADE;
  DROP TABLE IF EXISTS onboarding_progress CASCADE;
  DROP TABLE IF EXISTS candidate_languages CASCADE;
  DROP TABLE IF EXISTS candidate_skills CASCADE;
  DROP TABLE IF EXISTS education_details CASCADE;
  DROP TABLE IF EXISTS personal_details CASCADE;
  DROP TABLE IF EXISTS candidate CASCADE;
  DROP TABLE IF EXISTS onboarding_step CASCADE;
  ```

### Issue 2: Foreign key constraint fails
**Error:** `ERROR: insert or update on table "personal_details" violates foreign key constraint`

**Solution:** 
- This means you're trying to insert into child table before parent table exists
- First create candidate record:
  ```sql
  INSERT INTO candidate (first_name, last_name, phone_number, date_of_birth, 
                        address_line_1, city, state, pincode, gender)
  VALUES ('John', 'Doe', '9876543210', '1995-06-15', '123 Main St', 
          'Bangalore', 'Karnataka', '560001', 'MALE');
  ```

### Issue 3: Database doesn't exist
**Error:** `ERROR: database "magic_bus" does not exist`

**Solution:**
```bash
# Create database
createdb -U postgres magic_bus

# Or in pgAdmin:
# 1. Right-click on Databases
# 2. Create -> Database
# 3. Name: magic_bus
# 4. Click Create
```

### Issue 4: Flyway migration fails
**Error:** `ERROR: Failed to validate schema/migration`

**Solution:**
- Delete migration history and restart:
  ```sql
  DROP TABLE IF EXISTS flyway_schema_history;
  ```
- Then restart the application

---

## Next Steps After Setup

1. ✅ Execute database setup (this guide)
2. Implement backend API endpoints:
   - `POST /api/auth/send-otp`
   - `POST /api/auth/verify-otp`
   - `POST /api/candidates/personal-details`
   - `POST /api/candidates/{id}/education-details`
   - `POST /api/candidates/{id}/skills`
3. Connect frontend to backend APIs
4. Test the complete signup flow
5. Monitor audit logs

---

## Database Diagram

```
┌─────────────────────┐
│    candidate        │ (Core user info)
│ ─────────────────── │
│ id (PK)             │
│ first_name          │
│ last_name           │
│ email (UNIQUE)      │
│ phone (UNIQUE)      │
│ date_of_birth       │
│ address_line_1      │
│ city, state         │
│ pincode             │
│ gender              │
│ status              │
│ onboarding_status   │
└──────┬──────────────┘
       │
       ├──────────────────────┬─────────────────────┬──────────────────┐
       │                      │                     │                  │
       ▼                      ▼                     ▼                  ▼
┌──────────────────┐ ┌─────────────────┐ ┌────────────────┐ ┌──────────────────┐
│ personal_details │ │education_details│ │onboarding_prg  │ │   otp_verify     │
└──────────────────┘ └─────────────────┘ └────────────────┘ └──────────────────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
              ┌──────────────┐ ┌────────────────┐
              │candidate_    │ │candidate_      │
              │skills        │ │languages       │
              └──────────────┘ └────────────────┘
```

---

## Support & Documentation

- **Full flow documentation:** `backend/INDIVIDUAL_SIGNUP_FLOW.md`
- **Frontend source:** `frontend/src/pages/auth/IndividualSignup.tsx`
- **Backend entities:** `backend/src/main/java/com/magicbus/entity/`
- **Database config:** `backend/src/main/resources/application.properties`

---

Good luck with your Magic Bus onboarding implementation! 🚀
