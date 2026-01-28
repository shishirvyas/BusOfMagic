# 🚀 EXECUTE DATABASE SETUP NOW

## Step 1: Open PostgreSQL Connection

### Using pgAdmin (GUI - Easiest)
1. Open pgAdmin
2. Right-click on your server
3. Click "Open Database" or use Query Tool

### Using Command Line
```bash
psql -U postgres -h localhost
```

---

## Step 2: Create Database (if needed)

```sql
CREATE DATABASE magic_bus;
```

Then connect to it:
```sql
\c magic_bus
```

---

## Step 3: Execute SQL Script

### Option 1: Direct File Execution
```bash
psql -U postgres -h localhost -d magic_bus -f "C:\projects\magic-bus\backend\DATABASE_SETUP_STANDALONE.sql"
```

### Option 2: Copy-Paste in Query Tool
1. Open: `C:\projects\magic-bus\backend\DATABASE_SETUP_STANDALONE.sql`
2. Copy ALL content
3. Paste in PostgreSQL Query Tool
4. Click Execute

---

## Step 4: Verify Installation

```sql
-- Check all tables created (should return 9)
SELECT COUNT(*) as total_tables 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN (
    'candidate', 'personal_details', 'education_details',
    'candidate_skills', 'candidate_languages', 'onboarding_progress',
    'otp_verification', 'audit_log', 'onboarding_step'
);

-- Check seed data (should return 6)
SELECT * FROM onboarding_step;
```

✅ If both return expected results, you're DONE!

---

## 🎯 Then What?

Once database is set up:
1. Configure `application.properties` with your DB credentials
2. Run Spring Boot: `./gradlew bootRun`
3. Backend will start successfully
4. Implement the 6 API endpoints

**That's it!** 🎉
