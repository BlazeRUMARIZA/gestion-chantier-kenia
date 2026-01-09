const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res) {
    try {
      const { nom, email, password, role, telephone } = req.body;
      
      // Validation
      if (!nom || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nom, email et mot de passe sont requis'
        });
      }
      
      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email invalide'
        });
      }
      
      // Validation du mot de passe (minimum 6 caractères)
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères'
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      
      const result = await AuthService.register(
        { nom, email, password, role, telephone },
        ipAddress,
        userAgent
      );
      
      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: result
      });
    } catch (error) {
      console.error('Erreur register:', error.message);
      res.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de l\'inscription'
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validation basique
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe sont requis'
        });
      }
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      
      const result = await AuthService.login(email, password, ipAddress, userAgent);
      
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: result
      });
    } catch (error) {
      console.error('Erreur login:', error.message);
      res.status(401).json({
        success: false,
        message: error.message || 'Identifiants invalides'
      });
    }
  }
  
  static async logout(req, res) {
    try {
      console.log('🔓 Tentative de déconnexion...');
      console.log('  req.user:', req.user ? `${req.user.id} - ${req.user.email}` : 'undefined');
      console.log('  req.token:', req.token ? req.token.substring(0, 20) + '...' : 'undefined');
      
      // Vérifier que l'utilisateur est authentifié
      if (!req.user || !req.token) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }
      
      const result = await AuthService.logout(req.user.id, req.token);
      
      res.json({
        success: true,
        message: 'Déconnexion réussie',
        data: result
      });
    } catch (error) {
      console.error('❌ Erreur logout:', error.message);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la déconnexion',
        error: error.message
      });
    }
  }
  
  static async getProfile(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }
      
      res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  }
}

module.exports = AuthController;