import { useState, useEffect } from 'react';
import timetableService from '../../services/timetableService';
import TimetableTable from '../../components/timetable/TimetableTable';
import FiltersBar from '../../components/timetable/FiltersBar';
import SessionForm from '../../components/timetable/SessionForm';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

export default function ManageTimetablePage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const data = await timetableService.getAll(filters);
            setSessions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSessions(); }, [filters]);

    const handleCreate = () => { setEditingSession(null); setIsModalOpen(true); };
    const handleEdit = (session) => { setEditingSession(session); setIsModalOpen(true); };

    const handleSubmit = async (formData) => {
        if (editingSession) {
            await timetableService.update(editingSession.id, formData);
        } else {
            await timetableService.create(formData);
        }
        setIsModalOpen(false);
        loadSessions();
    };

    const handleDelete = async () => {
        if (!editingSession) return;
        if (window.confirm('Are you sure you want to delete this session?')) {
            await timetableService.delete(editingSession.id);
            setIsModalOpen(false);
            loadSessions();
        }
    };

    return (
        <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Timetable</h1>
                    <p className="text-sm text-gray-500 mt-1">{sessions.length} sessions scheduled</p>
                </div>
                <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Session
                </button>
            </div>

            <FiltersBar filters={filters} onFilterChange={setFilters} />

            {loading ? <Loader /> : (
                <TimetableTable sessions={sessions} onSessionClick={handleEdit} role="admin" />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSession?.id ? 'Edit Session' : 'New Session'}
            >
                <SessionForm
                    initialData={editingSession}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />

                {editingSession?.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                        <button onClick={handleDelete} className="btn-ghost text-red-500 hover:text-red-700 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Delete Session
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
