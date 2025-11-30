# Employee Attendance System

A full-stack web application for managing employee attendance, featuring user authentication, admin dashboards, and attendance tracking.

---

## Technologies Used

**Frontend:**
- React.js (Vite)
- Pure CSS (component-based stylesheets)
- FontAwesome (icons)

**Backend:**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT (authentication)
- Docker (containerization)
- Jest (testing)

**Other:**
- Docker Compose (multi-container orchestration)
- Nginx (frontend serving in production)

---

## Features

- User registration and login (JWT-based authentication)
- Employee dashboard for marking/viewing attendance
- Admin dashboard for managing users and viewing attendance records
- Responsive UI with separate stylesheets for each component
- RESTful API backend
- Secure password storage
- Environment variable support for sensitive configuration

---

## Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- Docker & Docker Compose (optional, for containerized setup)

---

## Environment Variables

Both backend and frontend require environment variables for configuration.  
**Note:** `.env` files are gitignored for security. You must create them manually.

### Backend (`backend/.env`)

Create a file named `.env` in the `backend/` directory with the following content:

```env
MONGO_URI=mongodb+srv://nuwanisitharacom:nuwani808@cluster0.njcwh4b.mongodb.net/system_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretkey
PORT=5000
```

- `PORT`: Port for backend server (default: 5000)
- `MONGO_URI`: MongoDB connection string (local or Atlas)
- `JWT_SECRET`: Secret key for JWT signing

### Frontend (`frontend/.env`)

Create a file named `.env` in the `frontend/` directory with the following content:

```env
VITE_API_BASE_URL=http://backend:5000
```

- `VITE_API_BASE_URL`: URL where the backend API is running

---

## Setup & Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/nuwani-sithara/employee-attendance-system.git
cd employee-attendance-system
```

### 2. Backend Setup

```bash
cd backend
npm install
# Create .env as described above
npm run dev
```

- The backend will run on `http://localhost:5000` by default.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
# Create .env as described above
npm run dev
```

- The frontend will run on `http://localhost:5173` by default.

---

## Running with Docker

You can run both frontend and backend using Docker Compose:

```bash
# From the project root
docker-compose up --build
```

- Make sure to create the .env files in both backend/ and frontend/ before running this command.
- When running with Docker:
    -- The frontend will be available at http://localhost:3000/
    -- The backend will be available at http://localhost:5000/ (or as configured)
- The services and ports are defined in your docker-compose.yml and nginx.conf files.

---

## Running Tests

### Backend

```bash
cd backend
npm test
```

---

## Project Structure

```
employee-attendance-system/
  backend/
    src/
      controllers/
      middlewares/
      models/
      routes/
      ...
  frontend/
    src/
      components/
      pages/
      stylesheets/
      ...
```

---

## Notes

- All sensitive information (API keys, secrets) should be stored in `.env` files and never committed to version control.
- Each React component has its own CSS file for maintainable styling.
- For production deployment, ensure you set secure values for all environment variables.

---
