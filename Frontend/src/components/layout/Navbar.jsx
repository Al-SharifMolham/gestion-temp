import { useAuth } from '../../context/AuthContext';

function UserAvatar({ name }) {
    const initials = (name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
            {initials}
        </div>
    );
}

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 px-6 py-3 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                </div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                    TimeTable<span className="text-indigo-600">Manager</span>
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
                <UserAvatar name={user?.name} />
                <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />
                <button
                    onClick={logout}
                    className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors duration-150 flex items-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
}
