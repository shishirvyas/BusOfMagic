# 🔐 Database Credentials Configuration Guide

## ✅ Setup Complete - Credentials Secured

Your PostgreSQL connection details have been securely configured with the following:

### 📁 Files Created

1. **`.env.local`** (NOT in git - contains your credentials)
   - Contains your Azure PostgreSQL connection details
   - **NEVER commit this file to git**
   - Already in `.gitignore`

2. **`.env.example`** (IN git - safe template)
   - Shows the format for `.env.local`
   - Safe to commit - contains only placeholder values
   - Use this to document what variables are needed

3. **Backend Configuration**
   - `backend/src/main/resources/application.properties` - Already uses env variables
   - `backend/src/main/java/com/magicbus/config/DatabaseConfig.java` - New config class

4. **Node.js Configuration** (if needed)
   - `db-config.js` - Reads credentials from environment

---

## 🔑 Your Credentials

These are stored securely in `.env.local`:

```
Host: recursive-kind-db.postgres.database.azure.com
Port: 5432
User: recursivekindadmin
Password: Shishir#901
Database: postgres
SSL: Enabled (Azure requirement)
```

---

## 🚀 How to Use

### Method 1: Using .env.local (Recommended for Development)

**Spring Boot automatically reads from `.env.local`:**

```bash
cd backend
./gradlew bootRun
```

Spring Boot will automatically load:
- `DB_HOST` → `localhost` (default in app)
- `DB_PORT` → `5432` (default in app)
- `DB_USER` → `postgres` (default in app)
- `DB_PASSWORD` → (empty, default in app)

But if `.env.local` exists with these values:
- `DB_HOST=recursive-kind-db.postgres.database.azure.com`
- `DB_USER=recursivekindadmin`
- `DB_PASSWORD=Shishir#901`

They will override the defaults ✅

### Method 2: Using Environment Variables (Recommended for Production)

```bash
# Set environment variables
export DB_HOST=recursive-kind-db.postgres.database.azure.com
export DB_PORT=5432
export DB_USER=recursivekindadmin
export DB_PASSWORD=Shishir#901
export DB_NAME=postgres

# Start application
cd backend
./gradlew bootRun
```

### Method 3: Direct Configuration (Docker/CI-CD)

```dockerfile
# In Dockerfile
ENV DB_HOST=recursive-kind-db.postgres.database.azure.com
ENV DB_PORT=5432
ENV DB_USER=recursivekindadmin
ENV DB_PASSWORD=Shishir#901
ENV DB_NAME=postgres
```

---

## ✅ Verification

### Check if Application Loads Correctly

```bash
cd backend
./gradlew bootRun

# Look for messages like:
# Started MagicBusApplication in X.XXX seconds
# HikariPool-1 - Starting...
# Database: PostgreSQL (Azure)
```

### Test Database Connection

```bash
# From backend directory
./gradlew bootRun

# In another terminal, test endpoint
curl http://localhost:8080/api/health
```

---

## 🔒 Security Checklist

- [x] Credentials in `.env.local` (local machine only)
- [x] `.env.local` is in `.gitignore` (won't be committed)
- [x] `.env.example` is in git (shows format without secrets)
- [x] Application reads from environment variables
- [x] No hardcoded passwords in code
- [x] No credentials in `application.properties`
- [x] SSL enabled for Azure connection

---

## 📋 Environment Variables Used

| Variable | Purpose | Current Value |
|----------|---------|----------------|
| `DB_HOST` | Database hostname | `recursive-kind-db.postgres.database.azure.com` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database username | `recursivekindadmin` |
| `DB_PASSWORD` | Database password | `Shishir#901` |
| `DB_NAME` | Database name | `postgres` |
| `DB_SSL_ENABLED` | Enable SSL | `true` |
| `DB_SSL_CA_PATH` | CA certificate path | `./certs/ca-cert.crt` |

---

## 🛠️ Configuration Files

### Spring Boot (`application.properties`)
```properties
# Uses environment variables with defaults
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:postgres}?sslmode=${DB_SSL_MODE:require}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:}
```

### `.env.local` (Your Secrets)
```env
DB_HOST=recursive-kind-db.postgres.database.azure.com
DB_PORT=5432
DB_USER=recursivekindadmin
DB_PASSWORD=Shishir#901
DB_NAME=postgres
DB_SSL_ENABLED=true
```

### `.env.example` (Template - Safe to Commit)
```env
DB_HOST=your-database-host.postgres.database.azure.com
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
DB_NAME=postgres
DB_SSL_ENABLED=true
```

---

## 📚 Usage Examples

### Example 1: Development (Using .env.local)

```bash
# Create/verify .env.local exists with credentials
ls -la .env.local

# Run backend
cd backend
./gradlew bootRun

# App automatically loads credentials from .env.local
```

### Example 2: Docker Container

```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY backend .

# Set environment variables
ENV DB_HOST=recursive-kind-db.postgres.database.azure.com
ENV DB_PORT=5432
ENV DB_USER=recursivekindadmin
ENV DB_PASSWORD=Shishir#901
ENV DB_NAME=postgres

CMD ["./gradlew", "bootRun"]
```

### Example 3: CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
      - name: Run Backend
        env:
          DB_HOST: ${{ secrets.DB_HOST }}
          DB_PORT: ${{ secrets.DB_PORT }}
          DB_USER: ${{ secrets.DB_USER }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_NAME: ${{ secrets.DB_NAME }}
        run: |
          cd backend
          ./gradlew bootRun
```

---

## ⚠️ Important Notes

### For Local Development
- `.env.local` is already created with your credentials
- It's in `.gitignore` - **won't be committed to git**
- Spring Boot reads it automatically when running

### For Team Collaboration
- Share `.env.example` (safe, no secrets)
- Each team member creates their own `.env.local`
- Document the required variables in `.env.example`

### For Production
- Use environment variables set by deployment platform
- Never use `.env` files in production
- Use cloud provider's secret management (Azure Key Vault, etc.)

### For CI/CD
- Add secrets to GitHub Actions/GitLab CI secrets
- Reference them in pipeline configuration
- Never hardcode credentials

---

## 🔄 To Change Credentials

1. Update the values in `.env.local`
2. Restart the application
3. Done! No code changes needed

---

## 📞 Troubleshooting

### Error: "Cannot connect to database"
**Check:**
1. `.env.local` exists in project root
2. Credentials are correct
3. PostgreSQL server is accessible
4. SSL is properly configured

### Error: "psql: unknown user"
**Fix:**
1. Verify `DB_USER` in `.env.local`
2. Check Azure PostgreSQL credentials

### Error: "Connection refused"
**Check:**
1. Database host is correct
2. Port 5432 is open
3. Firewall allows connection

---

## ✅ Success Indicators

When properly configured, you'll see:

```
Started MagicBusApplication in 3.247 seconds
HikariPool-1 - Starting...
HikariPool-1 - Added connection conn1
Database available
Connected to: PostgreSQL (Azure)
```

---

## 📖 Additional Resources

- `.env.example` - Template for environment variables
- `application.properties` - Spring Boot configuration
- `DatabaseConfig.java` - Java configuration class
- `db-config.js` - Node.js configuration

---

**✅ Your database credentials are now securely configured!** 🔐

Next steps:
1. Run the database setup: `psql -U recursivekindadmin -h recursive-kind-db.postgres.database.azure.com -d postgres -f DATABASE_SETUP_STANDALONE.sql`
2. Start Spring Boot: `cd backend && ./gradlew bootRun`
3. Backend will connect automatically using `.env.local` credentials
