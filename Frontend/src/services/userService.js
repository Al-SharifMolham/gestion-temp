import apiClient from './apiClient';

export default {
    getAllUsers: async () => {
        const response = await apiClient.get('/users');
        return response.data;
    },
    // Add other methods if needed for ManageUsersPage later
    getInstructors: async () => {
        // Optimally backend should filter, but for now filtering client side or if /users returns everything
        // Assuming admin can see all users.
        const users = (await apiClient.get('/users')).data;
        return users.filter(u => u.role === 'instructor');
    },

    // User CRUD
    createUser: async (userData) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    },
    updateUser: async (id, userData) => {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    },

    // Resource helpers (Groups, Rooms, Subjects)
    getGroups: async () => { const res = await apiClient.get('/resources/groups'); return res.data; },
    getRooms: async () => { const res = await apiClient.get('/resources/rooms'); return res.data; },
    getSubjects: async () => { const res = await apiClient.get('/resources/subjects'); return res.data; }
};
