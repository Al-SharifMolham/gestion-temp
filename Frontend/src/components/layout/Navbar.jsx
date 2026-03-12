import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function Avatar({ name }) {
  const initials = (name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
      background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 700, color: '#fff',
      boxShadow: '0 2px 8px var(--accent-glow)',
      fontFamily: "'JetBrains Mono', monospace",
    }}>{initials}</div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 44, height: 24, borderRadius: 12, border: '1px solid var(--border-mid)',
        background: isDark ? 'rgba(0,166,81,0.15)' : 'rgba(0,104,55,0.1)',
        cursor: 'pointer', padding: '2px 3px',
        display: 'flex', alignItems: 'center',
        transition: 'background 0.2s',
        position: 'relative', outline: 'none',
      }}
    >
      {/* track icons */}
      <span style={{ position:'absolute', left:5, fontSize:10, opacity: isDark ? 0.4 : 0 }}>🌙</span>
      <span style={{ position:'absolute', right:5, fontSize:10, opacity: isDark ? 0 : 0.8 }}>☀️</span>
      {/* thumb */}
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: 'var(--accent)',
        boxShadow: '0 1px 4px var(--accent-glow)',
        transform: isDark ? 'translateX(0)' : 'translateX(20px)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isDark
          ? <svg width={9} height={9} viewBox="0 0 24 24" fill="white"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          : <svg width={9} height={9} viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="5"/><path stroke="white" strokeWidth="2" strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        }
      </div>
    </button>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      height: 54,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px',
      position: 'sticky', top: 0, zIndex: 30,
      fontFamily: "'Sora', sans-serif",
      boxShadow: '0 1px 0 var(--border)',
    }}>
      {/* ── OFPPT Brand ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        {/* OFPPT logo mark: green square + red accent */}
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px var(--accent-glow)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* red stripe accent */}
          <div style={{ position:'absolute', top:0, right:0, width:10, height:32, background:'var(--red)', opacity:0.9 }} />
          <span style={{ fontSize:10, fontWeight:800, color:'#fff', letterSpacing:'-0.02em', position:'relative', zIndex:1, fontFamily:"'JetBrains Mono', monospace" }}>OP</span>
        </div>

        <div>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--text-1)', letterSpacing:'-0.02em', lineHeight:1.1 }}>
            OFPPT
            <span style={{ fontSize:11, fontWeight:500, color:'var(--text-3)', marginLeft:5, letterSpacing:0 }}>
              Timetable
            </span>
          </div>
          <div style={{ fontSize:9, fontWeight:600, color:'var(--accent)', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:"'JetBrains Mono', monospace", lineHeight:1 }}>
            Gestion des Emplois du Temps
          </div>
        </div>
      </div>

      {/* ── Right controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle />

        <div style={{ width:1, height:20, background:'var(--border-mid)' }} />

        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--text-1)', lineHeight:1.2 }}>{user?.name}</div>
          <div style={{ fontSize:9, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:"'JetBrains Mono', monospace" }}>{user?.role}</div>
        </div>
        <Avatar name={user?.name} />

        <div style={{ width:1, height:20, background:'var(--border-mid)' }} />

        <button
          onClick={logout}
          style={{
            display:'flex', alignItems:'center', gap:5,
            background:'none', border:'none', cursor:'pointer',
            padding:'5px 8px', borderRadius:8,
            color:'var(--text-3)', fontSize:12, fontWeight:500,
            fontFamily:"'Sora', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.color='var(--red)'; e.currentTarget.style.background='var(--red-dim)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--text-3)'; e.currentTarget.style.background='none'; }}
        >
          <svg width={14} height={14} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
