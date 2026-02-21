import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export default function Sidebar() {
    const { user } = useAuth();

    const links = [
        { label: 'My Timetable', to: '/', roles: [ROLES.INSTRUCTOR, ROLES.STUDENT] },
        { label: 'Dashboard', to: '/admin', roles: [ROLES.ADMIN] },
        { label: 'Users', to: '/admin/users', roles: [ROLES.ADMIN] },
        { label: 'Master Timetable', to: '/admin/timetable', roles: [ROLES.ADMIN] },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-[calc(100vh-64px)] fixed left-0 top-16 sidebar-glass">
            <div className="flex-1 py-6 px-3 space-y-1">
                {links.map((link) => {
                    if (link.roles && !link.roles.includes(user?.role)) return null;
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `
                                flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? 'bg-blue-50 text-blue-700 shadow-sm translate-x-1'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            {link.label}
                        </NavLink>
                    );
                })}
            </div>
        </aside>
    );
}
