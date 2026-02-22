import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-200 mb-2">404</h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Page not found</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn-primary">
                Back to home
            </Link>
        </div>
    );
}
