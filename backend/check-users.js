require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/models');

async function checkUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs...\n');
    
    const users = await db.User.findAll();
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données');
      console.log('💡 Vous devez créer un utilisateur avec POST /api/auth/register\n');
      return;
    }
    
    console.log(`✅ ${users.length} utilisateur(s) trouvé(s):\n`);
    
    for (const user of users) {
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Nom: ${user.nom}`);
      console.log(`🎭 Rôle: ${user.role}`);
      console.log(`🔒 Password hash: ${user.password.substring(0, 20)}...`);
      console.log(`✅ Actif: ${user.actif}`);
      console.log(`📅 Créé: ${user.created_at}`);
      
      // Vérifier si le mot de passe est hashé avec bcrypt
      const isBcryptHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
      console.log(`🔐 Hash bcrypt valide: ${isBcryptHash ? '✅ Oui' : '❌ Non'}`);
      
      console.log('---\n');
    }
    
    // Test de connexion avec un mot de passe
    console.log('🧪 Test de validation de mot de passe:');
    console.log('Pour tester la connexion, utilisez:');
    console.log('POST /api/auth/login');
    console.log('Body: { "email": "<email_ci_dessus>", "password": "<votre_mot_de_passe>" }\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error);
  } finally {
    await db.sequelize.close();
  }
}

checkUsers();
