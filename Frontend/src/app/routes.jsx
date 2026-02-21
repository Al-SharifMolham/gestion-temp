import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageTimetablePage from '../pages/admin/ManageTimetablePage';
import InstructorTimetablePage from '../pages/instructor/InstructorTimetablePage';
import StudentTimetablePage from '../pages/student/StudentTimetablePage';
import NotFoundPage from '../pages/common/NotFoundPage';
import UnauthorizedPage from '../pages/common/UnauthorizedPage';

// Components
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/ui/ProtectedRoute';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Application */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    {/* Default redirect based on role? Or a Home wrapper. 
                        For now, we route / to specific pages or handle it in App. 
                        Let's just use explicit paths for now. */}

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<ManageUsersPage />} />
                        <Route path="/admin/timetable" element={<ManageTimetablePage />} />
                    </Route>

                    {/* Instructor Routes */}
                    <Route element={<ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]} />}>
                        <Route path="/instructor/timetable" element={<InstructorTimetablePage />} />
                    </Route>

                    {/* Student Routes */}
                    <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
                        <Route path="/student/timetable" element={<StudentTimetablePage />} />
                    </Route>

                    {/* Access to Timetable View - Generic or Role Specific?
                        User asked for:
                        - Student: StudentTimetablePage
                        - Instructor: InstructorTimetablePage
                        - Admin: ManageTimetablePage
                        I'll map '/' to the appropriate page for convenience, or Redirect.
                     */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    {/* Ideally logic to redirect to correct dashboard would go here or in Login */}

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
