const AuthService = require('../services/authService');

class AuthController {
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