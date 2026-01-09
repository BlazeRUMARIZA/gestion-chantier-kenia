const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');

class AuthService {
  static async register(userData, ipAddress, userAgent) {
    const { nom, email, password, role, telephone } = userData;
    
    console.log('📝 Registration attempt:', { nom, email, role, telephone });
    console.log('🔑 Password received:', password);
    
    // Vérifier si l'email existe déjà
    const existingUser = await db.User.findOne({ where: { email } });
    
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    // Hasher le mot de passe
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed:', hashedPassword.substring(0, 30) + '...');
    
    // Créer l'utilisateur
    const user = await db.User.create({
      nom,
      email,
      password: hashedPassword,
      role: role || 'ouvrier',
      telephone,
      actif: true
    });
    
    // Créer le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom
      },
      process.env.JWT_SECRET || 'default_secret_for_demo',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    
    // Enregistrer le log d'inscription
    try {
      await db.Log.create({
        action: `Inscription - ${user.role}`,
        niveau: 'info',
        user_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        details: JSON.stringify({ email: user.email, role: user.role }),
        endpoint: '/api/auth/register',
        method: 'POST'
      });
    } catch (logError) {
      console.error('Erreur lors de l\'enregistrement du log:', logError);
    }
    
    // Retourner les données (sans le password)
    return {
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        actif: user.actif,
        created_at: user.created_at
      }
    };
  }

  static async login(email, password, ipAddress, userAgent) {
    // Chercher l'utilisateur
    console.log('🔍 Login attempt for email:', email);
    const user = await db.User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ User not found:', email);
      throw new Error('Email ou mot de passe incorrect');
    }
    
    console.log('✅ User found:', { id: user.id, email: user.email, actif: user.actif });
    console.log('🔐 Password hash from DB:', user.password.substring(0, 30) + '...');
    console.log('🔑 Password received:', password);
    
    // Vérifier si le compte est actif
    if (!user.actif) {
      console.log('❌ Account inactive');
      throw new Error('Compte désactivé. Contactez l\'administrateur');
    }
    
    // Comparer le mot de passe avec bcrypt
    console.log('🔍 Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password valid?', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password mismatch for user:', email);
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Mettre à jour la dernière connexion
    user.derniere_connexion = new Date();
    await user.save();
    
    // Créer le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom
      },
      process.env.JWT_SECRET || 'default_secret_for_demo',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    
    // Enregistrer le log de connexion
    try {
      await db.Log.create({
        action: `Connexion - ${user.role}`,
        niveau: 'info',
        user_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        details: JSON.stringify({ email: user.email, role: user.role }),
        endpoint: '/api/auth/login',
        method: 'POST'
      });
    } catch (logError) {
      console.error('Erreur lors de l\'enregistrement du log:', logError);
      // Ne pas bloquer la connexion si le log échoue
    }
    
    // Retourner les données
    return {
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        derniere_connexion: user.derniere_connexion,
        created_at: user.created_at
      }
    };
  }
  
  static async logout(userId, token) {
    try {
      await db.Log.create({
        action: 'Déconnexion',
        niveau: 'info',
        user_id: userId,
        details: JSON.stringify({ action: 'logout' })
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log de déconnexion:', error);
    }
    
    return { 
      success: true, 
      message: 'Déconnexion réussie' 
    };
  }
}

module.exports = AuthService;