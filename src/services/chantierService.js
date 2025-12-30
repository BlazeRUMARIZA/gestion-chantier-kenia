import api from './api';

export const chantierService = {
  // Obtenir tous les chantiers
  getAllChantiers: async (params) => {
    const response = await api.get('/chantiers', { params });
    return response.data;
  },

  // Obtenir un chantier par ID
  getChantierById: async (id) => {
    const response = await api.get(`/chantiers/${id}`);
    return response.data;
  },

  // Créer un nouveau chantier (admin/chef)
  createChantier: async (chantierData) => {
    const response = await api.post('/chantiers', chantierData);
    return response.data;
  },

  // Mettre à jour un chantier (admin/chef)
  updateChantier: async (id, chantierData) => {
    const response = await api.put(`/chantiers/${id}`, chantierData);
    return response.data;
  },

  // Supprimer un chantier (admin)
  deleteChantier: async (id) => {
    const response = await api.delete(`/chantiers/${id}`);
    return response.data;
  },

  // Obtenir les statistiques des chantiers (admin)
  getChantierStats: async () => {
    const response = await api.get('/chantiers/stats/dashboard');
    return response.data;
  },

  // Obtenir le planning des chantiers
  getPlanning: async (params) => {
    const response = await api.get('/chantiers/planning', { params });
    return response.data;
  },

  // Générer un rapport PDF
  generatePdfReport: async (id) => {
    const response = await api.get(`/chantiers/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default chantierService;
