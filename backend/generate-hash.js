// generate-hash.js
const bcrypt = require('bcryptjs');

async function generateHash() {
  try {
    console.log('🔐 Génération du hash bcrypt pour "password123"...\n');
    
    const hash = await bcrypt.hash('password123', 10);
    
    console.log('✅ HASH GÉNÉRÉ :');
    console.log('========================================');
    console.log(hash);
    console.log('========================================');
    console.log('\n📏 Longueur du hash :', hash.length, 'caractères');
    console.log('\n📋 Pour mettre à jour dans MySQL :');
    console.log('----------------------------------------');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@chantiers.com';`);
    console.log('----------------------------------------');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécuter la fonction
generateHash();