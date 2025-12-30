import api from './api';

export const affectationService = {
  // Obtenir toutes les affectations
  getAllAffectations: async (params) => {
    const response = await api.get('/affectations', { params });
    return response.data;
  },

  // Créer une nouvelle affectation (admin/chef)
  createAffectation: async (affectationData) => {
    const response = await api.post('/affectations', affectationData);
    return response.data;
  },

  // Mettre à jour une affectation (admin/chef)
  updateAffectation: async (id, affectationData) => {
    const response = await api.put(`/affectations/${id}`, affectationData);
    return response.data;
  },

  // Supprimer une affectation (admin/chef)
  deleteAffectation: async (id) => {
    const response = await api.delete(`/affectations/${id}`);
    return response.data;
  },

  // Obtenir les ouvriers disponibles
  getOuvriersDisponibles: async (params) => {
    const response = await api.get('/affectations/ouvriers-disponibles', { params });
    return response.data;
  },
};

export default affectationService;
