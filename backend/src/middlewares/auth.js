const jwt = require('jsonwebtoken');
const db = require('../models');

const auth = async (req, res, next) => {
  try {
    // Récupérer le token
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token manquant ou format invalide');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Token manquant');
    }

    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_for_demo');
    
    // Chercher l'utilisateur
    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    if (!user.actif) {
      throw new Error('Compte désactivé');
    }

    // Ajouter les informations à la requête
    req.user = user;
    req.token = token;
    
    console.log(`🔐 Authentification réussie: ${user.email} (${user.role})`);
    
    next();
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.message);
    
    // Si c'est une erreur JWT, donner un message plus clair
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token JWT invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Veuillez vous authentifier',
      error: error.message
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error('❌ authorize: req.user est undefined');
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`❌ Accès refusé: ${req.user.role} n'est pas dans ${roles}`);
      return res.status(403).json({
        success: false,
        message: `Accès non autorisé. Rôle requis: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { auth, authorize };