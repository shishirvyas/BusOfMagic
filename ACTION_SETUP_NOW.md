# 🎯 IMMEDIATE ACTION - DATABASE SETUP

## ⚡ QUICK START (Pick ONE)

### ✅ I HAVE PostgreSQL Running

**Run this command NOW in PowerShell:**
```powershell
psql -U postgres -h localhost -d postgres -f "C:\projects\magic-bus\backend\DATABASE_SETUP_STANDALONE.sql"
```

**Then verify:**
```powershell
psql -U postgres -h localhost -d magic_bus -c "SELECT COUNT(*) FROM onboarding_step;"
# Should return: 6
```

✅ DONE! Move to "Next Steps" below.

---

### ⚠️ I DON'T Have PostgreSQL Running

**Follow these steps:**

1. **Start PostgreSQL** (Windows):
   ```powershell
   # Option A: If installed as service
   Get-Service postgresql-x64-* | Start-Service
   
   # Option B: Open pgAdmin manually
   ```

2. **Wait 10 seconds for it to start**

3. **Then run the setup command above** ☝️

---

### ❓ I DON'T Have PostgreSQL Installed

**Install first** (takes 5-10 minutes):
1. Download: https://www.postgresql.org/download/windows/
2. Run installer, remember the postgres password
3. Let it install (default options OK)
4. Come back and run commands above

---

## 📝 Copy-Paste Template

**Save this to a file and run it**, or copy-paste each command:

```powershell
# Step 1: Navigate to backend
cd C:\projects\magic-bus\backend

# Step 2: Execute setup (choose your default db)
psql -U postgres -h localhost -d postgres -f DATABASE_SETUP_STANDALONE.sql

# Step 3: Verify (if you see "6", it worked!)
psql -U postgres -h localhost -d magic_bus -c "SELECT COUNT(*) FROM onboarding_step;"

# Step 4: Check all tables exist (should show 9 table names)
psql -U postgres -h localhost -d magic_bus -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
```

---

## 📊 What Gets Created

When you run the SQL:

✅ Database `magic_bus` is created
✅ 9 tables created with proper structure
✅ 25+ indexes for performance
✅ 8 foreign key relationships
✅ 10+ constraint validations
✅ 6 onboarding steps (seed data)
✅ Everything ready for backend

---

## ✨ Success Indicators

### ✅ You'll See This (Success)
```
creating database "magic_bus"... done
CREATE TABLE
CREATE INDEX
CREATE TABLE
...
(many more CREATE statements)
...
INSERT into onboarding_step... done

All tables created successfully! ✅
```

### ❌ Common Errors (Don't Panic)

**Error**: "database 'magic_bus' already exists"
```
→ It's OK! Your database is already set up
→ Skip CREATE DATABASE
→ The script is safe to run again
```

**Error**: "Cannot connect to server"
```
→ Start PostgreSQL service first
→ Check it's running: services.msc (search Windows)
```

**Error**: "psql: command not found"
```
→ Add PostgreSQL to PATH or reinstall
→ Use pgAdmin GUI instead
```

---

## 🎯 AFTER DATABASE IS READY

### Update Backend Configuration

Edit: `C:\projects\magic-bus\backend\src\main\resources\application.properties`

Change this section:
```properties
# Database Configuration (PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/magic_bus
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD_HERE
```

### Run Spring Boot

```powershell
cd C:\projects\magic-bus\backend
./gradlew bootRun
# Wait for: "Started MagicBusApplication in X.XXX seconds"
```

✅ Backend is now running at `http://localhost:8080/api`

---

## 📞 NEED HELP?

### Check These Files

| Problem | Check File |
|---------|-----------|
| PostgreSQL not installed | SETUP_STEPS_DETAILED.md |
| SQL script failed | DATABASE_SETUP_GUIDE.md |
| Backend won't start | SETUP_STEPS_DETAILED.md |
| Which commands to run | This file (right here!) |

---

## ⏰ TIMELINE

- **PostgreSQL check**: 1 min
- **Execute SQL**: 1 min
- **Verify success**: 2 min
- **Update config**: 1 min
- **Start Spring Boot**: 1 min

**Total Time: ~5-10 minutes** ⏱️

---

## 🚀 READY?

**Pick your situation above and execute!**

Or open PowerShell NOW and run:
```powershell
psql -U postgres -h localhost -d postgres -f "C:\projects\magic-bus\backend\DATABASE_SETUP_STANDALONE.sql"
```

---

## ✅ Confirm Success

After running, verify with:
```powershell
psql -U postgres -h localhost -d magic_bus -c "SELECT COUNT(*) FROM onboarding_step;"
```

If you see `6`, it worked perfectly! ✅

---

**LET'S GO!** 🎉
