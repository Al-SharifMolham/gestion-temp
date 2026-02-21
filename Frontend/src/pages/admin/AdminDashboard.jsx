import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import timetableService from '../../services/timetableService';
import Loader from '../../components/ui/Loader';

const StatCard = ({ title, count, link, color }) => (
    <Link to={link || '#'} className={`block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${color}-50 text-${color}-600`}>
                <div className={`w-3 h-3 rounded-full bg-${color}-400`}></div>
                {/* Simplified icon for now */}
            </div>
        </div>
    </Link>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, sessions: 0, groups: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Parallel fetch for quick overview
                // Note: Realistically backend should have a /stats endpoint. 
                // We'll approximate by checking length of data for MVP as permitted by "polish" scope.
                const [users, sessions] = await Promise.all([
                    userService.getAllUsers(),
                    timetableService.getAll({}) // no filter = all
                ]);

                setStats({
                    users: users.length,
                    sessions: sessions.length,
                    // Simple distinct group count if reachable or mock
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
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" count={stats.users} link="/admin/users" color="blue" />
                <StatCard title="Scheduled Sessions" count={stats.sessions} link="/admin/timetable" color="indigo" />
                <StatCard title="Active Groups" count={stats.groups} link="#" color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/admin/timetable" className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg">+</span>
                            <span className="font-medium text-gray-700">Schedule New Session</span>
                        </Link>
                        <Link to="/admin/users" className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-lg">+</span>
                            <span className="font-medium text-gray-700">Add New User</span>
                        </Link>
                    </div>
                </div>

                {/* Placeholder for Recent Activity or Notifications if defined later */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-400">
                    <p>System Status: Operational</p>
                </div>
            </div>
        </div>
    );
}
