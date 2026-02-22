import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            </div>
            <h1 className="text-5xl font-bold text-red-100 mb-2">403</h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Access denied</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm">
                You don't have permission to view this page.
            </p>
            <Link to="/" className="btn-primary">
                Back to home
            </Link>
        </div>
    );
}
