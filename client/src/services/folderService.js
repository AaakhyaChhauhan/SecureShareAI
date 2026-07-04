import api from './api';

export const folderService = {
  createFolder: async (name) => {
    const response = await api.post('/folders', { name });
    return response.data;
  },

  getFolders: async () => {
    const response = await api.get('/folders');
    return response.data;
  },

  renameFolder: async (id, name) => {
    const response = await api.put(`/folders/${id}`, { name });
    return response.data;
  },

  deleteFolder: async (id) => {
    const response = await api.delete(`/folders/${id}`);
    return response.data;
  },
};
