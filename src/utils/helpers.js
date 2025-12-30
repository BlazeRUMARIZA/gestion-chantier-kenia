export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('fr-FR');
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const calculateDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getStatusColor = (status) => {
  const colors = {
    'planifié': '#6c757d',
    'en_cours': '#007bff',
    'suspendu': '#ffc107',
    'terminé': '#28a745',
    'annulé': '#dc3545',
  };
  return colors[status] || '#6c757d';
};

export const getStatusLabel = (status) => {
  const labels = {
    'planifié': 'Planifié',
    'en_cours': 'En cours',
    'suspendu': 'Suspendu',
    'terminé': 'Terminé',
    'annulé': 'Annulé',
  };
  return labels[status] || status;
};

export const getPriorityColor = (priority) => {
  const colors = {
    'faible': '#28a745',
    'moyenne': '#ffc107',
    'haute': '#fd7e14',
    'critique': '#dc3545',
  };
  return colors[priority] || '#6c757d';
};

export const getPriorityLabel = (priority) => {
  const labels = {
    'faible': 'Faible',
    'moyenne': 'Moyenne',
    'haute': 'Haute',
    'critique': 'Critique',
  };
  return labels[priority] || priority;
};

export const getRoleLabel = (role) => {
  const labels = {
    'admin': 'Administrateur',
    'chef': 'Chef de chantier',
    'ouvrier': 'Ouvrier',
  };
  return labels[role] || role;
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    return error.response.data?.message || 'Une erreur est survenue';
  } else if (error.request) {
    // Pas de réponse du serveur
    return 'Impossible de contacter le serveur';
  } else {
    // Erreur de configuration
    return error.message || 'Une erreur est survenue';
  }
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/;
  return !phone || re.test(phone);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
