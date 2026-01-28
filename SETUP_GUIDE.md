# Magic Bus - Setup & Launch Guide

Complete step-by-step guide to launch the Magic Bus Full Stack Application on your desktop.

## 📋 System Requirements

### For Frontend
- Node.js v16 or higher
- npm, yarn, or pnpm (npm recommended)
- Modern web browser

### For Backend
- Java Development Kit (JDK) 17 or higher
- Maven 3.6 or higher

## 🚀 Complete Setup Instructions

### Step 1: Verify Prerequisites

#### Check Node.js and npm
```powershell
node --version    # Should be v16+
npm --version     # Should be 8+
```

If not installed, download from: https://nodejs.org/

#### Check Java and Maven
```powershell
java -version     # Should be 17+
mvn --version     # Should be 3.6+
```

If not installed:
- Java: https://www.oracle.com/java/technologies/downloads/
- Maven: https://maven.apache.org/download.cgi

---

## 🎯 Launch Steps

### **Option 1: Launch Backend First (Recommended)**

#### Step 1A: Open Terminal in Backend Folder

```powershell
cd c:\projects\magic-bus\backend
```

#### Step 1B: Build the Backend

```powershell
mvn clean install
```

**Expected output:** `BUILD SUCCESS`

#### Step 1C: Run the Backend

```powershell
mvn spring-boot:run
```

**Expected output:**
```
...
Started MagicBusApplication in X.XXX seconds
```

✅ **Backend is now running at:** `http://localhost:8080/api`

---

### **Option 2: Launch Frontend (in a new terminal)**

#### Step 2A: Open New Terminal in Frontend Folder

```powershell
cd c:\projects\magic-bus\frontend
```

#### Step 2B: Install Dependencies

```powershell
npm install
```

This will install all required packages (may take 1-2 minutes).

#### Step 2C: Start Development Server

```powershell
npm run dev
```

**Expected output:**
```
VITE v X.X.X build X.X.X

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

✅ **Frontend is now running at:** `http://localhost:5173`

---

## 🌐 Access the Application

### Frontend Dashboard
Open your browser and navigate to:
```
http://localhost:5173
```

### Backend Health Check
```
http://localhost:8080/api/health
```

### H2 Database Console (Optional)
```
http://localhost:8080/api/h2-console
```

Login with:
- JDBC URL: `jdbc:h2:mem:testdb`
- User: `sa`
- Password: (leave empty)

---

## 📊 Application Features

### Dashboard Pages

1. **Dashboard** (`/dashboard`)
   - Overview statistics
   - Customer metrics
   - Sample charts and data

2. **Customers** (`/customers`)
   - Customer management interface
   - Expandable for full CRUD operations

3. **Settings** (`/settings`)
   - Application settings
   - Configuration options

### Available Features

✅ Responsive design (works on mobile, tablet, desktop)  
✅ Material-UI components  
✅ Mock/stub data ready to use  
✅ API integration ready  
✅ Modular component architecture  

---

## 🔌 API Endpoints

### Health & Status
```
GET /api/health
```

### Customers Management
```
GET    /api/customers              # List all customers
GET    /api/customers/:id          # Get customer by ID
GET    /api/customers/status/:status  # Filter by status
POST   /api/customers              # Create new customer
PUT    /api/customers/:id          # Update customer
DELETE /api/customers/:id          # Delete customer
```

### Example API Request
```powershell
# Get all customers
curl.exe http://localhost:8080/api/customers

# Create customer
curl.exe -X POST http://localhost:8080/api/customers `
  -H "Content-Type: application/json" `
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "status": "Active",
    "purchaseCount": 5,
    "totalSpent": 1500.00
  }'
```

---

## 🛠️ Development Commands

### Frontend Commands

```powershell
cd frontend

npm run dev          # Start development server (hot reload)
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run format       # Format code with Prettier
```

### Backend Commands

```powershell
cd backend

mvn spring-boot:run        # Run application
mvn clean install          # Clean build
mvn test                   # Run tests
mvn package                # Create JAR file
mvn spring-boot:build-info # Build info
```

---

## 📁 Project Structure

```
magic-bus/
├── frontend/                    # Vite + React + Material-UI
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/         # Shared components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   └── layout/         # Layout components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── styles/             # Global styles
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── package.json            # Dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript config
│   ├── index.html              # HTML template
│   └── README.md               # Frontend documentation
│
├── backend/                     # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/magicbus/
│   │   │   │   ├── controller/  # REST endpoints
│   │   │   │   ├── service/     # Business logic
│   │   │   │   ├── repository/  # Data access
│   │   │   │   ├── entity/      # JPA entities
│   │   │   │   ├── dto/         # Data transfer objects
│   │   │   │   └── MagicBusApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml                 # Maven dependencies
│   └── README.md               # Backend documentation
│
├── public/                      # Static assets
│   └── assets/                 # Images, icons
├── README.md                   # Main documentation
└── .gitignore                  # Git ignore rules
```

---

## 🔧 Troubleshooting

### Frontend won't load
**Problem:** `http://localhost:5173` shows blank page or error

**Solutions:**
1. Ensure backend is running
2. Check browser console for errors (F12)
3. Clear browser cache (Ctrl+Shift+Del)
4. Restart frontend server: `npm run dev`

### Backend fails to start
**Problem:** Port 8080 already in use or build error

**Solutions:**
```powershell
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in backend/src/main/resources/application.properties
server.port=8081
```

### No database data
**Problem:** H2 database not showing data

**Solutions:**
1. Ensure backend is running
2. Check H2 console at `http://localhost:8080/api/h2-console`
3. Restart backend to reset data (in-memory database)

### CORS errors
**Problem:** Frontend can't connect to backend

**Solutions:**
1. Verify backend is running on port 8080
2. Check CORS configuration in `MagicBusApplication.java`
3. Ensure frontend is on localhost:5173 or localhost:3000

### Build failures
**Problem:** `npm install` or `mvn clean install` fails

**Solutions:**
```powershell
# For frontend
npm cache clean --force
rm -r node_modules package-lock.json
npm install

# For backend
mvn clean
mvn install
```

---

## 📚 Additional Resources

### Frontend
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Backend
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [H2 Database](https://www.h2database.com/)

---

## ✅ Quick Checklist

Before launching, ensure:

- [ ] Java 17+ installed
- [ ] Node.js 16+ installed
- [ ] Maven installed
- [ ] npm installed
- [ ] Ports 5173 and 8080 are available
- [ ] Git configured (optional)

---

## 🎉 You're Ready!

Your Magic Bus application is now set up and ready to use. Start both the backend and frontend servers and begin developing!

### Quick Start Commands

```powershell
# Terminal 1 - Backend
cd c:\projects\magic-bus\backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd c:\projects\magic-bus\frontend
npm install
npm run dev
```

Then open: **`http://localhost:5173`**

---

**Questions?** Check the README.md files in frontend/ and backend/ directories for more detailed information.

Happy Coding! 🚀
