import { useEffect, useState } from 'react';
import userService from '../../services/userService';

export default function FiltersBar({ filters, onFilterChange }) {
  const [groups, setGroups] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    Promise.all([userService.getGroups(), userService.getInstructors()])
      .then(([g,i])=>{ setGroups(g); setInstructors(i); })
      .catch(console.error);
  }, []);

  const h = e => { const {name,value}=e.target; onFilterChange({...filters,[name]:value}); };

  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,padding:'12px 16px',marginBottom:18,fontFamily:"'Sora',sans-serif",boxShadow:'var(--shadow-card)'}}>
      <div style={{display:'flex',alignItems:'center',gap:7,marginRight:4}}>
        <svg width={13} height={13} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="var(--text-4)"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"/></svg>
        <span style={{fontSize:9,fontWeight:700,color:'var(--text-4)',letterSpacing:'0.14em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace"}}>Filtres</span>
      </div>
      <select name="day_of_week" value={filters.day_of_week||''} onChange={h} className="input-field" style={{width:'auto',padding:'7px 12px',fontSize:12.5}}>
        <option value="">Tous les jours</option>
        {['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'].map((d,i)=><option key={i+1} value={i+1}>{d}</option>)}
      </select>
      <select name="group_id" value={filters.group_id||''} onChange={h} className="input-field" style={{width:'auto',padding:'7px 12px',fontSize:12.5}}>
        <option value="">Tous les groupes</option>
        {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <select name="instructor_id" value={filters.instructor_id||''} onChange={h} className="input-field" style={{width:'auto',padding:'7px 12px',fontSize:12.5}}>
        <option value="">Tous les formateurs</option>
        {instructors.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
      </select>
    </div>
  );
}
