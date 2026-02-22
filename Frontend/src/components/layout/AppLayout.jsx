import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-50/80">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 md:ml-64 p-8 min-h-[calc(100vh-49px)] animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
