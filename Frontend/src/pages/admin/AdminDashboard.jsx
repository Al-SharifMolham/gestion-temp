import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import timetableService from '../../services/timetableService';
import Loader from '../../components/ui/Loader';

const statCards = [
    {
        key: 'users',
        title: 'Total Users',
        link: '/admin/users',
        bgClass: 'bg-blue-50',
        iconClass: 'text-blue-600',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
    {
        key: 'sessions',
        title: 'Scheduled Sessions',
        link: '/admin/timetable',
        bgClass: 'bg-indigo-50',
        iconClass: 'text-indigo-600',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
    },
    {
        key: 'groups',
        title: 'Active Groups',
        link: '/admin/resources',
        bgClass: 'bg-emerald-50',
        iconClass: 'text-emerald-600',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
    },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, sessions: 0, groups: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, sessions] = await Promise.all([
                    userService.getAllUsers(),
                    timetableService.getAll({})
                ]);
                setStats({
                    users: users.length,
                    sessions: sessions.length,
                    groups: new Set(users.map(u => u.group_id).filter(Boolean)).size
                });
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="animate-slide-up">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of your timetable system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {statCards.map(card => (
                    <Link
                        key={card.key}
                        to={card.link}
                        className="group block bg-white rounded-xl shadow-card border border-gray-100/80 p-5 hover:shadow-elevated hover:border-gray-200 transition-all duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stats[card.key]}</h3>
                            </div>
                            <div className={`w-11 h-11 rounded-xl ${card.bgClass} ${card.iconClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                {card.icon}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100/80">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Quick Actions</h3>
                    <div className="space-y-2">
                        <Link to="/admin/timetable" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <span className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </span>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Schedule New Session</span>
                                <p className="text-xs text-gray-400">Add a session to the timetable</p>
                            </div>
                        </Link>
                        <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                </svg>
                            </span>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Add New User</span>
                                <p className="text-xs text-gray-400">Create instructor or student accounts</p>
                            </div>
                        </Link>
                        <Link to="/admin/resources" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <span className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </span>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Manage Resources</span>
                                <p className="text-xs text-gray-400">Groups, rooms, and subjects</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100/80">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">System Status</h3>
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-emerald-700">All systems operational</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
