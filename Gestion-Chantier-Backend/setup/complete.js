const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupComplete() {
  let connection;
  
  try {
    console.log('🚀 Démarrage de la configuration...');
    
    // 1. Connexion à MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    console.log('✅ Connecté à MySQL');
    
    // 2. Créer la base de données
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'gestion_chantiers'}`);
    console.log('✅ Base de données créée');
    
    // 3. Utiliser la base de données
    await connection.query(`USE ${process.env.DB_NAME || 'gestion_chantiers'}`);
    console.log('✅ Base de données sélectionnée');
    
    // 4. Créer la table users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'chef', 'ouvrier') NOT NULL DEFAULT 'ouvrier',
        telephone VARCHAR(20),
        actif BOOLEAN DEFAULT TRUE,
        derniere_connexion DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);
    console.log('✅ Table users créée');
    
    // 5. Créer la table chantiers
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chantiers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(150) NOT NULL,
        description TEXT,
        adresse VARCHAR(255),
        date_debut DATE NOT NULL,
        date_fin_prevue DATE NOT NULL,
        date_fin_reelle DATE,
        statut ENUM('planifié', 'en_cours', 'suspendu', 'terminé', 'annulé') NOT NULL DEFAULT 'planifié',
        budget DECIMAL(15,2) DEFAULT 0.00,
        chef_id INT NOT NULL,
        priorite ENUM('faible', 'moyenne', 'haute', 'critique') DEFAULT 'moyenne',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (chef_id) REFERENCES users(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB
    `);
    console.log('✅ Table chantiers créée');
    
    // 6. Créer la table affectations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS affectations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        chantier_id INT NOT NULL,
        ouvrier_id INT NOT NULL,
        date_debut DATE DEFAULT (CURRENT_DATE),
        date_fin DATE,
        role_sur_chantier VARCHAR(100) DEFAULT 'ouvrier',
        heures_prevues INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (chantier_id) REFERENCES chantiers(id) ON DELETE CASCADE,
        FOREIGN KEY (ouvrier_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log('✅ Table affectations créée');
    
    // 7. Créer la table logs
    await connection.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        action VARCHAR(255) NOT NULL,
        niveau ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
        user_id INT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        details TEXT,
        endpoint VARCHAR(255),
        method VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);
    console.log('✅ Table logs créée');
    
    // 8. Créer des index
    await connection.query('CREATE INDEX IF NOT EXISTS idx_chantiers_statut ON chantiers(statut)');
    await connection.query('CREATE INDEX IF NOT EXISTS idx_chantiers_chef_id ON chantiers(chef_id)');
    await connection.query('CREATE INDEX IF NOT EXISTS idx_affectations_ouvrier_id ON affectations(ouvrier_id)');
    await connection.query('CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id)');
    await connection.query('CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at)');
    console.log('✅ Index créés');
    
    // 9. Vérifier si des utilisateurs existent déjà
    const [existingUsers] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    if (existingUsers[0].count === 0) {
      console.log('📝 Création des utilisateurs de test...');
      
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // 10. Insérer l'admin
      const [adminResult] = await connection.query(
        'INSERT INTO users (nom, email, password, role, telephone) VALUES (?, ?, ?, ?, ?)',
        ['Admin Principal', 'admin@chantiers.com', hashedPassword, 'admin', '0601020304']
      );
      console.log('✅ Admin créé');
      
      // 11. Insérer un chef
      const [chefResult] = await connection.query(
        'INSERT INTO users (nom, email, password, role, telephone) VALUES (?, ?, ?, ?, ?)',
        ['Chef Dupont', 'chef.dupont@chantiers.com', hashedPassword, 'chef', '0605060708']
      );
      console.log('✅ Chef créé');
      
      // 12. Insérer des ouvriers
      await connection.query(
        'INSERT INTO users (nom, email, password, role, telephone) VALUES (?, ?, ?, ?, ?)',
        ['Ouvrier Martin', 'ouvrier.martin@chantiers.com', hashedPassword, 'ouvrier', '0609101112']
      );
      
      await connection.query(
        'INSERT INTO users (nom, email, password, role, telephone) VALUES (?, ?, ?, ?, ?)',
        ['Ouvrier Durand', 'ouvrier.durand@chantiers.com', hashedPassword, 'ouvrier', '0613141516']
      );
      console.log('✅ Ouvriers créés');
      
      // 13. Insérer des chantiers
      const [chantier1] = await connection.query(
        `INSERT INTO chantiers (nom, description, adresse, date_debut, date_fin_prevue, statut, budget, chef_id, priorite) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Construction immeuble résidentiel',
          'Construction d\'un immeuble de 10 étages avec 20 appartements',
          '123 Avenue des Champs, Paris',
          '2024-01-15',
          '2024-12-15',
          'en_cours',
          2500000.00,
          chefResult.insertId,
          'haute'
        ]
      );
      
      await connection.query(
        `INSERT INTO chantiers (nom, description, adresse, date_debut, date_fin_prevue, statut, budget, chef_id, priorite) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Rénovation école primaire',
          'Rénovation complète des salles de classe et sanitaires',
          '45 Rue des Écoles, Lyon',
          '2024-02-01',
          '2024-08-01',
          'planifié',
          850000.00,
          chefResult.insertId,
          'moyenne'
        ]
      );
      console.log('✅ Chantiers créés');
      
      // 14. Insérer des affectations
      await connection.query(
        `INSERT INTO affectations (chantier_id, ouvrier_id, role_sur_chantier, heures_prevues) 
         VALUES (?, ?, ?, ?)`,
        [chantier1.insertId, 3, 'maçon', 160]
      );
      console.log('✅ Affectations créées');
      
      // 15. Insérer un log initial
      await connection.query(
        'INSERT INTO logs (action, niveau, user_id, ip_address) VALUES (?, ?, ?, ?)',
        ['Système initialisé', 'info', adminResult.insertId, '127.0.0.1']
      );
      console.log('✅ Log initial créé');
    } else {
      console.log('📊 Base de données déjà peuplée avec', existingUsers[0].count, 'utilisateurs');
    }
    
    console.log('\n🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !');
    console.log('\n📋 COMPTES DE TEST DISPONIBLES :');
    console.log('====================================');
    console.log('👑 Admin: admin@chantiers.com / password123');
    console.log('👷 Chef: chef.dupont@chantiers.com / password123');
    console.log('🔨 Ouvrier 1: ouvrier.martin@chantiers.com / password123');
    console.log('🔨 Ouvrier 2: ouvrier.durand@chantiers.com / password123');
    console.log('\n🌐 Test API: http://localhost:5000/api/health');
    console.log('🔗 Test Login: POST http://localhost:5000/api/auth/login');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.error('Stack:', error.stack);
    
    if (connection) {
      await connection.end();
    }
    
    process.exit(1);
  }
}

// Exécuter la configuration
setupComplete();