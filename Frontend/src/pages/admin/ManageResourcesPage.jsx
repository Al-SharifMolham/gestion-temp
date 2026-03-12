import { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';
import Loader from '../../components/ui/Loader';

const TABS = [{key:'groups',label:'Groupes'},{key:'rooms',label:'Salles'},{key:'subjects',label:'Modules'}];
const labelSt = { display:'block', fontSize:10, fontWeight:700, color:'var(--text-3)', marginBottom:7, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:"'JetBrains Mono',monospace" };
const plus = <svg width={12} height={12} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>;

function Table({ items, columns, onDelete }) {
  return (
    <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden',boxShadow:'var(--shadow-card)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontFamily:"'Sora',sans-serif"}}>
        <thead>
          <tr style={{borderBottom:'1px solid var(--border)',background:'var(--bg-elevated)'}}>
            {columns.map(c=><th key={c.key} style={{padding:'10px 18px',textAlign:'left',fontSize:9,fontWeight:700,color:'var(--text-4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>{c.label}</th>)}
            <th style={{padding:'10px 18px',textAlign:'right',fontSize:9,fontWeight:700,color:'var(--text-4)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item=>(
            <tr key={item.id} style={{borderBottom:'1px solid var(--border)',transition:'background 0.1s'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg-elevated)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              {columns.map(c=><td key={c.key} style={{padding:'12px 18px',fontSize:13,color:'var(--text-2)',whiteSpace:'nowrap'}}>{item[c.key]??<span style={{color:'var(--text-4)'}}>{c.fallback??''}</span>}</td>)}
              <td style={{padding:'12px 18px',textAlign:'right'}}>
                <button onClick={()=>onDelete(item.id,item)} className="btn-ghost" style={{color:'var(--red)'}}>Supprimer</button>
              </td>
            </tr>
          ))}
          {items.length===0&&<tr><td colSpan={columns.length+1} style={{padding:40,textAlign:'center',fontSize:13,color:'var(--text-4)'}}>Aucun élément</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default function ManageResourcesPage() {
  const [tab, setTab] = useState('groups');
  const [data, setData] = useState({groups:[],rooms:[],subjects:[]});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gName, setGName] = useState('');
  const [rName, setRName] = useState(''); const [rCap, setRCap] = useState('');
  const [sName, setSName] = useState(''); const [sCode, setSCode] = useState('');

  const load = async () => { setLoading(true); try { const [g,r,s]=await Promise.all([resourceService.getGroups(),resourceService.getRooms(),resourceService.getSubjects()]); setData({groups:g,rooms:r,subjects:s}); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(()=>{load();},[]);

  const addGroup   = async e => { e.preventDefault(); setError(''); try { await resourceService.createGroup(gName.trim()); setGName(''); load(); } catch(e){setError(e.response?.data?.message||'Échec');} };
  const addRoom    = async e => { e.preventDefault(); setError(''); try { await resourceService.createRoom(rName.trim(), rCap?Number(rCap):null); setRName(''); setRCap(''); load(); } catch(e){setError(e.response?.data?.message||'Échec');} };
  const addSubject = async e => { e.preventDefault(); setError(''); try { await resourceService.createSubject(sName.trim(), sCode.trim()); setSName(''); setSCode(''); load(); } catch(e){setError(e.response?.data?.message||'Échec');} };
  const del = async (type,id,name) => {
    if (!window.confirm(`Supprimer "${name}" ?`)) return;
    try {
      if(type==='groups') await resourceService.deleteGroup(id);
      else if(type==='rooms') await resourceService.deleteRoom(id);
      else await resourceService.deleteSubject(id);
      load();
    } catch { alert('Suppression impossible — élément en cours d\'utilisation.'); }
  };

  if (loading) return <Loader/>;

  return (
    <div className="animate-slide-up" style={{fontFamily:"'Sora',sans-serif"}}>
      <div style={{marginBottom:24}}>
        <p style={{margin:'0 0 5px',fontSize:9,fontWeight:700,color:'var(--accent)',letterSpacing:'0.15em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>OFPPT — Gestion</p>
        <h1 style={{margin:'0 0 4px',fontSize:22,fontWeight:800,color:'var(--text-1)',letterSpacing:'-0.02em'}}>Ressources</h1>
        <p style={{margin:0,fontSize:13,color:'var(--text-3)'}}>Groupes, salles et modules de formation</p>
      </div>

      {error&&<div style={{marginBottom:14,padding:'9px 13px',borderRadius:10,background:'var(--red-dim)',border:'1px solid rgba(200,16,46,0.22)',fontSize:13,color:'var(--red-text)'}}>{error}</div>}

      {/* tabs */}
      <div style={{display:'flex',borderBottom:'1px solid var(--border)',marginBottom:22,gap:2}}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>{setTab(t.key);setError('');}} style={{
            padding:'9px 16px',border:'none',cursor:'pointer',fontSize:12.5,fontWeight:600,
            fontFamily:"'Sora',sans-serif",background:'transparent',
            borderBottom:`2px solid ${tab===t.key?'var(--accent)':'transparent'}`,
            marginBottom:-1, color:tab===t.key?'var(--accent)':'var(--text-3)',
            transition:'color 0.12s',display:'flex',alignItems:'center',gap:7,
          }}>
            {t.label}
            <span style={{fontSize:9,padding:'1px 6px',borderRadius:5,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,
              background:tab===t.key?'var(--accent-dim)':'var(--bg-elevated)',
              color:tab===t.key?'var(--accent)':'var(--text-4)'}}>{data[t.key].length}</span>
          </button>
        ))}
      </div>

      {tab==='groups'&&<><form onSubmit={addGroup} style={{display:'flex',gap:10,marginBottom:16}}><input className="input-field" style={{flex:1}} placeholder="Nom du groupe (ex: TDI-201)" value={gName} onChange={e=>setGName(e.target.value)} required/><button type="submit" className="btn-primary" style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>{plus} Ajouter</button></form><Table items={data.groups} columns={[{key:'name',label:'Nom'}]} onDelete={(id,i)=>del('groups',id,i.name)}/></>}
      {tab==='rooms'&&<><form onSubmit={addRoom} style={{display:'flex',gap:10,marginBottom:16}}><input className="input-field" style={{flex:1}} placeholder="Nom de la salle (ex: Salle A1)" value={rName} onChange={e=>setRName(e.target.value)} required/><input className="input-field" style={{width:110}} placeholder="Capacité" type="number" value={rCap} onChange={e=>setRCap(e.target.value)}/><button type="submit" className="btn-primary" style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>{plus} Ajouter</button></form><Table items={data.rooms} columns={[{key:'name',label:'Nom'},{key:'capacity',label:'Capacité',fallback:'—'}]} onDelete={(id,i)=>del('rooms',id,i.name)}/></>}
      {tab==='subjects'&&<><form onSubmit={addSubject} style={{display:'flex',gap:10,marginBottom:16}}><input className="input-field" style={{flex:1}} placeholder="Nom du module (ex: Développement Web)" value={sName} onChange={e=>setSName(e.target.value)} required/><input className="input-field" style={{width:130}} placeholder="Code (ex: DW)" value={sCode} onChange={e=>setSCode(e.target.value)} required/><button type="submit" className="btn-primary" style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>{plus} Ajouter</button></form><Table items={data.subjects} columns={[{key:'name',label:'Module'},{key:'code',label:'Code'}]} onDelete={(id,i)=>del('subjects',id,i.name)}/></>}
    </div>
  );
}
