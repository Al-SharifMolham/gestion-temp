import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

const USER_ROLES = ['admin', 'instructor', 'student'];

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

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'student', group_id: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            group_id: user.group_id || ''
        });
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
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            if (editingUser) {
                // Update
                const payload = { ...formData };
                if (!payload.password) delete payload.password;
                await userService.updateUser(editingUser.id, payload);
            } else {
                // Create
                await userService.createUser(formData);
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save user');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
                <button onClick={handleCreate} className="btn-primary">+ New User</button>
            </div>

            {loading ? <Loader /> : (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.group_name || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'Edit User' : 'New User'}
            >
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Name</label>
                        <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Email</label>
                        <input type="email" className="input-field" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Password <span className="text-gray-400 font-normal">{editingUser ? '(Leave blank to keep)' : '(Min 6 chars)'}</span></label>
                        <input type="password" className="input-field" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Role</label>
                            <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        {formData.role === 'student' && (
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Group</label>
                                <select className="input-field" value={formData.group_id} onChange={e => setFormData({ ...formData, group_id: e.target.value })}>
                                    <option value="">Select Group</option>
                                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-sm">Cancel</button>
                        <button type="submit" className="btn-primary text-sm">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
