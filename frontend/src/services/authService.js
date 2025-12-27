import api from './api';

export const authService = {
  // Connexion
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    // Le backend renvoie { success, message, data: { token, user } }
    const { data } = response.data;
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    throw new Error('Format de réponse invalide');
  },

  // Déconnexion
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Obtenir le profil utilisateur
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    // Le backend renvoie { success, message, data: {...user} }
    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Obtenir l'utilisateur actuel depuis le localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Vérifier le rôle de l'utilisateur
  hasRole: (roles) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
  },
};

export default authService;
