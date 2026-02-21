import apiClient from './apiClient';

export default {
    getAll: async (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const response = await apiClient.get(`/sessions?${query}`);
        return response.data;
    },
    create: async (sessionData) => {
        const response = await apiClient.post('/sessions', sessionData);
        return response.data;
    },
    update: async (id, sessionData) => {
        const response = await apiClient.put(`/sessions/${id}`, sessionData);
        return response.data;
    },
    patchDetails: async (id, updates) => {
        const response = await apiClient.patch(`/sessions/${id}/details`, updates);
        return response.data;
    },
    delete: async (id) => {
        await apiClient.delete(`/sessions/${id}`);
    }
};
