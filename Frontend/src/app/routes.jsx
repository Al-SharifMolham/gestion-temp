import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageTimetablePage from '../pages/admin/ManageTimetablePage';
import ManageResourcesPage from '../pages/admin/ManageResourcesPage';
import InstructorTimetablePage from '../pages/instructor/InstructorTimetablePage';
import StudentTimetablePage from '../pages/student/StudentTimetablePage';
import NotFoundPage from '../pages/common/NotFoundPage';
import UnauthorizedPage from '../pages/common/UnauthorizedPage';

// Components
import AppLayout from '../components/layout/AppLayout';
import Loader from '../components/ui/Loader';

function ProtectedRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.trim().toLowerCase();
  const normalizedAllowedRoles = allowedRoles?.map((r) => r.trim().toLowerCase());

  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

function RoleRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.trim().toLowerCase();

  if (role === ROLES.ADMIN.toLowerCase()) {
    return <Navigate to="/admin" replace />;
  }

  if (role === ROLES.INSTRUCTOR.toLowerCase()) {
    return <Navigate to="/instructor/timetable" replace />;
  }

  if (role === ROLES.STUDENT.toLowerCase()) {
    return <Navigate to="/student/timetable" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Root redirect by role */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/timetable" element={<ManageTimetablePage />} />
          <Route path="/admin/resources" element={<ManageResourcesPage />} />
        </Route>
      </Route>

      {/* Instructor */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]} />}>
        <Route element={<AppLayout />}>
          <Route path="/instructor/timetable" element={<InstructorTimetablePage />} />
        </Route>
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route element={<AppLayout />}>
          <Route path="/student/timetable" element={<StudentTimetablePage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}