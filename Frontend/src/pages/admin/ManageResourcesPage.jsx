import { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';
import Loader from '../../components/ui/Loader';

const TABS = [
    { key: 'groups', label: 'Groups' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'subjects', label: 'Subjects' },
];

export default function ManageResourcesPage() {
    const [activeTab, setActiveTab] = useState('groups');
    const [data, setData] = useState({ groups: [], rooms: [], subjects: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [groupName, setGroupName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [roomCapacity, setRoomCapacity] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [groups, rooms, subjects] = await Promise.all([
                resourceService.getGroups(),
                resourceService.getRooms(),
                resourceService.getSubjects(),
            ]);
            setData({ groups, rooms, subjects });
        } catch (err) {
            console.error('Failed to load resources', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAddGroup = async (e) => {
        e.preventDefault(); setError('');
        if (!groupName.trim()) return;
        try { await resourceService.createGroup(groupName.trim()); setGroupName(''); loadData(); }
        catch (err) { setError(err.response?.data?.message || 'Failed to create group'); }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault(); setError('');
        if (!roomName.trim()) return;
        try { await resourceService.createRoom(roomName.trim(), roomCapacity ? Number(roomCapacity) : null); setRoomName(''); setRoomCapacity(''); loadData(); }
        catch (err) { setError(err.response?.data?.message || 'Failed to create room'); }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault(); setError('');
        if (!subjectName.trim() || !subjectCode.trim()) return;
        try { await resourceService.createSubject(subjectName.trim(), subjectCode.trim()); setSubjectName(''); setSubjectCode(''); loadData(); }
        catch (err) { setError(err.response?.data?.message || 'Failed to create subject'); }
    };

    const handleDelete = async (type, id, name) => {
        if (!window.confirm(`Delete "${name}"? This may affect related sessions and users.`)) return;
        try {
            if (type === 'groups') await resourceService.deleteGroup(id);
            else if (type === 'rooms') await resourceService.deleteRoom(id);
            else if (type === 'subjects') await resourceService.deleteSubject(id);
            loadData();
        } catch (err) { alert('Failed to delete. It may be in use.'); }
    };

    if (loading) return <Loader />;

    return (
        <div className="animate-slide-up">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resources</h1>
                <p className="text-sm text-gray-500 mt-1">Manage groups, rooms, and subjects</p>
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-lg border border-red-100 mb-5">{error}</div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setActiveTab(tab.key); setError(''); }}
                        className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                            activeTab === tab.key
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                            activeTab === tab.key ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {data[tab.key].length}
                        </span>
                    </button>
                ))}
            </div>

            {activeTab === 'groups' && (
                <div>
                    <form onSubmit={handleAddGroup} className="flex gap-3 mb-5">
                        <input type="text" className="input-field flex-1" placeholder="Group name (e.g. TDI-201)" value={groupName} onChange={e => setGroupName(e.target.value)} required />
                        <button type="submit" className="btn-primary flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Add
                        </button>
                    </form>
                    <ResourceTable items={data.groups} columns={[{ key: 'name', label: 'Name' }]} onDelete={(id, item) => handleDelete('groups', id, item.name)} />
                </div>
            )}

            {activeTab === 'rooms' && (
                <div>
                    <form onSubmit={handleAddRoom} className="flex gap-3 mb-5">
                        <input type="text" className="input-field flex-1" placeholder="Room name (e.g. Salle A1)" value={roomName} onChange={e => setRoomName(e.target.value)} required />
                        <input type="number" className="input-field w-32" placeholder="Capacity" value={roomCapacity} onChange={e => setRoomCapacity(e.target.value)} />
                        <button type="submit" className="btn-primary flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Add
                        </button>
                    </form>
                    <ResourceTable items={data.rooms} columns={[{ key: 'name', label: 'Name' }, { key: 'capacity', label: 'Capacity', fallback: '—' }]} onDelete={(id, item) => handleDelete('rooms', id, item.name)} />
                </div>
            )}

            {activeTab === 'subjects' && (
                <div>
                    <form onSubmit={handleAddSubject} className="flex gap-3 mb-5">
                        <input type="text" className="input-field flex-1" placeholder="Subject name (e.g. Mathematics)" value={subjectName} onChange={e => setSubjectName(e.target.value)} required />
                        <input type="text" className="input-field w-36" placeholder="Code (e.g. MATH)" value={subjectCode} onChange={e => setSubjectCode(e.target.value)} required />
                        <button type="submit" className="btn-primary flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Add
                        </button>
                    </form>
                    <ResourceTable items={data.subjects} columns={[{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }]} onDelete={(id, item) => handleDelete('subjects', id, item.name)} />
                </div>
            )}
        </div>
    );
}

function ResourceTable({ items, columns, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow-card border border-gray-100/80 overflow-hidden">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        {columns.map(col => (
                            <th key={col.key} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col.label}</th>
                        ))}
                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {items.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            {columns.map(col => (
                                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {item[col.key] ?? <span className="text-gray-300">{col.fallback ?? ''}</span>}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button onClick={() => onDelete(item.id, item)} className="btn-ghost text-red-500 hover:text-red-700">Delete</button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-sm text-gray-400">
                                No items yet
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
