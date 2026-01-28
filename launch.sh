#!/bin/bash
# Magic Bus Launcher Script (for macOS/Linux)

echo ""
echo "========================================"
echo "  Magic Bus - Application Launcher"
echo "========================================"
echo ""

# Check if running from correct directory
if [ ! -d "frontend" ]; then
    echo "Error: Please run this script from the magic-bus root directory"
    echo "Current directory: $(pwd)"
    exit 1
fi

echo "Available options:"
echo "1. Launch Backend (Spring Boot)"
echo "2. Launch Frontend (Vite + React)"
echo "3. Launch Both (in separate terminals)"
echo "4. Build Backend"
echo "5. Build Frontend"
echo "6. Show Status"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "Starting Backend..."
        cd backend
        mvn spring-boot:run
        ;;
    2)
        echo ""
        echo "Starting Frontend..."
        cd frontend
        npm install
        npm run dev
        ;;
    3)
        echo ""
        echo "Launching Backend in new terminal..."
        cd backend
        open -a Terminal <<EOF
cd "$PWD"
mvn spring-boot:run
EOF
        cd ../frontend
        sleep 2
        echo "Launching Frontend in new terminal..."
        open -a Terminal <<EOF
cd "$PWD"
npm install
npm run dev
EOF
        echo ""
        echo "Both applications starting..."
        echo "Backend: http://localhost:8080/api"
        echo "Frontend: http://localhost:5173"
        ;;
    4)
        echo ""
        echo "Building Backend..."
        cd backend
        mvn clean install
        echo ""
        echo "Build completed!"
        ;;
    5)
        echo ""
        echo "Building Frontend..."
        cd frontend
        npm install
        npm run build
        echo ""
        echo "Build completed!"
        ;;
    6)
        echo ""
        echo "Checking prerequisites..."
        echo ""
        echo "Java Version:"
        java -version 2>&1 | grep version
        echo ""
        echo "Maven Version:"
        mvn -version 2>&1 | grep "Apache Maven"
        echo ""
        echo "Node Version:"
        node --version
        echo ""
        echo "NPM Version:"
        npm --version
        echo ""
        echo "Testing Backend Connectivity..."
        sleep 2
        if curl -s http://localhost:8080/api/health > /dev/null; then
            echo "Backend Status: RUNNING (http://localhost:8080/api)"
        else
            echo "Backend Status: NOT RUNNING"
        fi
        echo ""
        ;;
    *)
        echo "Invalid choice. Please run the script again and select 1-6."
        ;;
esac

echo ""
echo "========================================"
echo "Script completed."
echo "========================================"
echo ""
