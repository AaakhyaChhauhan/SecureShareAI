import api from './api';

export const fileService = {
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return data;
  },

  getFiles: async (page = 1, limit = 20, folderId = null) => {
    let url = `/files?page=${page}&limit=${limit}`;
    if (folderId !== null) {
      url += `&folderId=${folderId}`;
    }
    const { data } = await api.get(url);
    return data;
  },

  updateFile: async (id, updateData) => {
    const { data } = await api.put(`/files/${id}`, updateData);
    return data;
  },

  getFileById: async (id) => {
    const { data } = await api.get(`/files/${id}`);
    return data;
  },

  deleteFile: async (id) => {
    const { data } = await api.delete(`/files/${id}`);
    return data;
  },

  getDashboardStats: async () => {
    const { data } = await api.get('/files/stats/dashboard');
    return data;
  },

  createShareLink: async (fileId, options) => {
    const { data } = await api.post(`/share/${fileId}`, options);
    return data;
  },

  getSharedFile: async (shareCode) => {
    const { data } = await api.get(`/share/${shareCode}`);
    return data;
  },

  verifyPassword: async (shareCode, password) => {
    const { data } = await api.post(`/share/${shareCode}/verify`, { password });
    return data;
  },

  downloadSharedFile: async (shareCode, password = null) => {
    const response = await api.post(`/download/${shareCode}`, { password }, {
      responseType: 'blob',
    });
    return response;
  },

  getAnalytics: async (fileId) => {
    const { data } = await api.get(`/files/${fileId}/analytics`);
    return data;
  },

  removeShareLink: async (fileId) => {
    const { data } = await api.delete(`/share/${fileId}`);
    return data;
  },
};
