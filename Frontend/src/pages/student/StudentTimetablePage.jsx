import { useState, useEffect } from 'react';
import timetableService from '../../services/timetableService';
import TimetableTable from '../../components/timetable/TimetableTable';
import Loader from '../../components/ui/Loader';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';

export default function StudentTimetablePage() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const data = await timetableService.getAll({ group_id: user.group_id });
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSessions(); }, []);

    return (
        <div className="animate-slide-up">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Timetable</h1>
                <p className="text-sm text-gray-500 mt-1">Your group's weekly schedule</p>
            </div>

            {loading ? <Loader /> : (
                sessions.length > 0 ? (
                    <TimetableTable sessions={sessions} onSessionClick={setSelectedSession} role="student" />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-card">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <p className="text-gray-500 font-medium">No sessions scheduled</p>
                        <p className="text-sm text-gray-400 mt-1">Your group doesn't have any sessions yet</p>
                    </div>
                )
            )}

            <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Session Details">
                {selectedSession && (
                    <div className="space-y-3">
                        <DetailRow label="Subject" value={selectedSession.subject_name} />
                        <DetailRow label="Room" value={selectedSession.room_name} />
                        <DetailRow label="Instructor" value={selectedSession.instructor_name} />
                        <DetailRow label="Time" value={`${selectedSession.start_time?.substring(0, 5)} - ${selectedSession.end_time?.substring(0, 5)}`} />
                        {selectedSession.notes && (
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2">
                                <p className="text-xs font-medium text-amber-700 mb-1">Notes</p>
                                <p className="text-sm text-amber-900">{selectedSession.notes}</p>
                            </div>
                        )}
                        <div className="pt-3 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setSelectedSession(null)} className="btn-secondary">Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
    );
}
