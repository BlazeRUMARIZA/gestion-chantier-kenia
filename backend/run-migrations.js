const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Exécution des migrations...');

try {
  // Utiliser le module sequelize-cli directement depuis node_modules
  const sequelizeCli = path.join(__dirname, 'node_modules', '.bin', 'sequelize');
  
  // Exécuter la migration de manière synchrone
  execSync(`node ${sequelizeCli} db:migrate`, {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('✅ Migrations terminées avec succès!');
} catch (error) {
  console.error('❌ Erreur lors des migrations:', error.message);
  process.exit(1);
}
