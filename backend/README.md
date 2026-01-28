# Magic Bus Backend

Spring Boot REST API for Magic Bus Admin Dashboard with modular architecture and data stub implementation.

## Features

✅ **Spring Boot 3.2** - Latest Spring Boot version  
✅ **RESTful API** - Modern API design  
✅ **JPA/Hibernate** - ORM for database operations  
✅ **H2 Database** - In-memory database for development  
✅ **CORS Support** - Cross-origin requests enabled  
✅ **Modular Architecture** - Entity, DTO, Service, Repository, Controller layers  
✅ **Data Stubs** - Mock data for development  

## Project Structure

```
src/
├── main/
│   ├── java/com/magicbus/
│   │   ├── controller/    # REST endpoints
│   │   ├── service/       # Business logic
│   │   ├── repository/    # Data access layer
│   │   ├── entity/        # JPA entities
│   │   ├── dto/           # Data Transfer Objects
│   │   └── MagicBusApplication.java  # Main application class
│   └── resources/
│       └── application.properties  # Configuration
└── test/
    └── java/com/magicbus/
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+

## Installation

```bash
cd backend
mvn clean install
```

## Development

Start the application:

```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## Build

Create a production build:

```bash
mvn clean package
```

Run the generated JAR:

```bash
java -jar target/magic-bus-backend-1.0.0.jar
```

## Available Endpoints

### Health Check
- `GET /api/health` - Health status

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/status/{status}` - Get customers by status
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

## API Examples

### Get All Customers
```bash
curl http://localhost:8080/api/customers
```

### Create Customer
```bash
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "status": "Active",
    "purchaseCount": 5,
    "totalSpent": 1500.00
  }'
```

### Update Customer
```bash
curl -X PUT http://localhost:8080/api/customers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "status": "Active",
    "purchaseCount": 6,
    "totalSpent": 1600.00
  }'
```

### Delete Customer
```bash
curl -X DELETE http://localhost:8080/api/customers/1
```

## Database

The application uses **H2 Database** (in-memory) for development.

### H2 Console
Access the H2 console at: `http://localhost:8080/api/h2-console`

**Credentials:**
- JDBC URL: `jdbc:h2:mem:testdb`
- User: `sa`
- Password: (leave empty)

## Configuration

Edit `src/main/resources/application.properties` to configure:

- `server.port` - Server port (default: 8080)
- `spring.datasource.url` - Database URL
- `spring.jpa.hibernate.ddl-auto` - Hibernate DDL strategy
- `logging.level` - Log levels

## Technologies

- **Spring Boot** - Framework
- **Spring Data JPA** - ORM
- **Hibernate** - JPA implementation
- **H2 Database** - In-memory database
- **Lombok** - Boilerplate reduction
- **Maven** - Build tool

## Frontend Integration

The backend is configured to accept requests from:
- `http://localhost:3000` (Next.js)
- `http://localhost:5173` (Vite)

CORS is enabled for these origins. Update `MagicBusApplication.java` if frontend runs on different URL.

## Maven Commands

- `mvn clean install` - Clean and build
- `mvn spring-boot:run` - Run application
- `mvn test` - Run tests
- `mvn package` - Create JAR file

## License

MIT
