import { useState, useEffect } from 'react';
import userService from '../../services/userService';

const labelSt = {
  display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
  marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase',
  fontFamily: "'JetBrains Mono', monospace",
};
const gridRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };

export default function SessionForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    day_of_week: '1', start_time: '08:00', end_time: '09:00',
    room_id: '', group_id: '', instructor_id: '', subject_id: '',
    status: 'active', notes: ''
  });
  const [data, setData] = useState({ groups: [], rooms: [], subjects: [], instructors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev, ...initialData,
        start_time: initialData.start_time?.substring(0, 5),
        end_time: initialData.end_time?.substring(0, 5),
      }));
    }
    (async () => {
      try {
        const [g, r, s, i] = await Promise.all([
          userService.getGroups(), userService.getRooms(),
          userService.getSubjects(), userService.getInstructors()
        ]);
        setData({ groups: g, rooms: r, subjects: s, instructors: i });
      } catch (e) { setError('Impossible de charger les données'); }
      finally { setLoading(false); }
    })();
  }, [initialData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try { await onSubmit(formData); }
    catch (e) { setError(e.response?.data?.message || 'Échec de l\'enregistrement'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
      <div style={{ width: 24, height: 24, border: '2.5px solid var(--accent-dim)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: '_oSpin 0.65s linear infinite' }} />
      <style>{`@keyframes _oSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'Sora', sans-serif" }}>
      {error && (
        <div style={{ padding: '9px 13px', borderRadius: 10, background: 'var(--red-dim)', border: '1px solid rgba(200,16,46,0.22)', fontSize: 13, color: 'var(--red-text)' }}>
          {error}
        </div>
      )}

      <div style={gridRow}>
        <div>
          <label style={labelSt}>Jour</label>
          <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} className="input-field">
            <option value="1">Lundi</option>
            <option value="2">Mardi</option>
            <option value="3">Mercredi</option>
            <option value="4">Jeudi</option>
            <option value="5">Vendredi</option>
            <option value="6">Samedi</option>
            <option value="7">Dimanche</option>
          </select>
        </div>
        <div>
          <label style={labelSt}>Salle</label>
          <select name="room_id" value={formData.room_id} onChange={handleChange} required className="input-field">
            <option value="">Choisir une salle</option>
            {data.rooms.map(r => <option key={r.id} value={r.id}>{r.name}{r.capacity ? ` (${r.capacity})` : ''}</option>)}
          </select>
        </div>
      </div>

      <div style={gridRow}>
        <div>
          <label style={labelSt}>Heure de début</label>
          <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required className="input-field" />
        </div>
        <div>
          <label style={labelSt}>Heure de fin</label>
          <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required className="input-field" />
        </div>
      </div>

      <div style={gridRow}>
        <div>
          <label style={labelSt}>Module</label>
          <select name="subject_id" value={formData.subject_id} onChange={handleChange} required className="input-field">
            <option value="">Choisir un module</option>
            {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
          </select>
        </div>
        <div>
          <label style={labelSt}>Groupe</label>
          <select name="group_id" value={formData.group_id} onChange={handleChange} required className="input-field">
            <option value="">Choisir un groupe</option>
            {data.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={labelSt}>Formateur</label>
        <select name="instructor_id" value={formData.instructor_id} onChange={handleChange} required className="input-field">
          <option value="">Choisir un formateur</option>
          {data.instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>

      <div>
        <label style={labelSt}>Statut</label>
        <select name="status" value={formData.status} onChange={handleChange} className="input-field">
          <option value="active">Actif</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      <div>
        <label style={labelSt}>Notes (optionnel)</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} className="input-field" style={{ height: 72, resize: 'none' }} placeholder="Notes supplémentaires..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)', marginTop: 2 }}>
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" className="btn-primary">Enregistrer</button>
      </div>
    </form>
  );
}
