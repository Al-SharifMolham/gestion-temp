# TimeTable Manager — Frontend

React SPA for managing school/institute timetables. Built with **React 18**, **Vite**, and **Tailwind CSS**.

## Prerequisites

- **Node.js** v16+
- Backend API running on `http://localhost:5000` (see [Backend README](../Backend/README.md))

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The app will be running at `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Configuration

The API base URL is configured in `src/services/apiClient.js`:

```js
baseURL: 'http://localhost:5000/api'
```

Change this if your backend runs on a different host or port.

## User Roles

The app has three roles, each with a different interface:

| Role | Default Route | Features |
|------|---------------|----------|
| **Admin** | `/admin` | Dashboard, manage users, manage resources (groups/rooms/subjects), manage timetable |
| **Instructor** | `/instructor/timetable` | View own schedule, add notes to sessions |
| **Student** | `/student/timetable` | View group's timetable (read-only) |

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login page |
| `/admin` | Admin | Dashboard with stats |
| `/admin/users` | Admin | Create, edit, delete users |
| `/admin/resources` | Admin | Manage groups, rooms, subjects |
| `/admin/timetable` | Admin | Weekly timetable grid, create/edit sessions |
| `/instructor/timetable` | Instructor | View schedule, edit session notes |
| `/student/timetable` | Student | View group schedule |

## Tech Stack

- **React** 18.2 — UI library
- **React Router** 6 — Client-side routing
- **Axios** — HTTP client with interceptors (auto-attaches JWT, handles 401)
- **Tailwind CSS** 3.3 — Utility-first styling
- **Vite** 4.4 — Dev server & build tool

## Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── App.jsx           # Root component
│   │   └── routes.jsx        # All routes definition
│   ├── components/
│   │   ├── layout/           # Navbar, Sidebar, AppLayout
│   │   ├── timetable/        # TimetableTable, FiltersBar, SessionForm
│   │   └── ui/               # Modal, Loader, ProtectedRoute
│   ├── context/
│   │   └── AuthContext.jsx   # Auth state (login, logout, user)
│   ├── pages/
│   │   ├── admin/            # Dashboard, Users, Resources, Timetable
│   │   ├── auth/             # Login
│   │   ├── common/           # 404, 403
│   │   ├── instructor/       # Instructor timetable
│   │   └── student/          # Student timetable
│   ├── services/             # API clients (auth, user, timetable, resource)
│   ├── styles/
│   │   └── globals.css       # Tailwind + custom component classes
│   └── utils/
│       ├── constants.js      # Roles, days of week
│       └── storage.js        # LocalStorage helpers
├── index.html
├── tailwind.config.js
└── vite.config.js
```

## Authentication Flow

1. User logs in at `/login`
2. JWT token is stored in localStorage
3. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
4. On 401 response, the user is automatically logged out and redirected to `/login`
5. `ProtectedRoute` component checks auth + role before rendering pages
