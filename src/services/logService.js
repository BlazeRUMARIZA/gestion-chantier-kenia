import api from './api';

export const logService = {
  // Obtenir tous les logs (admin)
  getAllLogs: async (params) => {
    const response = await api.get('/logs', { params });
    return response.data;
  },

  // Obtenir l'historique des connexions (admin)
  getLoginHistory: async (params) => {
    const response = await api.get('/logs/connexions', { params });
    return response.data;
  },
};

export default logService;
