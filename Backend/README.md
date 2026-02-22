# TimeTable Manager — Backend

REST API built with **Express.js** and **MongoDB** (Mongoose) for managing school/institute timetables.

## Prerequisites

- **Node.js** v16+
- **MongoDB** v5+ running locally (or a remote URI)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your values (see below)

# 3. Initialize the database (creates admin account)
npm run init

# 4. Start the dev server
npm run dev
```

The API will be running at `http://localhost:5000`.

## Environment Variables

Create a `.env` file in the Backend root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/timetable_db
JWT_SECRET=your_secret_key_here
PORT=5000
```

Optional (used by `npm run init`):

```env
ADMIN_EMAIL=admin@school.com
ADMIN_PASSWORD=yourpassword
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm start` | Start in production mode |
| `npm run init` | Create database + admin account |
| `npm run seed:admin` | Seed an admin user only |

## API Endpoints

All endpoints are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/login` | No | Login with email & password, returns JWT |
| GET | `/me` | Yes | Get current user profile |

### Users — `/api/users` (Admin only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List all users |
| POST | `/` | Create a user |
| PUT | `/:id` | Update a user |
| DELETE | `/:id` | Delete a user |

### Sessions — `/api/sessions` (Authenticated)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List sessions (filtered by role) |
| POST | `/` | Create a session (Admin) |
| PUT | `/:id` | Update a session (Admin) |
| PATCH | `/:id/details` | Update notes/status (Admin/Instructor) |
| DELETE | `/:id` | Delete a session (Admin) |

Sessions include **conflict detection** — the API prevents double-booking of rooms, instructors, and groups.

### Resources — `/api/resources` (Admin only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/groups` | List all groups |
| POST | `/groups` | Create a group |
| DELETE | `/groups/:id` | Delete a group |
| GET | `/rooms` | List all rooms |
| POST | `/rooms` | Create a room |
| DELETE | `/rooms/:id` | Delete a room |
| GET | `/subjects` | List all subjects |
| POST | `/subjects` | Create a subject |
| DELETE | `/subjects/:id` | Delete a subject |

## Authentication

The API uses **JWT Bearer tokens**.

- Login via `POST /api/auth/login` to get a token
- Include the token in all authenticated requests:
  ```
  Authorization: Bearer <token>
  ```
- Tokens expire after **24 hours**

## Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full access — manage users, resources, and all sessions |
| **instructor** | View own sessions, update notes on own sessions |
| **student** | View sessions for their assigned group (read-only) |

## Data Models

### User
`name`, `email` (unique), `password_hash`, `role` (admin/instructor/student), `group_id` (optional, ref → Group)

### Session
`day_of_week` (1–7), `start_time`, `end_time`, `room_id`, `subject_id`, `group_id`, `instructor_id`, `status` (active/cancelled), `notes`

### Group
`name` (unique)

### Room
`name` (unique), `capacity`

### Subject
`name`, `code` (unique)

## Project Structure

```
Backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/           # Request handlers
├── middleware/
│   └── auth.js            # JWT auth + role authorization
├── models/                # Mongoose schemas
├── routes/                # Express route definitions
├── scripts/
│   ├── init.js            # DB init + admin setup
│   └── seedAdmin.js       # Admin seeder
├── services/              # Business logic + DB queries
└── src/
    ├── app.js             # Express app setup
    └── server.js          # Entry point
```
