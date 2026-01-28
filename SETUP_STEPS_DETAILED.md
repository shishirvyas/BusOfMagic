# 📊 DATABASE SETUP - QUICK START GUIDE

## ✅ PREREQUISITES CHECK

### Do You Have PostgreSQL Installed?

**Check by opening Command Prompt and running:**
```bash
psql --version
```

If you see a version number, PostgreSQL is installed ✅
If you get "command not found", you need to install PostgreSQL

---

## 📥 If PostgreSQL is NOT Installed

### Windows Installation (5 minutes)

1. **Download**: https://www.postgresql.org/download/windows/
2. **Run Installer**:
   - Select default options
   - Note the password you create for `postgres` user
   - Keep port as 5432
   - Select pgAdmin (recommended)
3. **Complete Installation**
4. **Verify**: Open Command Prompt and run `psql --version`

---

## 🚀 EXECUTE DATABASE SETUP

### Option 1: Using Command Line (Fastest)

```bash
# Windows Command Prompt or PowerShell
cd C:\projects\magic-bus\backend

# Execute the SQL script directly
psql -U postgres -h localhost -d postgres -f DATABASE_SETUP_STANDALONE.sql
```

**What happens:**
- Creates database `magic_bus`
- Creates all 9 tables
- Creates 25+ indexes
- Seeds data (6 onboarding steps)
- Takes ~5 seconds

### Option 2: Using pgAdmin (GUI)

**If you prefer graphical interface:**

1. **Open pgAdmin** (should be installed with PostgreSQL)
2. **Connect to PostgreSQL server**:
   - Right-click "Servers" → "Register" → "Server"
   - Name: `PostgreSQL`
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: (what you set during install)
3. **Create database**:
   - Right-click "Databases" → "Create" → "Database"
   - Name: `magic_bus`
   - Click "Save"
4. **Run SQL script**:
   - Right-click `magic_bus` database → "Query Tool"
   - Open file: `C:\projects\magic-bus\backend\DATABASE_SETUP_STANDALONE.sql`
   - Copy all content
   - Paste in Query Tool
   - Click "Execute" (▶️ button)

---

## ✅ VERIFY IT WORKED

### Run These Verification Queries

**In PostgreSQL (psql or pgAdmin):**

```sql
-- Should return: 9
SELECT COUNT(*) as total_tables 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN (
    'candidate', 'personal_details', 'education_details',
    'candidate_skills', 'candidate_languages', 'onboarding_progress',
    'otp_verification', 'audit_log', 'onboarding_step'
);

-- Should return: 6 rows
SELECT * FROM onboarding_step ORDER BY step_order;

-- Should show table list
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

---

## 🎯 NEXT STEPS

### After Database is Ready:

1. **Update application.properties** (in backend)
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/magic_bus
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

2. **Run Spring Boot**
   ```bash
   cd c:\projects\magic-bus\backend
   ./gradlew bootRun
   ```

3. **Backend starts successfully** ✅

4. **Implement 6 API endpoints** (see INDIVIDUAL_SIGNUP_FLOW.md)

---

## 🆘 HELP - I GET AN ERROR

### Error: "psql: command not found"
→ PostgreSQL not installed or not in PATH
→ Install PostgreSQL or add to system PATH

### Error: "FATAL: role 'postgres' does not exist"
→ PostgreSQL install not complete
→ Reinstall PostgreSQL

### Error: "Database 'magic_bus' already exists"
→ It's fine! Just skip the CREATE DATABASE line
→ Re-running the script is safe

### Error: "Could not connect to server"
→ PostgreSQL not running
→ Start PostgreSQL service/pgAdmin

---

## 📋 SUMMARY

| Step | What To Do | Time |
|------|-----------|------|
| 1 | Verify PostgreSQL installed | 1 min |
| 2 | Start PostgreSQL | 1 min |
| 3 | Execute SQL script | 1 min |
| 4 | Verify with queries | 2 min |
| 5 | Update app config | 1 min |
| 6 | Run Spring Boot | 2 min |
| **Total** | **Complete Setup** | **~8 min** |

---

## ⏱️ Quick Command Reference

### Start PostgreSQL (Windows)
```bash
# If using Windows Service
net start postgresql-x64-15
# Or open pgAdmin
```

### Run SQL Script
```bash
psql -U postgres -d magic_bus -f DATABASE_SETUP_STANDALONE.sql
```

### Connect to Database
```bash
psql -U postgres -d magic_bus
```

### Test Connection
```bash
psql -U postgres -h localhost -d magic_bus -c "SELECT 1;"
```

### Run Spring Boot
```bash
cd backend
./gradlew bootRun
```

---

**Ready? Start with Step 1 above!** 🚀
