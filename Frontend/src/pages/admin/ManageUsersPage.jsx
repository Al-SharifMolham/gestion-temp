import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

const USER_ROLES = ['admin', 'instructor', 'student'];

const roleBadge = (role) => {
    const styles = {
        admin: 'badge-blue',
        instructor: 'badge-amber',
        student: 'badge-green',
    };
    return <span className={styles[role] || 'badge-gray'}>{role}</span>;
};

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', group_id: '' });
    const [error, setError] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [uData, gData] = await Promise.all([
                userService.getAllUsers(),
                userService.getGroups()
            ]);
            setUsers(uData);
            setGroups(gData);
        } catch (err) {
            console.error('Failed to load data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'student', group_id: '' });
        setError('');
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role, group_id: user.group_id || '' });
        setError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                loadData();
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const validateForm = () => {
        if (!formData.email.includes('@')) return 'Invalid email address';
        if (!editingUser && formData.password.length < 6) return 'Password must be at least 6 characters';
        if (formData.password && formData.password.length < 6) return 'Password must be at least 6 characters';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const validationError = validateForm();
        if (validationError) { setError(validationError); return; }

        try {
            if (editingUser) {
                const payload = { ...formData };
                if (!payload.password) delete payload.password;
                await userService.updateUser(editingUser.id, payload);
            } else {
                await userService.createUser(formData);
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save user');
        }
    };

    return (
        <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users</h1>
                    <p className="text-sm text-gray-500 mt-1">{users.length} total users</p>
                </div>
                <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New User
                </button>
            </div>

            {loading ? <Loader /> : (
                <div className="bg-white rounded-xl shadow-card border border-gray-100/80 overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Group</th>
                                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{roleBadge(user.role)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.group_name || <span className="text-gray-300">—</span>}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button onClick={() => handleEdit(user)} className="btn-ghost text-indigo-600 hover:text-indigo-800 mr-1">Edit</button>
                                        <button onClick={() => handleDelete(user.id)} className="btn-ghost text-red-500 hover:text-red-700">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <p className="text-sm text-gray-400">No users found</p>
                                        <button onClick={handleCreate} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-1">Create one</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'New User'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</div>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
                        <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                        <input type="email" className="input-field" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            Password {editingUser && <span className="text-gray-400 font-normal">(leave blank to keep)</span>}
                        </label>
                        <input type="password" className="input-field" placeholder={editingUser ? '••••••' : 'Min 6 characters'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Role</label>
                            <select className="input-field capitalize" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        {formData.role === 'student' && (
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Group</label>
                                <select className="input-field" value={formData.group_id} onChange={e => setFormData({ ...formData, group_id: e.target.value })}>
                                    <option value="">Select Group</option>
                                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{editingUser ? 'Save Changes' : 'Create User'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
