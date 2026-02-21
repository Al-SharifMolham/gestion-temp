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
            // Backend filters by group_id for student
            const data = await timetableService.getAll({ group_id: user.group_id });
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
        setSelectedSession(session);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Group Timetable</h1>

            {loading ? <Loader /> : (
                sessions.length > 0 ? (
                    <TimetableTable
                        sessions={sessions}
                        onSessionClick={handleSessionClick}
                        role="student"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No sessions scheduled for your group yet.</p>
                    </div>
                )
            )}

            <Modal
                isOpen={!!selectedSession}
                onClose={() => setSelectedSession(null)}
                title="Session Details"
            >
                <div className="space-y-4 text-left">
                    {selectedSession && (
                        <>
                            <div><span className="font-bold">Subject:</span> {selectedSession.subject_name}</div>
                            <div><span className="font-bold">Room:</span> {selectedSession.room_name}</div>
                            <div><span className="font-bold">Instructor:</span> {selectedSession.instructor_name}</div>
                            <div><span className="font-bold">Time:</span> {selectedSession.start_time.substring(0, 5)} - {selectedSession.end_time.substring(0, 5)}</div>
                            {selectedSession.notes && (
                                <div className="bg-yellow-50 p-3 rounded text-sm border border-yellow-100">
                                    <span className="font-bold block mb-1">Notes:</span>
                                    {selectedSession.notes}
                                </div>
                            )}
                            <div className="pt-4 flex justify-end">
                                <button onClick={() => setSelectedSession(null)} className="btn-secondary text-sm">Close</button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
