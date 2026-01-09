const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: config.dialect,
      logging: config.logging,
      define: config.define
    }
  );
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize);
db.Chantier = require('./chantier')(sequelize);
db.Affectation = require('./affectation')(sequelize);
db.Log = require('./log')(sequelize);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;