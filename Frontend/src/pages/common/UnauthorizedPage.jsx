import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-bold text-red-100 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                You do not have permission to view this page.
            </p>
            <Link to="/" className="btn-primary">
                Go Back Home
            </Link>
        </div>
    );
}
