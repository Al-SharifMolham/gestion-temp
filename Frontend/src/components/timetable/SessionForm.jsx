import { useState, useEffect } from 'react';
import userService from '../../services/userService';

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
                end_time: initialData.end_time?.substring(0, 5)
            }));
        }

        const loadResources = async () => {
            try {
                const [g, r, s, i] = await Promise.all([
                    userService.getGroups(), userService.getRooms(),
                    userService.getSubjects(), userService.getInstructors()
                ]);
                setData({ groups: g, rooms: r, subjects: s, instructors: i });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load form data');
            }
        };
        loadResources();
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try { await onSubmit(formData); }
        catch (err) { setError(err.response?.data?.message || 'Failed to save session'); }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</div>}

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Day</label>
                    <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} className="input-field">
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                        <option value="7">Sunday</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Room</label>
                    <select name="room_id" value={formData.room_id} onChange={handleChange} required className="input-field">
                        <option value="">Select Room</option>
                        {data.rooms.map(r => <option key={r.id} value={r.id}>{r.name}{r.capacity ? ` (${r.capacity})` : ''}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Start Time</label>
                    <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">End Time</label>
                    <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required className="input-field" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject</label>
                    <select name="subject_id" value={formData.subject_id} onChange={handleChange} required className="input-field">
                        <option value="">Select Subject</option>
                        {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Group</label>
                    <select name="group_id" value={formData.group_id} onChange={handleChange} required className="input-field">
                        <option value="">Select Group</option>
                        {data.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Instructor</label>
                <select name="instructor_id" value={formData.instructor_id} onChange={handleChange} required className="input-field">
                    <option value="">Select Instructor</option>
                    {data.instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="input-field h-20 resize-none" placeholder="Optional notes..."></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Session</button>
            </div>
        </form>
    );
}
