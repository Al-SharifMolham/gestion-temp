import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ allowedRoles }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    console.log('ProtectedRoute Debug:', {
        path: location.pathname,
        isLoading,
        user,
        userRole: user?.role,
        userRoleNormalized: user?.role?.trim().toLowerCase(),
        allowedRoles,
        allowedRolesValues: allowedRoles?.map(role => role.trim().toLowerCase()),
    });

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const normalizedUserRole = user.role?.trim().toLowerCase();
    const normalizedAllowedRoles = allowedRoles?.map(role => role.trim().toLowerCase());

    if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(normalizedUserRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}