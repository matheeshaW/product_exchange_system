# Swapify Backend API

A scalable backend system for a **product swapping & donation platform**, built with NestJS, TypeScript, and modern development practices.

---

## Features

### Authentication & Security

* JWT-based authentication
* Refresh tokens via **HttpOnly cookies**
* Route protection using guards
* Secure WebSocket authentication
* Role-based access control for swaps & chat

---

### Item Management

* Create items with image uploads (Cloudinary)
* Soft delete support
* Search & filtering:

  * title
  * category
  * condition
  * location (district, province)

---

### Swap & Donation System

* Request item swaps
* Support **donation mode (no return item)**
* Accept / reject swap requests
* Contact details shared only after approval

---

### Real-Time Chat

* WebSocket-based chat (Socket.IO)
* Room-based messaging per swap
* Persistent chat history (database)
* Secure access (only swap participants)

---

### Performance Optimization

* Redis caching (cache-aside pattern)
* Dynamic cache keys for filtering
* Cache invalidation using prefix strategy

---

### Background Processing

* BullMQ queue integration
* Audit logging for:

  * Item creation
  * Swap creation
* Non-blocking job processing

---

### API Standards

* Global response format
* Centralized error handling
* DTO validation with class-validator

---

## Tech Stack

* **Backend Framework:** NestJS (TypeScript)
* **Database:** PostgreSQL + TypeORM
* **Cache:** Redis
* **Queue:** BullMQ
* **Realtime:** Socket.IO (WebSockets)
* **File Storage:** Cloudinary
* **Authentication:** JWT + Cookies

---

## Project Structure

```
src/
 ├── common/
 │    ├── redis/
 │    ├── storage/
 │    ├── filters/
 │    ├── interceptors/
 │
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── items/
 │    ├── item-images/
 │    ├── swaps/
 │    ├── chat/
 │    ├── audit/
 │
 ├── main.ts
 ├── app.module.ts
```

---

## Authentication Flow

1. User logs in → receives:

   * Access Token (short-lived)
   * Refresh Token (HttpOnly cookie)

2. Access Token used for API requests

3. Refresh endpoint issues new access token

---

## API Endpoints

### Auth

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/refresh`

### Items

* `POST /items`
* `GET /items?search=&category=&district=...`

### Swaps

* `POST /swaps`
* `PATCH /swaps/:id`
* `GET /swaps/:id/contact`

### Chat

* WebSocket namespace: `/swaps`

* Events:

  * `join_swap`
  * `send_message`
  * `receive_message`

* REST:

  * `GET /chat/:swapId`

---

## Environment Variables

```
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

REDIS_HOST=
REDIS_PORT=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Running the Project

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Setup Instructions

#### 1. Clone the repository and install dependencies

```bash
git clone <repository-url>
cd cenzios/inventory-system
npm install
```

#### 2. Configure environment variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=inventory_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application
APP_PORT=3000
NODE_ENV=development
```

#### 3. Start Docker services

Ensure Docker is running, then start PostgreSQL and Redis:

```bash
docker-compose up -d
```

Verify services are running:

```bash
docker-compose ps
```

#### 4. Run database migrations (if applicable)

TypeORM is configured with `synchronize: true` for development. The database schema will auto-sync on startup.

#### 5. Start the development server

```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

### Accessing Services

- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

### Testing the API

You can use tools like Postman, Insomnia, or cURL to test endpoints:

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "1234567890",
    "province": "Western Province",
    "district": "Colombo"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### WebSocket Connection

Connect to WebSocket at `ws://localhost:3000/swaps` with authentication:

```javascript
const socket = io('http://localhost:3000/swaps', {
  auth: {
    token: '<JWT_ACCESS_TOKEN>'
  }
});

// Join a swap room
socket.emit('join_swap', { swapId: '<swap-id>' });

// Listen for messages
socket.on('receive_message', (data) => {
  console.log('New message:', data);
});

// Send a message
socket.emit('send_message', { swapId: '<swap-id>', message: 'Hello!' });
```

### Stopping Services

```bash
# Stop the development server
Ctrl + C

# Stop Docker services
docker-compose down

# Stop and remove all Docker data
docker-compose down -v
```

### Common Issues & Troubleshooting

**Port already in use:**
```bash
# Change the port in .env or run on different port
APP_PORT=3001 npm run start:dev
```

**Database connection failed:**
- Ensure Docker is running: `docker-compose ps`
- Check credentials in `.env` match docker-compose.yml
- Verify network connectivity: `docker network ls`

**Redis connection failed:**
- Verify Redis container is running: `docker-compose logs redis`
- Check Redis port not blocked by firewall

**TypeScript errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Notes

* All responses follow a consistent format:

```
{
  "success": true,
  "message": "...",
  "data": ...
}
```

* Soft deletes are implemented using `deletedAt`
* Redis cache uses TTL + prefix invalidation
* Queue failures do not affect main business logic

---

## Future Improvements

* Item recommendation system
* Notifications (real-time)
* Ratings & reviews
* Admin dashboard

---

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Lint code
npm run lint
```

### Project Architecture

The project follows NestJS best practices:

- **Modules:** Feature-based module organization
- **Services:** Business logic and database operations
- **Controllers:** HTTP request handling
- **Guards:** Authentication and authorization
- **DTOs:** Data validation with class-validator
- **Entities:** TypeORM database models
- **Interceptors:** Request/response transformation

### Adding New Features

1. Generate new module: `npx nest g module modules/feature-name`
2. Generate service: `npx nest g service modules/feature-name`
3. Generate controller: `npx nest g controller modules/feature-name`
4. Create entities, DTOs, and services
5. Register in the appropriate module
6. Add routes to controller

---

Built with attention to scalability, performance, and maintainability.
