import { useState, useEffect } from 'react';
import timetableService from '../../services/timetableService';
import TimetableTable from '../../components/timetable/TimetableTable';
import FiltersBar from '../../components/timetable/FiltersBar';
import SessionForm from '../../components/timetable/SessionForm';
import DownloadSchedule from '../../components/timetable/DownloadSchedule';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

export default function ManageTimetablePage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => { setLoading(true); try { setSessions(await timetableService.getAll(filters)); } catch(e){console.error(e);} finally{setLoading(false);} };
  useEffect(()=>{ load(); },[filters]);

  const handleSubmit = async fd => {
    if(editing) await timetableService.update(editing.id, fd);
    else await timetableService.create(fd);
    setIsOpen(false); load();
  };
  const handleDelete = async () => {
    if(!editing) return;
    if(window.confirm('Supprimer cette séance ?')) { await timetableService.delete(editing.id); setIsOpen(false); load(); }
  };

  return (
    <div className="animate-slide-up" style={{ fontFamily:"'Sora', sans-serif" }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <p style={{ margin:'0 0 5px', fontSize:9, fontWeight:700, color:'var(--accent)', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:"'JetBrains Mono', monospace" }}>OFPPT — Administration</p>
          <h1 style={{ margin:'0 0 4px', fontSize:22, fontWeight:800, color:'var(--text-1)', letterSpacing:'-0.02em' }}>Emploi du Temps</h1>
          <p style={{ margin:0, fontSize:13, color:'var(--text-3)' }}>{sessions.length} séance(s) planifiée(s)</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {!loading && sessions.length > 0 && (
            <DownloadSchedule sessions={sessions} title="EmploiDuTemps_Admin" subtitle="Vue complète — Administrateur" />
          )}
          <button onClick={()=>{ setEditing(null); setIsOpen(true); }} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:6 }}>
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Nouvelle séance
          </button>
        </div>
      </div>

      <FiltersBar filters={filters} onFilterChange={setFilters} />
      {loading ? <Loader /> : <TimetableTable sessions={sessions} onSessionClick={s=>{ setEditing(s); setIsOpen(true); }} role="admin" />}

      <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)} title={editing?.id ? 'Modifier la séance' : 'Nouvelle séance'}>
        <SessionForm initialData={editing} onSubmit={handleSubmit} onCancel={()=>setIsOpen(false)} />
        {editing?.id && (
          <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end' }}>
            <button onClick={handleDelete} className="btn-ghost" style={{ color:'var(--red)', display:'flex', alignItems:'center', gap:6 }}>
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
              Supprimer la séance
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
