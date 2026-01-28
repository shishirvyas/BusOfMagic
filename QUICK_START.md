# 🚀 Magic Bus - Quick Start (5 Minutes)

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ (`java -version`)
- ✅ Maven 3.6+ (`mvn -version`)
- ✅ Node.js 16+ (`node --version`)
- ✅ npm (`npm --version`)

---

## Start Backend (Terminal 1)

```powershell
# Navigate to backend
cd c:\projects\magic-bus\backend

# Build and run
mvn spring-boot:run
```

**Wait for:** `Started MagicBusApplication`

✅ **Backend ready at:** `http://localhost:8080/api`

---

## Start Frontend (Terminal 2)

```powershell
# Navigate to frontend
cd c:\projects\magic-bus\frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

✅ **Frontend ready at:** `http://localhost:5173`

---

## 🌐 Open in Browser

**Go to:** `http://localhost:5173`

You should see the Magic Bus Dashboard with:
- 📊 Dashboard with stats
- 👥 Customers page
- ⚙️ Settings page
- 📱 Responsive design

---

## 🔌 Test API Connection

Open new terminal and test:

```powershell
# Test backend health
curl http://localhost:8080/api/health

# Get all customers
curl http://localhost:8080/api/customers
```

---

## 🎯 Next Steps

### For Frontend Development
1. Edit files in `frontend/src/components/`
2. Changes auto-reload (HMR)
3. Check `frontend/README.md` for details

### For Backend Development
1. Edit files in `backend/src/main/java/`
2. Restart `mvn spring-boot:run` to see changes
3. Check `backend/README.md` for details

---

## 📚 Documentation

- **Full Setup:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Project Structure:** See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **Frontend Docs:** See [frontend/README.md](./frontend/README.md)
- **Backend Docs:** See [backend/README.md](./backend/README.md)

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Port 5173/8080 in use | Change port in config files |
| npm install fails | `npm cache clean --force` then retry |
| Build errors | `mvn clean install` or `npm install` |
| Frontend can't reach API | Ensure backend is running on 8080 |

---

## ⚡ Pro Tips

```powershell
# Use the launcher script (easier!)
.\launch.bat    # Windows
./launch.sh     # macOS/Linux

# Quick rebuild
mvn clean package -f backend/pom.xml
npm run build --prefix frontend

# Check if ports are available
netstat -ano | findstr :5173
netstat -ano | findstr :8080
```

---

## ✨ Features Ready to Use

✅ Responsive Material-UI design  
✅ Component-based architecture  
✅ TypeScript for type safety  
✅ Mock data / API stubs  
✅ CORS configured  
✅ Hot reload (frontend)  
✅ H2 Database (backend)  

---

## 🎉 You're All Set!

Start coding and enjoy your full-stack development!

**Questions?** Check the detailed README.md files or SETUP_GUIDE.md
