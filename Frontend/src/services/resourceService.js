import apiClient from './apiClient';

export default {
    // Groups
    getGroups: async () => { const res = await apiClient.get('/resources/groups'); return res.data; },
    createGroup: async (name) => { const res = await apiClient.post('/resources/groups', { name }); return res.data; },
    deleteGroup: async (id) => { await apiClient.delete(`/resources/groups/${id}`); },

    // Rooms
    getRooms: async () => { const res = await apiClient.get('/resources/rooms'); return res.data; },
    createRoom: async (name, capacity) => { const res = await apiClient.post('/resources/rooms', { name, capacity }); return res.data; },
    deleteRoom: async (id) => { await apiClient.delete(`/resources/rooms/${id}`); },

    // Subjects
    getSubjects: async () => { const res = await apiClient.get('/resources/subjects'); return res.data; },
    createSubject: async (name, code) => { const res = await apiClient.post('/resources/subjects', { name, code }); return res.data; },
    deleteSubject: async (id) => { await apiClient.delete(`/resources/subjects/${id}`); },
};
