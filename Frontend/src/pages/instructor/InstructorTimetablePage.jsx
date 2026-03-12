import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import timetableService from '../../services/timetableService';
import TimetableTable from '../../components/timetable/TimetableTable';
import DownloadSchedule from '../../components/timetable/DownloadSchedule';
import Loader from '../../components/ui/Loader';

export default function InstructorTimetablePage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await timetableService.getAll({ instructor_id: user?.id });
        setSessions(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [user]);

  return (
    <div className="animate-slide-up" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <p style={{ margin: '0 0 5px', fontSize: 9, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
            OFPPT — Espace Formateur
          </p>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            Mon Planning
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-3)' }}>
            Vos séances assignées cette semaine
          </p>
        </div>

        {!loading && sessions.length > 0 && (
          <DownloadSchedule
            sessions={sessions}
            title={`Planning_${user?.name?.replace(/\s+/g, '_') || 'Formateur'}`}
            subtitle={`Formateur : ${user?.name || ''}`}
          />
        )}
      </div>

      {loading ? <Loader /> : sessions.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '80px 0',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, boxShadow: 'var(--shadow-card)',
        }}>
          <svg width={48} height={48} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--text-4)" style={{ marginBottom: 12 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-3)', margin: 0 }}>Aucune séance assignée</p>
          <p style={{ fontSize: 12, color: 'var(--text-4)', margin: '4px 0 0' }}>Contactez l'administrateur pour plus d'informations</p>
        </div>
      ) : (
        <TimetableTable sessions={sessions} />
      )}
    </div>
  );
}