# Magic Bus - Full Stack Admin Dashboard

A modern, responsive admin dashboard application with separate frontend and backend projects.

## 📁 Project Structure

```
magic-bus/
├── frontend/           # React + Vite + Material-UI
├── backend/            # Spring Boot API
├── README.md          # This file
├── .gitignore         # Git ignore rules
└── .editorconfig      # Editor configuration
```

## 🚀 Quick Start

### Prerequisites
- **Frontend**: Node.js v16+, npm/yarn/pnpm
- **Backend**: Java 17+, Maven 3.6+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend API will run at: `http://localhost:8080/api`

## 📚 Project Documentation

- [Frontend Documentation](frontend/README.md) - React, Vite, Material-UI setup and development guide
- [Backend Documentation](backend/README.md) - Spring Boot, REST API, and database configuration

## 🛠️ Technology Stack

### Frontend
- **Vite** - Fast build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI v5** - Component library
- **Emotion** - CSS-in-JS
- **React Router v6** - Routing
- **Axios** - HTTP client

### Backend
- **Spring Boot 3.2** - Framework
- **Spring Data JPA** - ORM
- **Hibernate** - JPA implementation
- **H2 Database** - In-memory database (development)
- **Maven** - Build tool

## 🎯 Features

### Frontend
✅ Responsive design (mobile, tablet, desktop)  
✅ Component-based architecture  
✅ Material Design UI  
✅ TypeScript for type safety  
✅ Hot module replacement (HMR)  

### Backend
✅ RESTful API design  
✅ Modular architecture (Controller → Service → Repository)  
✅ CORS support  
✅ Data Transfer Objects (DTOs)  
✅ Exception handling  

## 🔄 API Integration

The frontend is configured to proxy API requests to the backend at `http://localhost:8080/api`.

### Environment Setup

#### Frontend (`.env.local`)
```
VITE_API_URL=http://localhost:8080/api
```

#### Backend (`application.properties`)
```
server.port=8080
server.servlet.context-path=/api
```

## 📖 Available Endpoints

All endpoints are prefixed with `/api`

### Health
- `GET /health` - Health check

### Customers
- `GET /customers` - List all customers
- `GET /customers/{id}` - Get customer by ID
- `GET /customers/status/{status}` - Filter by status
- `POST /customers` - Create customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

## 📝 Useful Commands

### Frontend

```bash
cd frontend

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend

```bash
cd backend

# Development
mvn spring-boot:run  # Run application
mvn clean install    # Clean and build
mvn test             # Run tests
mvn package          # Create JAR file
```

## 🗄️ Database

The backend uses **H2 Database** (in-memory) for development.

### Access H2 Console
URL: `http://localhost:8080/api/h2-console`

**Credentials:**
- JDBC URL: `jdbc:h2:mem:testdb`
- User: `sa`
- Password: (empty)

## 📋 Git Ignore

- Frontend: [frontend/.gitignore](frontend/.gitignore)
- Backend: [backend/.gitignore](backend/.gitignore)
- Root: [.gitignore](.gitignore)

Common ignored files:
- `node_modules/`, `target/`
- `.env`, `.env.local`
- `.idea/`, `.vscode/`
- `dist/`, `build/`
- `*.log`

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration in `MagicBusApplication.java`
- Verify frontend is requesting correct API URL

### Backend port already in use
```bash
# Change port in backend/src/main/resources/application.properties
server.port=8081
```

### H2 Database issues
- Clear browser cache
- Restart the backend server
- Check `spring.jpa.hibernate.ddl-auto=create-drop` setting

## 📄 License

MIT

## 🤝 Contributing

For contributions, please follow the modular component-based development approach already established in both frontend and backend.

---

**Happy Coding!** 🎉
