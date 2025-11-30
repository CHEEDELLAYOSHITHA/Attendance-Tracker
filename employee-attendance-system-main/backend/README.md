# Employee Attendance Management System - Backend

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Jest & Supertest (testing)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the backend root:
   ```env
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

## Scripts
- `npm run dev` — Start with nodemon
- `npm start` — Start with node
- `npm test` — Run tests

## API Endpoints
- `POST /auth/login` — Login for both roles
- `POST /attendance/checkin` — Employee check-in
- `POST /attendance/checkout` — Employee check-out
- `GET /attendance/me` — Employee views their own logs
- `GET /admin/attendance` — Admin views all attendance records

## Project Structure
- `src/models` — Mongoose models
- `src/controllers` — Route controllers
- `src/routes` — Express routes
- `src/middlewares` — Auth & role middlewares
- `src/utils` — Utility functions
- `tests` — Jest/Supertest tests 