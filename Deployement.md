# 🚀 Swapify — Deployment Guide

## 📌 Overview

This document describes the full deployment process of the **Swapify – Product Exchange Platform**, including backend, frontend, database, and caching infrastructure.

The system is deployed using a **modern cloud-based architecture**:

```
Frontend  → Vercel
Backend   → Railway
Database  → Railway PostgreSQL
Cache     → Upstash Redis (BullMQ + caching)
Storage   → Cloudinary
```

---

## 🧱 Architecture Summary

| Component   | Technology                | Platform   |
| ----------- | ------------------------- | ---------- |
| Frontend    | React (Vite + TypeScript) | Vercel     |
| Backend     | NestJS (TypeScript)       | Railway    |
| Database    | PostgreSQL                | Railway    |
| Cache/Queue | Redis + BullMQ            | Upstash    |
| Storage     | Cloudinary                | Cloudinary |

---

## ⚙️ Backend Deployment (Railway)

### 1. Prepare Backend

Ensure:

* All configs use environment variables
* Production build script exists

```json
"scripts": {
  "build": "nest build",
  "start:prod": "node dist/main"
}
```

---

### 2. Fix Server Binding (IMPORTANT)

```ts
const port = process.env.PORT || 3000;
await app.listen(port, '0.0.0.0');
```

---

### 3. Create Railway Project

Using Railway:

* Create new project
* Add **PostgreSQL database**
* Deploy backend from GitHub repository

---

### 4. Environment Variables

#### Database (from Railway PostgreSQL)

```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
```

---

#### Redis (from Upstash)

```env
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=default
REDIS_PASSWORD=
REDIS_TLS=true
```

---

#### Authentication

```env
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

### 5. Redis Configuration (Upstash)

BullMQ + Redis requires TLS:

```ts
BullModule.forRoot({
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
  },
});
```

---

### 6. Build & Start Commands

Railway automatically runs:

```bash
npm install
npm run build
npm run start:prod
```

---

### 7. Generate Public URL

* Go to Railway → Settings → Domains
* Generate domain
* Set port: `3000`

Example:

```
https://your-app.up.railway.app
```

---

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend

Ensure Axios uses env variable:

```ts
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

---

### 2. Deploy on Vercel

* Import GitHub repo
* Select frontend folder

---

### 3. Environment Variable

```env
VITE_API_URL=https://your-backend-url.up.railway.app
```

---

### 4. Deploy

Vercel auto-builds and deploys.

---

## 🔐 CORS Configuration

Backend (`main.ts`):

```ts
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.enableCors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
});
```

---

## 🍪 Authentication & Security

* Access token → stored in memory (frontend)
* Refresh token → HttpOnly cookie
* Current backend cookie config:

```ts
res.cookie('refreshToken', result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
});
```

For Vercel + Railway (different domains), production must use `sameSite: 'none'` and `secure: true`.

---

## 🧪 Testing Deployment

### Backend Test

```http
GET /items
POST /auth/register
POST /auth/login
```

---

### Full System Test

* Register user ✅
* Login ✅
* Create item ✅
* Upload image ✅
* Request swap/donation ✅
* Real-time chat ✅
* Token refresh ✅

---

## ⚠️ Common Issues & Fixes

### 1. 502 / connection refused

**Fix:**

```ts
await app.listen(port, '0.0.0.0');
```

---

### 2. Redis connection fails

**Fix:**

* Ensure `REDIS_TLS=true`
* Ensure `REDIS_USERNAME=default` (Upstash)
* Ensure `REDIS_PASSWORD` is set correctly

---

### 3. CORS errors

**Fix:**

* Ensure `FRONTEND_URL` is correct
* `credentials: true`

---

### 4. Cookies not working

**Fix:**

* Use HTTPS
* Ensure frontend sends credentials
* If FE/BE are on different domains, use `sameSite: 'none'` and `secure: true`

---

### 6. BullMQ eviction warning

Warning example:

```text
IMPORTANT! Eviction policy is optimistic-volatile. It should be "noeviction"
```

**Fix:**

* In Upstash, set eviction policy to `noeviction` for BullMQ reliability.

---

### 5. Railway cold start

* Free tier sleeps after inactivity
* First request may be slow

---

## 📦 Final Deployment URLs

* **Frontend:** https://product-exchange-system.vercel.app
* **Backend:** https://productexchangesystem-production.up.railway.app

---

## 🚀 Future Improvements

* Notification system (real-time)
* Profile images
* Rating system
* CI/CD pipeline
* Custom domain
* Monitoring & logging

---

## ✅ Conclusion

The Swapify system is successfully deployed using a scalable cloud architecture with:

* Secure authentication
* Real-time communication
* Caching and queue processing
* Modular and production-ready design

This deployment follows modern full-stack engineering practices aligned with the **Cenzios Engineering Guidebook**.

---

**End of Deployment Guide**
