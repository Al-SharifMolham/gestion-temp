import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

const icons = {
  dashboard:   <svg width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  users:       <svg width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  resources:   <svg width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
  timetable:   <svg width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  myTimetable: <svg width={16} height={16} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = [
    { label: 'Mon Emploi du Temps', to: '/',               roles: [ROLES.INSTRUCTOR, ROLES.STUDENT], icon: icons.myTimetable },
    { label: 'Tableau de Bord',     to: '/admin',           roles: [ROLES.ADMIN], icon: icons.dashboard },
    { label: 'Utilisateurs',        to: '/admin/users',     roles: [ROLES.ADMIN], icon: icons.users },
    { label: 'Ressources',          to: '/admin/resources', roles: [ROLES.ADMIN], icon: icons.resources },
    { label: 'Emploi du Temps',     to: '/admin/timetable', roles: [ROLES.ADMIN], icon: icons.timetable },
  ];

  return (
    <aside style={{
      width: 230,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      height: 'calc(100vh - 54px)',
      position: 'fixed', left: 0, top: 54,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Sora', sans-serif",
      transition: 'background 0.25s, border-color 0.25s',
    }}>
      {/* OFPPT badge in sidebar */}
      <div style={{
        margin: '14px 12px 6px',
        padding: '9px 12px',
        borderRadius: 10,
        background: 'var(--accent-dim)',
        border: '1px solid rgba(0,166,81,0.18)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', boxShadow:'0 0 8px var(--accent-glow)', flexShrink:0 }} />
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--accent)', letterSpacing:'0.06em', fontFamily:"'JetBrains Mono', monospace" }}>OFPPT</div>
          <div style={{ fontSize:9, color:'var(--text-3)', letterSpacing:'0.04em' }}>Système de Gestion</div>
        </div>
      </div>

      <nav style={{ flex:1, padding:'8px 10px', overflowY:'auto' }}>
        <p style={{
          fontSize:9, fontWeight:600, color:'var(--text-4)',
          letterSpacing:'0.14em', textTransform:'uppercase',
          padding:'0 8px', marginBottom:8,
          fontFamily:"'JetBrains Mono', monospace",
        }}>Navigation</p>

        {links.map(link => {
          if (link.roles && !link.roles.includes(user?.role)) return null;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 10px', borderRadius: 10, marginBottom: 2,
                fontSize: 12.5, fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text-3)',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(0,166,81,0.2)' : 'transparent'}`,
                transition: 'all 0.12s ease',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget;
                if (!el.style.background.includes('accent-dim') && !el.style.color.includes('accent)')) {
                  el.style.background = 'var(--bg-elevated)';
                  el.style.color = 'var(--text-2)';
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                if (!el.style.background.includes('accent-dim') && !el.style.color.includes('accent)')) {
                  el.style.background = 'transparent';
                  el.style.color = 'var(--text-3)';
                }
              }}
            >
              <span style={{ flexShrink:0 }}>{link.icon}</span>
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* bottom footer */}
      <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border)' }}>
        <p style={{ margin:0, fontSize:9, color:'var(--text-4)', letterSpacing:'0.06em', fontFamily:"'JetBrains Mono', monospace", textAlign:'center' }}>
          © OFPPT — Maroc
        </p>
      </div>
    </aside>
  );
}
