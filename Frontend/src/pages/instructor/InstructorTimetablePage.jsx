import { useState, useEffect } from 'react';
import timetableService from '../../services/timetableService';
import TimetableTable from '../../components/timetable/TimetableTable';
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
            const data = await timetableService.getAll({ instructor_id: user.id });
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSessions(); }, []);

    const handleSessionClick = (session) => {
        if (session.instructor_id !== user.id) return;
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
        <div className="animate-slide-up">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Schedule</h1>
                <p className="text-sm text-gray-500 mt-1">Your assigned sessions this week</p>
            </div>

            {loading ? <Loader /> : (
                sessions.length > 0 ? (
                    <TimetableTable sessions={sessions} onSessionClick={handleSessionClick} role="instructor" />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-card">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <p className="text-gray-500 font-medium">No sessions assigned</p>
                        <p className="text-sm text-gray-400 mt-1">You don't have any scheduled sessions yet</p>
                    </div>
                )
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Session Notes">
                <div className="space-y-4">
                    {editingSession && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                            {editingSession.subject_name}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes (visible to students)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="input-field h-32 resize-none"
                            placeholder="Add notes for students..."
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button onClick={handleSaveNote} className="btn-primary">Save Notes</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
