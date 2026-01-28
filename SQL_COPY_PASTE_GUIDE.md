# Copy-Paste SQL Execution Guide

## 🚀 Quickest Way to Setup Database

### Option 1: One-Line Command (Fastest)

```bash
# On Windows (PowerShell)
psql -U postgres -h localhost -d magic_bus -f "C:\projects\magic-bus\backend\DATABASE_SETUP_STANDALONE.sql"

# On Mac/Linux
psql -U postgres -h localhost -d magic_bus -f /path/to/magic-bus/backend/DATABASE_SETUP_STANDALONE.sql
```

### Option 2: Inside PostgreSQL (pgAdmin or psql CLI)

1. **Connect to your database:**
   ```sql
   -- In PostgreSQL client
   \c magic_bus
   ```

2. **Copy the entire content of:**
   ```
   backend/DATABASE_SETUP_STANDALONE.sql
   ```

3. **Paste and execute in your PostgreSQL client**

---

## ✅ Verification Commands (Copy-Paste These)

### Check if tables were created:
```sql
SELECT schemaname, tablename FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN (
    'candidate', 'personal_details', 'education_details',
    'candidate_skills', 'candidate_languages', 'onboarding_progress',
    'otp_verification', 'audit_log', 'onboarding_step'
) ORDER BY tablename;
```

### Expected result (9 rows):
```
schemaname | tablename
-----------+------------------------
public     | audit_log
public     | candidate
public     | candidate_languages
public     | candidate_skills
public     | education_details
public     | onboarding_progress
public     | onboarding_step
public     | otp_verification
public     | personal_details
```

### Check seed data:
```sql
SELECT * FROM onboarding_step ORDER BY step_order;
```

### Expected result (6 rows):
```
id | step_order | step_key  | step_name              | step_description
---|------------|-----------|------------------------|----------------------------------
1  | 1          | contact   | Contact Information    | Provide your email or mobile number
2  | 2          | otp       | OTP Verification       | Verify your email or mobile number
3  | 3          | personal  | Personal Details       | Complete your personal information
4  | 4          | education | Education Details      | Fill in your educational background
5  | 5          | skills    | Skills & Languages     | Share your skills and languages
6  | 6          | review    | Review & Submit        | Review and confirm your information
```

---

## 🧪 Test Data Insertion (After Setup Works)

### Insert a test candidate:
```sql
INSERT INTO candidate (
    first_name, last_name, phone_number, date_of_birth,
    address_line_1, city, state, pincode, gender, email
) VALUES (
    'John', 'Doe', '9876543210', '1995-06-15',
    '123 Main Street', 'Bangalore', 'Karnataka', '560001', 'MALE', 'john@example.com'
) RETURNING id;
```

### Get the returned ID (e.g., 1), then insert personal details:
```sql
INSERT INTO personal_details (
    candidate_id, employment_status, bank_account_number, 
    aadhar_verified
) VALUES (
    1, 'EMPLOYED', '1234567890123456', false
);
```

### Insert education details:
```sql
INSERT INTO education_details (
    candidate_id, tenth_board, tenth_percentage,
    twelfth_board, twelfth_percentage,
    graduation_degree, graduation_specialization, graduation_percentage
) VALUES (
    1, 'CBSE', 85.00, 'CBSE', 90.00, 'B.Tech', 'Computer Science', 8.2
);
```

### Insert skills:
```sql
INSERT INTO candidate_skills (candidate_id, skill_name) VALUES
    (1, 'JavaScript'),
    (1, 'React'),
    (1, 'Node.js'),
    (1, 'Python');
```

### Insert languages:
```sql
INSERT INTO candidate_languages (candidate_id, language_name) VALUES
    (1, 'English'),
    (1, 'Hindi'),
    (1, 'Marathi');
```

### Create onboarding progress:
```sql
INSERT INTO onboarding_progress (
    candidate_id, signup_completed, personal_details_completed,
    education_details_completed, skills_completed, overall_completed,
    current_step, progress_percentage
) VALUES (
    1, true, true, true, true, true, 'completed', 100
);
```

### Check complete data:
```sql
SELECT 
    c.id,
    c.first_name || ' ' || c.last_name as name,
    c.email,
    c.phone_number,
    c.gender,
    c.onboarding_status,
    op.overall_completed,
    op.progress_percentage
FROM candidate c
LEFT JOIN onboarding_progress op ON c.id = op.candidate_id
WHERE c.id = 1;
```

---

## 🔍 Useful Queries to Explore Data

### Get all candidates:
```sql
SELECT id, first_name, last_name, email, phone_number, status, onboarding_status
FROM candidate
ORDER BY created_at DESC;
```

### Get complete profile for a candidate:
```sql
SELECT 
    c.id, c.first_name, c.last_name, c.email, c.phone_number,
    c.date_of_birth, c.gender, c.address_line_1, c.city, c.state,
    pd.employment_status, pd.bank_account_number,
    ed.graduation_degree, ed.graduation_specialization,
    op.overall_completed, op.progress_percentage
FROM candidate c
LEFT JOIN personal_details pd ON c.id = pd.candidate_id
LEFT JOIN education_details ed ON c.id = ed.candidate_id
LEFT JOIN onboarding_progress op ON c.id = op.candidate_id
WHERE c.id = 1;
```

### Get all skills for a candidate:
```sql
SELECT skill_name, proficiency_level, years_of_experience
FROM candidate_skills
WHERE candidate_id = 1
ORDER BY skill_name;
```

### Get all languages for a candidate:
```sql
SELECT language_name, proficiency_level
FROM candidate_languages
WHERE candidate_id = 1
ORDER BY language_name;
```

### Get onboarding progress:
```sql
SELECT 
    candidate_id,
    signup_completed,
    personal_details_completed,
    education_details_completed,
    skills_completed,
    overall_completed,
    current_step,
    progress_percentage
FROM onboarding_progress
WHERE candidate_id = 1;
```

### Get audit log for a candidate:
```sql
SELECT 
    candidate_id,
    action_type,
    entity_type,
    new_values,
    created_at
FROM audit_log
WHERE candidate_id = 1
ORDER BY created_at DESC
LIMIT 10;
```

### Check for duplicate emails:
```sql
SELECT email, COUNT(*) as count
FROM candidate
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;
```

### Check for duplicate phones:
```sql
SELECT phone_number, COUNT(*) as count
FROM candidate
GROUP BY phone_number
HAVING COUNT(*) > 1;
```

### Get candidates by city:
```sql
SELECT id, first_name, last_name, city, state
FROM candidate
WHERE city = 'Bangalore'
ORDER BY created_at DESC;
```

### Get candidates by onboarding status:
```sql
SELECT 
    id, first_name, last_name, onboarding_status, created_at
FROM candidate
WHERE onboarding_status = 'INCOMPLETE'
ORDER BY created_at DESC;
```

### Get candidates who completed onboarding today:
```sql
SELECT 
    id, first_name, last_name, created_at, updated_at
FROM candidate
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

---

## 🛠️ Cleanup Commands (If Needed)

### Drop all tables (WARNING: Deletes all data):
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

### Reset Flyway migration history (if using migrations):
```sql
DROP TABLE IF EXISTS flyway_schema_history;
```

### Delete all candidates (keep structure):
```sql
DELETE FROM candidate;
-- This will cascade delete all related records due to foreign keys
```

### Delete all OTP records:
```sql
DELETE FROM otp_verification;
```

### Delete expired OTPs only:
```sql
DELETE FROM otp_verification
WHERE expires_at < NOW();
```

---

## 📊 Database Statistics Queries

### Table sizes:
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Row counts:
```sql
SELECT 
    tablename,
    (SELECT count(*) FROM candidate) as candidate_count,
    (SELECT count(*) FROM personal_details) as personal_details_count,
    (SELECT count(*) FROM education_details) as education_details_count,
    (SELECT count(*) FROM candidate_skills) as skills_count,
    (SELECT count(*) FROM candidate_languages) as languages_count,
    (SELECT count(*) FROM onboarding_progress) as progress_count,
    (SELECT count(*) FROM otp_verification) as otp_count,
    (SELECT count(*) FROM audit_log) as audit_count
FROM pg_tables
WHERE tablename = 'candidate'
LIMIT 1;
```

### Index information:
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Constraint information:
```sql
SELECT 
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
ORDER BY table_name, constraint_type;
```

---

## 🚀 Quick Start Summary

1. **Create Database** (if not exists):
   ```bash
   createdb -U postgres magic_bus
   ```

2. **Execute Setup**:
   ```bash
   psql -U postgres -d magic_bus -f backend/DATABASE_SETUP_STANDALONE.sql
   ```

3. **Verify**:
   ```sql
   SELECT COUNT(*) as total_tables FROM pg_tables 
   WHERE schemaname = 'public' AND (
       tablename = 'candidate' OR 
       tablename = 'personal_details' OR
       tablename = 'education_details' OR
       tablename = 'candidate_skills' OR
       tablename = 'candidate_languages' OR
       tablename = 'onboarding_progress' OR
       tablename = 'otp_verification' OR
       tablename = 'audit_log' OR
       tablename = 'onboarding_step'
   );
   -- Should return: 9
   ```

4. **Check Seed Data**:
   ```sql
   SELECT COUNT(*) FROM onboarding_step;
   -- Should return: 6
   ```

**Done! Database is ready!** ✅

---

## 💡 Pro Tips

- Always check for existing data before DROP commands
- Use transactions for batch operations: `BEGIN; ... COMMIT;`
- Use EXPLAIN ANALYZE for query optimization
- Monitor slow queries with `log_statement = 'all'`
- Regular backups: `pg_dump -U postgres magic_bus > backup.sql`
- Use indexes for frequently queried columns

---

**Ready to copy-paste and execute! Choose the option that works best for you.** 🚀
