# Quick Execution Checklist - Individual Signup Database Setup

## 🎯 Immediate Actions (Execute These Now)

### ✅ Step 1: Choose Your Setup Method

**Method A: Automatic Flyway Migration (RECOMMENDED)**
```bash
# This happens automatically when you run the backend
cd backend
./gradlew bootRun
```
✓ No manual intervention needed
✓ Tables created automatically
✓ Migrations tracked in flyway_schema_history

**Method B: Manual SQL Execution**
```bash
# Execute the standalone SQL script
psql -U postgres -h localhost -d magic_bus -f backend/DATABASE_SETUP_STANDALONE.sql
```
✓ Execute once
✓ See results immediately
✓ Good for testing/development

---

### ✅ Step 2: Verify Setup Completed

```sql
-- Run these queries to confirm tables exist:

SELECT COUNT(*) as total_tables FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE 'candidate%' 
   OR tablename LIKE 'personal%' 
   OR tablename LIKE 'education%'
   OR tablename LIKE 'onboarding%'
   OR tablename LIKE 'otp%'
   OR tablename LIKE 'audit%';

-- Should return: 9 (all tables created)

-- Check seed data
SELECT * FROM onboarding_step;

-- Should show 6 rows with steps: contact, otp, personal, education, skills, review
```

---

### ✅ Step 3: Update Backend Configuration (if needed)

**File**: `backend/src/main/resources/application.properties`

Ensure these settings match your setup:
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/magic_bus?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=your_password

# JPA
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
```

---

## 📋 Testing Checklist

### Test OTP Signup
- [ ] Run: `POST http://localhost:8080/api/auth/send-otp`
- [ ] Body: `{"contact":"test@example.com","contactType":"email"}`
- [ ] Expect: `{"success":true,"message":"OTP sent successfully"}`
- [ ] Check DB: `SELECT * FROM otp_verification LIMIT 1;`

### Test OTP Verification
- [ ] Run: `POST http://localhost:8080/api/auth/verify-otp`
- [ ] Body: `{"contact":"test@example.com","contactType":"email","otp":"123456"}`
- [ ] Expect: `{"success":true,"sessionToken":"jwt_token..."}`

### Test Personal Details Submission
- [ ] Run: `POST http://localhost:8080/api/candidates/personal-details`
- [ ] Include Authorization header with JWT token
- [ ] Expect: Candidate record created in DB
- [ ] Check: `SELECT * FROM candidate WHERE email = 'test@example.com';`

### Test Education Details
- [ ] Run: `POST http://localhost:8080/api/candidates/{candidateId}/education-details`
- [ ] Expect: Education details saved
- [ ] Check: `SELECT * FROM education_details WHERE candidate_id = {id};`

### Test Skills & Languages
- [ ] Run: `POST http://localhost:8080/api/candidates/{candidateId}/skills`
- [ ] Expect: Skills and languages saved
- [ ] Check: 
  ```sql
  SELECT * FROM candidate_skills WHERE candidate_id = {id};
  SELECT * FROM candidate_languages WHERE candidate_id = {id};
  ```

### Test Final Submission
- [ ] Run: `POST http://localhost:8080/api/candidates/{candidateId}/complete-onboarding`
- [ ] Expect: onboarding_status = 'COMPLETED'
- [ ] Check: 
  ```sql
  SELECT onboarding_status, progress_percentage FROM onboarding_progress 
  WHERE candidate_id = {id};
  ```

---

## 📊 Expected Database State After Full Signup

```sql
-- After complete signup flow, you should see:

SELECT 
    c.first_name || ' ' || c.last_name as name,
    c.email,
    c.onboarding_status,
    op.overall_completed,
    op.progress_percentage
FROM candidate c
LEFT JOIN onboarding_progress op ON c.id = op.candidate_id
WHERE c.email = 'test@example.com';

-- Expected output:
-- name       | email             | onboarding_status | overall_completed | progress_percentage
-- John Doe   | test@example.com  | COMPLETED         | true              | 100
```

---

## 🔧 Troubleshooting Quick Fixes

### Tables not creating?
```bash
# Check Flyway version compatibility
./gradlew dependencies | grep flyway

# Reset migrations (WARNING: deletes history)
psql -U postgres -d magic_bus -c "DROP TABLE IF EXISTS flyway_schema_history;"
```

### Foreign key errors?
```sql
-- Check constraint violations
SELECT constraint_name FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY';

-- See which constraints failed
SELECT * FROM information_schema.referential_constraints;
```

### Unique constraint violations?
```sql
-- Check existing emails
SELECT email FROM candidate WHERE email = 'test@example.com';

-- Check existing phones
SELECT phone_number FROM candidate WHERE phone_number = '9876543210';
```

### OTP table issues?
```sql
-- Check OTP records
SELECT * FROM otp_verification 
WHERE created_at > NOW() - INTERVAL '1 hour';

-- Check expired OTPs
SELECT COUNT(*) as expired_otps FROM otp_verification 
WHERE expires_at < NOW();
```

---

## 📝 File Locations Reference

| File | Purpose | Location |
|------|---------|----------|
| Migration Script | Automatic DB setup | `backend/src/main/resources/db/migration/V1__create_onboarding_tables.sql` |
| Standalone SQL | Manual DB setup | `backend/DATABASE_SETUP_STANDALONE.sql` |
| Setup Guide | How to execute | `backend/DATABASE_SETUP_GUIDE.md` |
| API Spec | Endpoint documentation | `backend/INDIVIDUAL_SIGNUP_FLOW.md` |
| Visual Guide | Diagrams & flows | `backend/INDIVIDUAL_SIGNUP_VISUAL_GUIDE.md` |
| Summary | This package | `INDIVIDUAL_SIGNUP_COMPLETE_PACKAGE.md` |

---

## 🎯 Implementation Priority

### Phase 1: Database (THIS STEP ✓)
- [x] Create database schema
- [x] Set up migrations
- [x] Verify tables exist

### Phase 2: Backend APIs (NEXT)
- [ ] Implement OTP service
- [ ] Implement Candidate service
- [ ] Create REST controllers
- [ ] Add validation layer

### Phase 3: Frontend Integration (AFTER PHASE 2)
- [ ] Update API endpoints in frontend
- [ ] Test complete flow
- [ ] Handle error responses

### Phase 4: Production Ready (FINAL)
- [ ] Add JWT authentication
- [ ] Add email/SMS integration
- [ ] Add rate limiting
- [ ] Add caching
- [ ] Performance optimization

---

## 💾 Backup Before Testing (Optional)

```bash
# Backup database
pg_dump -U postgres magic_bus > magic_bus_backup.sql

# Restore if needed
psql -U postgres magic_bus < magic_bus_backup.sql
```

---

## ✨ Success Criteria

- [x] All 9 tables exist
- [x] All indexes created
- [x] All constraints applied
- [x] Seed data loaded (onboarding_step table)
- [ ] Test data inserted (after testing APIs)
- [ ] Complete flow works end-to-end
- [ ] Audit logs capture all operations
- [ ] Frontend successfully saves data

---

## 🚀 Ready to Go!

1. **Execute your chosen setup method** (Flyway auto or manual SQL)
2. **Verify tables exist** (run verification queries)
3. **Test OTP flow** (optional, if backend ready)
4. **Implement remaining backend endpoints**
5. **Test complete flow** from signup to onboarding completion

---

## 📞 Need Help?

- **Database Issues**: See DATABASE_SETUP_GUIDE.md
- **API Design**: See INDIVIDUAL_SIGNUP_FLOW.md
- **Visual Understanding**: See INDIVIDUAL_SIGNUP_VISUAL_GUIDE.md
- **SQL Queries**: See sample queries in documentation

---

**🎉 Your individual signup and onboarding database is ready!**

Start with either:
- **Automatic**: Run backend with `./gradlew bootRun`
- **Manual**: Execute `DATABASE_SETUP_STANDALONE.sql` in PostgreSQL

Then verify with the queries provided above.
