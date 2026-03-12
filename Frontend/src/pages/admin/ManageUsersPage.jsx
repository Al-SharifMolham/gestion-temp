import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

const USER_ROLES = ['admin', 'instructor', 'student'];
const roleBadge = (role) => {
  const cls = { admin:'badge-blue', instructor:'badge-amber', student:'badge-green' };
  return <span className={`badge ${cls[role]||'badge-gray'}`}>{role}</span>;
};
const labelSt = { display:'block', fontSize:10, fontWeight:700, color:'var(--text-3)', marginBottom:7, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:"'JetBrains Mono', monospace" };
const th = { padding:'10px 18px', textAlign:'left', fontSize:9, fontWeight:700, color:'var(--text-4)', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'JetBrains Mono', monospace" };

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', group_id:'' });
  const [error, setError] = useState('');

  const load = async () => { setLoading(true); try { const [u,g] = await Promise.all([userService.getAllUsers(), userService.getGroups()]); setUsers(u); setGroups(g); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(()=>{ load(); },[]);

  const openCreate = () => { setEditing(null); setForm({name:'',email:'',password:'',role:'student',group_id:''}); setError(''); setIsOpen(true); };
  const openEdit   = u => { setEditing(u); setForm({name:u.name,email:u.email,password:'',role:u.role,group_id:u.group_id||''}); setError(''); setIsOpen(true); };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try { await userService.deleteUser(id); load(); } catch { alert('Échec de la suppression'); }
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (!form.email.includes('@')) { setError('Adresse e-mail invalide'); return; }
    if (!editing && form.password.length < 6) { setError('Mot de passe : 6 caractères minimum'); return; }
    if (form.password && form.password.length < 6) { setError('Mot de passe : 6 caractères minimum'); return; }
    try {
      if (editing) { const p={...form}; if(!p.password) delete p.password; await userService.updateUser(editing.id,p); }
      else { await userService.createUser(form); }
      setIsOpen(false); load();
    } catch(e) { setError(e.response?.data?.message||'Échec de la sauvegarde'); }
  };

  return (
    <div className="animate-slide-up" style={{fontFamily:"'Sora',sans-serif"}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <p style={{margin:'0 0 5px',fontSize:9,fontWeight:700,color:'var(--accent)',letterSpacing:'0.15em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>OFPPT — Gestion</p>
          <h1 style={{margin:'0 0 4px',fontSize:22,fontWeight:800,color:'var(--text-1)',letterSpacing:'-0.02em'}}>Utilisateurs</h1>
          <p style={{margin:0,fontSize:13,color:'var(--text-3)'}}>{users.length} utilisateur(s) au total</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{display:'flex',alignItems:'center',gap:6}}>
          <svg width={13} height={13} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Nouvel utilisateur
        </button>
      </div>

      {loading ? <Loader/> : (
        <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden',boxShadow:'var(--shadow-card)'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontFamily:"'Sora',sans-serif"}}>
            <thead>
              <tr style={{borderBottom:'1px solid var(--border)',background:'var(--bg-elevated)'}}>
                <th style={th}>Nom</th><th style={th}>E-mail</th><th style={th}>Rôle</th><th style={th}>Groupe</th><th style={{...th,textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} style={{borderBottom:'1px solid var(--border)',transition:'background 0.1s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--bg-elevated)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'13px 18px',fontSize:13,fontWeight:600,color:'var(--text-1)',whiteSpace:'nowrap'}}>{u.name}</td>
                  <td style={{padding:'13px 18px',fontSize:12,color:'var(--text-3)',whiteSpace:'nowrap',fontFamily:"'JetBrains Mono',monospace"}}>{u.email}</td>
                  <td style={{padding:'13px 18px',whiteSpace:'nowrap'}}>{roleBadge(u.role)}</td>
                  <td style={{padding:'13px 18px',fontSize:13,color:'var(--text-3)',whiteSpace:'nowrap'}}>{u.group_name||<span style={{color:'var(--text-4)'}}>—</span>}</td>
                  <td style={{padding:'13px 18px',textAlign:'right',whiteSpace:'nowrap'}}>
                    <button onClick={()=>openEdit(u)} className="btn-ghost" style={{color:'var(--accent)',marginRight:4}}>Modifier</button>
                    <button onClick={()=>handleDelete(u.id)} className="btn-ghost" style={{color:'var(--red)'}}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {users.length===0&&<tr><td colSpan={5} style={{padding:48,textAlign:'center',fontSize:13,color:'var(--text-4)'}}>Aucun utilisateur —&nbsp;<button onClick={openCreate} style={{background:'none',border:'none',cursor:'pointer',color:'var(--accent)',fontWeight:600,fontSize:13}}>en créer un</button></td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)} title={editing?'Modifier l\'utilisateur':'Nouvel utilisateur'}>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
          {error&&<div style={{padding:'9px 13px',borderRadius:10,background:'var(--red-dim)',border:'1px solid rgba(200,16,46,0.22)',fontSize:13,color:'var(--red-text)'}}>{error}</div>}
          <div><label style={labelSt}>Nom</label><input type="text" className="input-field" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><label style={labelSt}>E-mail</label><input type="email" className="input-field" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div><label style={labelSt}>Mot de passe {editing&&<span style={{color:'var(--text-4)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(laisser vide pour conserver)</span>}</label><input type="password" className="input-field" placeholder={editing?'••••••':'6 caractères minimum'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label style={labelSt}>Rôle</label><select className="input-field" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{USER_ROLES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
            {form.role==='student'&&<div><label style={labelSt}>Groupe</label><select className="input-field" value={form.group_id} onChange={e=>setForm({...form,group_id:e.target.value})}><option value="">Sélectionner</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div>}
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,paddingTop:6,borderTop:'1px solid var(--border)',marginTop:2}}>
            <button type="button" onClick={()=>setIsOpen(false)} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary">{editing?'Enregistrer':'Créer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
