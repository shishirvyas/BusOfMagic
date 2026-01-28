# Project Structure Overview

## Complete Magic Bus Project Organization

```
c:\projects\magic-bus/
│
├── 📁 frontend/                          # Vite + React + Material-UI Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/                # Shared/common components
│   │   │   ├── 📁 dashboard/             # Dashboard-specific components
│   │   │   │   ├── StatCard.tsx          # Stats display component
│   │   │   │   ├── CustomerTable.tsx     # Customer data table
│   │   │   │   └── TrendChart.tsx        # Chart component
│   │   │   └── 📁 layout/
│   │   │       ├── Layout.tsx            # Main layout wrapper
│   │   │       └── Sidebar.tsx           # Navigation sidebar
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.tsx             # Dashboard page
│   │   │   ├── Customers.tsx             # Customers management page
│   │   │   └── Settings.tsx              # Settings page
│   │   ├── 📁 services/
│   │   │   └── api.ts                    # API client configuration
│   │   ├── 📁 hooks/                     # Custom React hooks
│   │   ├── 📁 utils/
│   │   │   └── formatters.ts             # Utility functions
│   │   ├── 📁 styles/
│   │   │   └── index.css                 # Global styles
│   │   ├── 📁 types/
│   │   │   └── index.ts                  # TypeScript types
│   │   ├── App.tsx                       # Main app component
│   │   └── main.tsx                      # Entry point
│   ├── 📄 package.json                   # Dependencies & scripts
│   ├── 📄 vite.config.ts                 # Vite configuration
│   ├── 📄 tsconfig.json                  # TypeScript configuration
│   ├── 📄 tsconfig.app.json              # App TypeScript config
│   ├── 📄 tsconfig.node.json             # Node TypeScript config
│   ├── 📄 .eslintrc.cjs                  # ESLint configuration
│   ├── 📄 .prettierrc                    # Code formatter config
│   ├── 📄 .gitignore                     # Git ignore rules
│   ├── 📄 index.html                     # HTML template
│   └── 📄 README.md                      # Frontend documentation
│
├── 📁 backend/                           # Spring Boot REST API
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/com/magicbus/
│   │   │   │   ├── 📁 controller/        # REST endpoints
│   │   │   │   │   ├── CustomerController.java
│   │   │   │   │   └── HealthController.java
│   │   │   │   ├── 📁 service/           # Business logic
│   │   │   │   │   └── CustomerService.java
│   │   │   │   ├── 📁 repository/        # Data access (JPA)
│   │   │   │   │   └── CustomerRepository.java
│   │   │   │   ├── 📁 entity/            # JPA entities
│   │   │   │   │   └── Customer.java
│   │   │   │   ├── 📁 dto/               # Data Transfer Objects
│   │   │   │   │   └── CustomerDTO.java
│   │   │   │   └── MagicBusApplication.java  # Main class
│   │   │   └── 📁 resources/
│   │   │       └── application.properties    # Spring config
│   │   └── 📁 test/
│   │       └── 📁 java/com/magicbus/    # Unit tests
│   ├── 📄 pom.xml                        # Maven dependencies
│   ├── 📄 .gitignore                     # Git ignore rules
│   └── 📄 README.md                      # Backend documentation
│
├── 📁 public/                            # Static assets
│   └── 📁 assets/                        # Images, icons, logos
│
├── 📄 .editorconfig                      # Editor settings
├── 📄 .gitattributes                     # Git attributes
├── 📄 .gitignore                         # Root git ignore
├── 📄 .prettierignore                    # Prettier ignore
├── 📄 README.md                          # Main documentation
├── 📄 SETUP_GUIDE.md                     # Complete setup instructions
├── 📄 launch.bat                         # Windows launcher script
└── 📄 launch.sh                          # macOS/Linux launcher script
```

## 🔧 Technology Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Build Tool | **Vite** |
| Framework | **React 18** |
| Language | **TypeScript** |
| UI Library | **Material-UI v5** |
| CSS | **Emotion** |
| Routing | **React Router v6** |
| HTTP Client | **Axios** |
| Code Quality | **ESLint, Prettier** |

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | **Spring Boot 3.2** |
| Language | **Java 17** |
| ORM | **JPA/Hibernate** |
| Database | **H2 (Development)** |
| Build Tool | **Maven** |
| Testing | **JUnit 5** |

## 📊 Architecture

### Component Structure (Frontend)
```
App
├── Layout
│   ├── AppBar/Header
│   ├── Sidebar
│   │   └── Navigation Items
│   └── Main Content
│       ├── Dashboard
│       ├── Customers
│       └── Settings

Common Components
├── StatCard
├── CustomerTable
└── TrendChart
```

### Layered Architecture (Backend)
```
Controller Layer (REST Endpoints)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Entity Layer (Database Models)
    ↓
H2 Database
```

## 📋 File Organization Guide

### Frontend Development
- **Components** should be in `/src/components/[feature]`
- **Pages** in `/src/pages/[pageName].tsx`
- **Services** for API calls in `/src/services/`
- **Hooks** for reusable logic in `/src/hooks/`
- **Types** in `/src/types/index.ts`
- **Utilities** in `/src/utils/`

### Backend Development
- **Controllers** handle HTTP requests
- **Services** contain business logic
- **Repositories** handle database operations
- **Entities** define database tables
- **DTOs** for data transfer between layers

## 🚀 Quick Reference

### Frontend Commands
```bash
npm install      # Install dependencies
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build
npm run lint     # Check code quality
npm run format   # Format code
```

### Backend Commands
```bash
mvn clean install      # Build project
mvn spring-boot:run    # Run application (localhost:8080/api)
mvn test              # Run tests
mvn package           # Create JAR
```

## 📱 Responsive Breakpoints (Material-UI)

- **xs**: 0px - Extra small (mobile)
- **sm**: 600px - Small (tablet)
- **md**: 960px - Medium (desktop)
- **lg**: 1280px - Large (wide desktop)
- **xl**: 1920px - Extra large

## 🔌 API Endpoint Structure

```
Base URL: http://localhost:8080/api

/health                      # Health check
/customers                   # Customers CRUD
  GET    /                   # List all
  POST   /                   # Create
  GET    /{id}              # Get one
  PUT    /{id}              # Update
  DELETE /{id}              # Delete
  GET    /status/{status}   # Filter by status
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](../README.md) | Main project overview |
| [SETUP_GUIDE.md](../SETUP_GUIDE.md) | Step-by-step setup instructions |
| [frontend/README.md](../frontend/README.md) | Frontend-specific documentation |
| [backend/README.md](../backend/README.md) | Backend-specific documentation |

## 🎯 Development Workflow

1. **Start Backend**: `mvn spring-boot:run` (Terminal 1)
2. **Start Frontend**: `npm run dev` (Terminal 2)
3. **Open Browser**: `http://localhost:5173`
4. **Edit Code**: Changes auto-reload due to HMR
5. **Test API**: Use endpoints at `/api/*`

## 🛠️ Configuration Files

### Frontend Config Files
- `vite.config.ts` - Vite build and dev server config
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.cjs` - ESLint rules
- `.prettierrc` - Code formatting rules

### Backend Config Files
- `application.properties` - Spring Boot configuration
- `pom.xml` - Maven dependencies and build config

## ✅ Project Status

- ✅ Folder structure created
- ✅ Frontend initialized with Vite, React, Material-UI
- ✅ Backend initialized with Spring Boot
- ✅ Modular component-based architecture
- ✅ CORS configured for frontend-backend communication
- ✅ Git ignore files configured
- ✅ Data stubs ready for development
- ✅ Documentation complete
- ✅ Launch scripts created

---

**Ready to start developing!** 🚀
