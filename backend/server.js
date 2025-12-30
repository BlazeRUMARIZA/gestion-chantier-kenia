require('dotenv').config();
const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 5000;

// Synchronisation de la base de données et démarrage du serveur
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Connecté à la base de données MySQL');
    
    // Synchroniser les modèles SEULEMENT en développement
    // En production, utiliser les migrations (start.sh)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Mode développement: sync des modèles...');
      return db.sequelize.sync({ alter: true });
    } else {
      console.log('✅ Mode production: migrations déjà exécutées');
      return Promise.resolve();
    }
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Modèles synchronisés avec la base de données');
    }
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🌐 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 API disponible sur: http://localhost:${PORT}/api`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    console.error('Vérifiez que:');
    console.error('1. MySQL est démarré');
    console.error('2. Les identifiants dans .env sont corrects');
    console.error('3. La base de données existe');
    process.exit(1);
  });