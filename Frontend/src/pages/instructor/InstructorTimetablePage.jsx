import { useState, useEffect } from 'react';
import timetableService from '../../services/timetableService';
import TimetableTable from '../../components/timetable/TimetableTable';
import FiltersBar from '../../components/timetable/FiltersBar'; // Can reuse filters if needed
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';

export default function InstructorTimetablePage() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [note, setNote] = useState('');

    const loadSessions = async () => {
        setLoading(true);
        try {
            // Backend middleware enforces filtering by instructor_id automatically if role is instructor?
            // Yes, user plan. But we can pass params too.
            // Let's pass instructor_id just in case or trust backend.
            const data = await timetableService.getAll({ instructor_id: user.id });
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleSessionClick = (session) => {
        // Instructor can only edit Notes.
        if (session.instructor_id !== user.id) return; // Should not happen with filtering
        setEditingSession(session);
        setNote(session.notes || '');
        setIsModalOpen(true);
    };

    const handleSaveNote = async () => {
        try {
            await timetableService.patchDetails(editingSession.id, { notes: note });
            setIsModalOpen(false);
            loadSessions();
        } catch (err) {
            alert('Failed to update note');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Schedule</h1>

            {/* Instructor might use filters if they have lots of sessions? 
                Probably not needed for MVP. */}

            {loading ? <Loader /> : (
                sessions.length > 0 ? (
                    <TimetableTable
                        sessions={sessions}
                        onSessionClick={handleSessionClick}
                        role="instructor"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No sessions assigned to you.</p>
                    </div>
                )
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Update Session Notes"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        {editingSession?.subject_name} - {editingSession?.dates}
                    </p>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Notes (Public)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="input-field h-32"
                            placeholder="Add notes for students..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-sm">Cancel</button>
                        <button onClick={handleSaveNote} className="btn-primary text-sm">Save Notes</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
