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

1. User logs in

  * Refresh Token is set in HttpOnly cookie
  * Access Token is returned in `Authorization` response header

2. Frontend keeps Access Token in memory only

3. Access Token is sent as `Bearer` token for protected APIs

4. Refresh endpoint rotates Access Token using refresh cookie

---

## API Reference

Base URL: `http://localhost:3000`

Protected routes require:

```http
Authorization: Bearer <access_token>
```

### 1) Auth APIs

#### POST /auth/register

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "0712345678",
  "province": "Western",
  "district": "Colombo"
}
```

Validation:

- `email`: valid email, max 255
- `password`: string, min 8, max 255
- `name`: string, max 100
- `phone`: string, max 20
- `province`: string
- `district`: string

Success response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "a5f0b7d9-6a16-4d50-a807-3fb8dd34cb84",
    "email": "user@example.com"
  }
}
```

#### POST /auth/login

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Validation:

- `email`: valid email
- `password`: string

Success behavior:

- Sets HttpOnly `refreshToken` cookie
- Returns access token in response header:

```http
Authorization: Bearer <jwt_access_token>
```

Success response body:

```json
{
  "success": true,
  "message": "Login successful",
  "data": null
}
```

#### POST /auth/refresh

Request:

- No JSON body required
- Requires `refreshToken` cookie

Success behavior:

- Requires `refreshToken` cookie
- Returns refreshed access token in response header:

```http
Authorization: Bearer <new_jwt_access_token>
```

Success response body:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": null
}
```

Error response example:

```json
{
  "success": false,
  "message": "Invalid refresh token",
  "data": null
}
```

### 2) Users APIs (Protected)

#### GET /users/me

Returns current authenticated user profile.

Success response:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "a5f0b7d9-6a16-4d50-a807-3fb8dd34cb84",
    "email": "user@example.com",
    "role": "USER",
    "name": "John Doe",
    "phone": "0712345678",
    "province": "Western",
    "district": "Colombo",
    "createdAt": "2026-04-10T10:00:00.000Z"
  }
}
```

#### PATCH /users/me

Updates profile fields.

Request body (all optional):

```json
{
  "name": "John Doe",
  "phone": "0711111111",
  "province": "Western",
  "district": "Colombo"
}
```

#### PATCH /users/me/password

Changes account password.

Request body:

```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword123"
}
```

#### DELETE /users/me

Soft-deletes the account.

Request body:

```json
{
  "password": "password123"
}
```

### 3) Items APIs

Public endpoints:

- `GET /items`
- `GET /items/:id`

Protected endpoints:

- `POST /items`
- `GET /items/my`
- `PATCH /items/:id`
- `DELETE /items/:id`

#### POST /items

Content type: `multipart/form-data`

Form fields:

- `title` (string, required, max 150)
- `description` (string, optional, max 500)
- `category` (string, required, max 100)
- `condition` (string, required, max 50)
- `images` (file[], optional, max 5 files)

Success response:

```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": "8c21563b-cf0b-4a89-9f64-8c8fe7195dd7",
    "title": "iPhone 12",
    "description": "Used but good condition",
    "category": "Electronics",
    "condition": "Good",
    "ownerId": "f5c0e65b-4e7d-47a3-b325-b3813cb4571f",
    "images": [
      "https://res.cloudinary.com/.../img1.jpg",
      "https://res.cloudinary.com/.../img2.jpg"
    ]
  }
}
```

#### GET /items

Query params (all optional):

- `search` (title search, case-insensitive)
- `category`
- `condition`
- `district`
- `province`

Example:

```http
GET /items?search=iphone&category=Electronics&district=Colombo
```

Success response:

```json
{
  "success": true,
  "message": "Items fetched from database",
  "data": [
    {
      "id": "8c21563b-cf0b-4a89-9f64-8c8fe7195dd7",
      "title": "iPhone 12",
      "description": "Used but good condition",
      "category": "Electronics",
      "condition": "Good",
      "ownerId": "f5c0e65b-4e7d-47a3-b325-b3813cb4571f",
      "images": [
        "https://res.cloudinary.com/.../img1.jpg"
      ]
    }
  ]
}
```

Note: Message may be `Items fetched from cache` when served from Redis.

#### GET /items/:id

Fetches a single available item (with images).

#### GET /items/my (Protected)

Returns authenticated user's items.

Query params:

- `includeSwapped` (optional, default: `false`)

Example:

```http
GET /items/my?includeSwapped=true
```

#### PATCH /items/:id (Protected)

Updates item metadata and images.

Content type: `multipart/form-data`

Form fields (all optional):

- `title` (string)
- `description` (string)
- `category` (string)
- `condition` (string)
- `keepImageUrls` (stringified array or repeated values)
- `images` (new file[], max total 5)

Example:

```http
PATCH /items/8c21563b-cf0b-4a89-9f64-8c8fe7195dd7
```

#### DELETE /items/:id (Protected)

Soft-deletes an item owned by the authenticated user.

### 4) Swap APIs (Protected)

#### GET /swaps

Returns all swaps where current user is requester or owner.

#### POST /swaps

Request body:

```json
{
  "requestedItemId": "db57c6c8-4e81-4580-a4f6-9f8ac85f0f49",
  "offeredItemId": "4959ee4e-a7cf-4f3f-82d7-22f0812f40f6",
  "isDonation": false
}
```

Rules:

- If `isDonation = false`, `offeredItemId` is required
- If `isDonation = true`, `offeredItemId` is ignored and stored as `null`
- Cannot request own item
- Cannot swap the same item ID with itself

Success response:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "id": "acb0b7fd-3ab9-4974-8a3c-c34b40dda591",
    "requesterId": "e3f5284a-4992-4329-8ad3-b95f33ef2d53",
    "ownerId": "a562f74e-413b-4a13-b165-353e8f45e6be",
    "requestedItemId": "db57c6c8-4e81-4580-a4f6-9f8ac85f0f49",
    "offeredItemId": "4959ee4e-a7cf-4f3f-82d7-22f0812f40f6",
    "status": "PENDING",
    "isDonation": false,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

#### PATCH /swaps/:id

Path params:

- `id` (swap ID)

Request body:

```json
{
  "status": "ACCEPTED"
}
```

Allowed status values:

- `PENDING`
- `ACCEPTED`
- `REJECTED`

Success response:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "id": "acb0b7fd-3ab9-4974-8a3c-c34b40dda591",
    "status": "ACCEPTED"
  }
}
```

#### GET /swaps/:id/contact

Path params:

- `id` (swap ID, UUID)

Access rules:

- Caller must be swap requester or owner
- Swap must be `ACCEPTED`

Success response:

```json
{
  "success": true,
  "message": "Contact details fetched successfully",
  "data": {
    "requester": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0712345678"
    },
    "owner": {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "0771234567"
    }
  }
}
```

### 5) Chat APIs

#### REST: GET /chat/:swapId (Protected)

Path params:

- `swapId`

Query params:

- `page` (optional, default: 1)
- `limit` (optional, default: 20)

Success response:

```json
{
  "success": true,
  "message": "Messages fetched successfully",
  "data": [
    {
      "id": "a182f5c3-245f-4186-89de-7c82d991f0b4",
      "swapId": "acb0b7fd-3ab9-4974-8a3c-c34b40dda591",
      "senderId": "e3f5284a-4992-4329-8ad3-b95f33ef2d53",
      "message": "Hi, is this still available?",
      "createdAt": "2026-04-07T10:20:00.000Z"
    }
  ],
  "meta": {
    "total": 36,
    "page": 1,
    "limit": 20
  }
}
```

#### WebSocket: Namespace /swaps

Connection auth:

- Provide JWT access token in handshake auth:

```json
{
  "token": "<jwt_access_token>"
}
```

Events:

- `join_swap`
  - Payload:

  ```json
  {
    "swapId": "acb0b7fd-3ab9-4974-8a3c-c34b40dda591"
  }
  ```

- `send_message`
  - Payload:

  ```json
  {
    "swapId": "acb0b7fd-3ab9-4974-8a3c-c34b40dda591",
    "message": "Hello"
  }
  ```

- `receive_message` (server -> clients in room)
  - Payload:

  ```json
  {
    "id": "a182f5c3-245f-4186-89de-7c82d991f0b4",
    "swapId": "acb0b7fd-3ab9-4974-8a3c-c34b40dda591",
    "senderId": "e3f5284a-4992-4329-8ad3-b95f33ef2d53",
    "message": "Hello",
    "createdAt": "2026-04-07T10:25:00.000Z"
  }
  ```

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
