const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Database configuration
const sequelize = new Sequelize('gestion_chantiers', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log
});

async function setupDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!\n');

    // Run migrations
    console.log('📦 Running migrations...');
    const migrationPath = path.join(__dirname, 'src/migrations/20240101000001-create-tables.js');
    const migration = require(migrationPath);
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    console.log('✅ Migrations completed!\n');

    // Run seeders
    console.log('🌱 Running seeders...');
    const seederPath = path.join(__dirname, 'src/seeders/20240101000001-initial-data.js');
    const seeder = require(seederPath);
    await seeder.up(sequelize.getQueryInterface(), Sequelize);
    console.log('✅ Seeders completed!\n');

    console.log('🎉 Database setup complete!');
    console.log('\n📝 Default credentials:');
    console.log('   Admin: admin@chantiers.com / password123');
    console.log('   Chef: chef.dupont@chantiers.com / password123');
    console.log('   Ouvrier: ouvrier.martin@chantiers.com / password123');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    await sequelize.close();
    process.exit(1);
  }
}

setupDatabase();
