import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import timetableService from '../../services/timetableService';
import TimetableTable from '../../components/timetable/TimetableTable';
import DownloadSchedule from '../../components/timetable/DownloadSchedule';
import Loader from '../../components/ui/Loader';

export default function StudentTimetablePage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await timetableService.getAll({ group_id: user?.group_id });
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
            OFPPT — Espace Stagiaire
          </p>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            Mon Emploi du Temps
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-3)' }}>
            Planning hebdomadaire de votre groupe
          </p>
        </div>

        {!loading && sessions.length > 0 && (
          <DownloadSchedule
            sessions={sessions}
            title={`EmploiDuTemps_${user?.group_name?.replace(/\s+/g, '_') || 'Groupe'}`}
            subtitle={`Stagiaire : ${user?.name || ''} — Groupe : ${user?.group_name || ''}`}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-3)', margin: 0 }}>Aucune séance planifiée</p>
          <p style={{ fontSize: 12, color: 'var(--text-4)', margin: '4px 0 0' }}>Votre emploi du temps est vide pour le moment</p>
        </div>
      ) : (
        <TimetableTable sessions={sessions} />
      )}
    </div>
  );
}