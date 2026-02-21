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

    useEffect(() => {
        loadSessions();
    }, [filters]);

    const handleCreate = () => {
        setEditingSession(null);
        setIsModalOpen(true);
    };

    const handleEdit = (session) => {
        setEditingSession(session);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        if (editingSession) {
            await timetableService.update(editingSession.id, formData);
        } else {
            await timetableService.create(formData);
        }
        setIsModalOpen(false);
        loadSessions(); // Refresh
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Timetable</h1>
                <button onClick={handleCreate} className="btn-primary">
                    + New Session
                </button>
            </div>

            <FiltersBar filters={filters} onFilterChange={setFilters} />

            {loading ? <Loader /> : (
                <TimetableTable
                    sessions={sessions}
                    onSessionClick={handleEdit}
                    role="admin"
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSession ? (editingSession.id ? 'Edit Session' : 'New Session') : 'New Session'}
            >
                <div className="mt-4">
                    <SessionForm
                        initialData={editingSession}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsModalOpen(false)}
                    />

                    {editingSession && editingSession.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                            <span className="text-xs text-gray-400">ID: {editingSession.id}</span>
                            <button
                                onClick={handleDelete}
                                className="text-red-600 text-sm hover:underline"
                            >
                                Delete Session
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
