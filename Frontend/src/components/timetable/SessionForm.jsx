import { useState, useEffect } from 'react';
import userService from '../../services/userService';

// Helper to generate time slots
const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i <= 20; i++) {
        slots.push(`${i.toString().padStart(2, '0')}:00`);
        slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots;
};

export default function SessionForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        day_of_week: '1',
        start_time: '08:00',
        end_time: '09:00',
        room_id: '',
        group_id: '',
        instructor_id: '',
        subject_id: '',
        status: 'active',
        notes: ''
    });
    const [data, setData] = useState({ groups: [], rooms: [], subjects: [], instructors: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                start_time: initialData.start_time?.substring(0, 5), // Fix MySQL time format
                end_time: initialData.end_time?.substring(0, 5)
            }));
        }

        const loadResources = async () => {
            try {
                const [g, r, s, i] = await Promise.all([
                    userService.getGroups(),
                    userService.getRooms(),
                    userService.getSubjects(),
                    userService.getInstructors()
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
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save session');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Day</label>
                    <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} className="input-field text-sm">
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
                    <label className="block text-xs font-medium text-gray-700">Room</label>
                    <select name="room_id" value={formData.room_id} onChange={handleChange} required className="input-field text-sm">
                        <option value="">Select Room</option>
                        {data.rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.capacity})</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Start Time</label>
                    <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required className="input-field text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700">End Time</label>
                    <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required className="input-field text-sm" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700">Subject</label>
                    <select name="subject_id" value={formData.subject_id} onChange={handleChange} required className="input-field text-sm">
                        <option value="">Select Subject</option>
                        {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700">Group</label>
                    <select name="group_id" value={formData.group_id} onChange={handleChange} required className="input-field text-sm">
                        <option value="">Select Group</option>
                        {data.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700">Instructor</label>
                <select name="instructor_id" value={formData.instructor_id} onChange={handleChange} required className="input-field text-sm">
                    <option value="">Select Instructor</option>
                    {data.instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="input-field text-sm h-20" placeholder="Optional notes..."></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm">Save Session</button>
            </div>
        </form>
    );
}
