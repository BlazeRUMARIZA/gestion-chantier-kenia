const mysql = require('mysql2/promise');
require('dotenv').config();

async function convertToPlainPasswords() {
  let connection;
  
  try {
    console.log('🔓 Conversion des mots de passe en clair...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gestion_chantiers'
    });
    
    // 1. Voir les utilisateurs actuels
    const [users] = await connection.query('SELECT id, email, password FROM users');
    
    console.log('📋 Utilisateurs trouvés:');
    users.forEach(user => {
      console.log(`  ${user.id}. ${user.email}`);
      console.log(`     Hash actuel: ${user.password.substring(0, 30)}...`);
    });
    
    // 2. Définir les mots de passe en clair
    const plainPasswords = {
      'admin@chantiers.com': 'password123',
      'chef.dupont@chantiers.com': 'password123',
      'ouvrier.martin@chantiers.com': 'password123',
      'ouvrier.durand@chantiers.com': 'password123'
    };
    
    // 3. Mettre à jour chaque utilisateur
    console.log('\n🔄 Mise à jour des mots de passe...');
    
    for (const user of users) {
      const plainPassword = plainPasswords[user.email] || 'password123';
      
      await connection.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [plainPassword, user.id]
      );
      
      console.log(`✅ ${user.email} → ${plainPassword}`);
    }
    
    // 4. Vérifier
    const [updatedUsers] = await connection.query(
      'SELECT email, password FROM users ORDER BY id'
    );
    
    console.log('\n📊 VÉRIFICATION FINALE:');
    console.log('=======================');
    updatedUsers.forEach(user => {
      console.log(`${user.email.padEnd(30)} : "${user.password}"`);
    });
    
    await connection.end();
    
    console.log('\n🎉 CONVERSION TERMINÉE !');
    console.log('\n⚠️  ATTENTION : Les mots de passe sont maintenant en CLAIR');
    console.log('   Cette configuration est pour la DÉMO seulement !');
    console.log('\n📋 Testez le login avec:');
    console.log('   admin@chantiers.com / password123');
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

// Exécuter
convertToPlainPasswords();