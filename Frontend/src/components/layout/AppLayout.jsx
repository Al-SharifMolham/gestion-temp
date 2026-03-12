import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', transition:'background 0.25s' }}>
      <Navbar />
      <div style={{ display:'flex' }}>
        <Sidebar />
        <main style={{
          flex: 1, marginLeft: 230,
          padding: '32px 36px',
          minHeight: 'calc(100vh - 54px)',
        }} className="animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
