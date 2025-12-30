import api from './api';

export const userService = {
  // Obtenir tous les utilisateurs (admin)
  getAllUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Obtenir un utilisateur par ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Créer un nouvel utilisateur (admin)
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur (admin)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Obtenir les statistiques des utilisateurs (admin)
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

export default userService;
