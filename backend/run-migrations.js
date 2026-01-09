const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');

// Charger la configuration de la base de données
const env = process.env.NODE_ENV || 'development';
const config = require('./src/config/config.json')[env];

console.log('🔄 Exécution des migrations...');
console.log(`📊 Environnement: ${env}`);

// Créer une instance Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Configurer Umzug pour gérer les migrations
const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, 'src/migrations'),
    params: [sequelize.getQueryInterface(), Sequelize]
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize
  }
});

// Exécuter les migrations
umzug.up()
  .then((migrations) => {
    if (migrations.length === 0) {
      console.log('✅ Aucune nouvelle migration à exécuter');
    } else {
      console.log('✅ Migrations exécutées:');
      migrations.forEach(m => console.log(`   - ${m.file}`));
    }
    console.log('✅ Migrations terminées avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur lors des migrations:', error);
    process.exit(1);
  });
