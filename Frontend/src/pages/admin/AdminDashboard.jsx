import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import timetableService from '../../services/timetableService';
import Loader from '../../components/ui/Loader';

const CARDS = [
  { key:'users',    label:'Utilisateurs',       link:'/admin/users',     color:'var(--blue)',   glow:'rgba(96,165,250,0.2)',
    icon:<svg width={18} height={18} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
  { key:'sessions', label:'Séances Planifiées', link:'/admin/timetable', color:'var(--accent)', glow:'var(--accent-glow)',
    icon:<svg width={18} height={18} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
  { key:'groups',   label:'Groupes Actifs',     link:'/admin/resources', color:'var(--amber)',  glow:'rgba(245,158,11,0.2)',
    icon:<svg width={18} height={18} fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg> },
];

const ACTIONS = [
  { label:'Planifier une Séance', desc:'Ajouter à l\'emploi du temps',    to:'/admin/timetable', color:'var(--accent)' },
  { label:'Ajouter un Utilisateur', desc:'Créer un formateur ou stagiaire', to:'/admin/users',     color:'var(--teal)'   },
  { label:'Gérer les Ressources', desc:'Groupes, salles et modules',        to:'/admin/resources', color:'var(--amber)'  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users:0, sessions:0, groups:0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [users, sessions] = await Promise.all([userService.getAllUsers(), timetableService.getAll({})]);
        setStats({ users:users.length, sessions:sessions.length, groups:new Set(users.map(u=>u.group_id).filter(Boolean)).size });
      } catch(e){ console.error(e); }
      finally{ setLoading(false); }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="animate-slide-up" style={{ fontFamily:"'Sora', sans-serif" }}>
      {/* header */}
      <div style={{ marginBottom:28 }}>
        <p style={{ margin:'0 0 5px', fontSize:9, fontWeight:700, color:'var(--accent)', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:"'JetBrains Mono', monospace" }}>
          OFPPT — Tableau de Bord
        </p>
        <h1 style={{ margin:0, fontSize:26, fontWeight:800, color:'var(--text-1)', letterSpacing:'-0.025em' }}>
          Vue d'ensemble
        </h1>
      </div>

      {/* stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))', gap:14, marginBottom:20 }}>
        {CARDS.map(card => (
          <Link key={card.key} to={card.link} style={{ display:'block', textDecoration:'none',
            background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16,
            padding:'18px 20px', position:'relative', overflow:'hidden',
            boxShadow:'var(--shadow-card)',
            transition:'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 28px ${card.glow}`; e.currentTarget.style.borderColor=`color-mix(in srgb, ${card.color} 30%, transparent)`; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-card)'; e.currentTarget.style.borderColor='var(--border)'; }}
          >
            {/* shimmer top */}
            <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:`linear-gradient(90deg, transparent, ${card.color}, transparent)`, opacity:0.6 }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <p style={{ margin:'0 0 9px', fontSize:11, color:'var(--text-3)', fontWeight:500 }}>{card.label}</p>
                <p style={{ margin:0, fontSize:40, fontWeight:800, color:'var(--text-1)', letterSpacing:'-0.04em', lineHeight:1 }}>{stats[card.key]}</p>
              </div>
              <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:`color-mix(in srgb, ${card.color} 15%, transparent)`, display:'flex', alignItems:'center', justifyContent:'center', color:card.color }}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* bottom */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:20, boxShadow:'var(--shadow-card)' }}>
          <p style={{ margin:'0 0 14px', fontSize:9, fontWeight:700, color:'var(--text-4)', letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:"'JetBrains Mono', monospace" }}>Actions Rapides</p>
          {ACTIONS.map(a => (
            <Link key={a.to} to={a.to} style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 10px', borderRadius:10, textDecoration:'none', transition:'background 0.12s' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg-elevated)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div style={{ width:7, height:7, borderRadius:'50%', background:a.color, flexShrink:0, boxShadow:`0 0 8px color-mix(in srgb, ${a.color} 60%, transparent)` }} />
              <div>
                <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-2)' }}>{a.label}</div>
                <div style={{ fontSize:11, color:'var(--text-4)' }}>{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:20, boxShadow:'var(--shadow-card)' }}>
          <p style={{ margin:'0 0 14px', fontSize:9, fontWeight:700, color:'var(--text-4)', letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:"'JetBrains Mono', monospace" }}>État du Système</p>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 15px', borderRadius:11, background:'var(--accent-dim)', border:'1px solid rgba(0,166,81,0.2)' }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent)', flexShrink:0, boxShadow:'0 0 10px var(--accent-glow)' }} />
            <span style={{ fontSize:13, fontWeight:600, color:'var(--accent)' }}>Tous les systèmes opérationnels</span>
          </div>
          <div style={{ marginTop:12, padding:'11px 14px', borderRadius:11, background:'var(--bg-elevated)', border:'1px solid var(--border)' }}>
            <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:4 }}>Version du système</div>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--text-1)', fontFamily:"'JetBrains Mono', monospace" }}>OFPPT-TMS v2.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
