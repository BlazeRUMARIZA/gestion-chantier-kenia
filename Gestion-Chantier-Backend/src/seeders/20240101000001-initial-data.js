'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        nom: 'Admin Principal',
        email: 'admin@chantiers.com',
        password: hashedPassword,
        role: 'admin',
        telephone: '0601020304',
        actif: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nom: 'Chef Dupont',
        email: 'chef.dupont@chantiers.com',
        password: hashedPassword,
        role: 'chef',
        telephone: '0605060708',
        actif: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nom: 'Ouvrier Martin',
        email: 'ouvrier.martin@chantiers.com',
        password: hashedPassword,
        role: 'ouvrier',
        telephone: '0609101112',
        actif: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nom: 'Ouvrier Durand',
        email: 'ouvrier.durand@chantiers.com',
        password: hashedPassword,
        role: 'ouvrier',
        telephone: '0613141516',
        actif: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Chantiers - using hardcoded IDs since MySQL bulkInsert doesn't return IDs
    await queryInterface.bulkInsert('chantiers', [
      {
        nom: 'Construction immeuble résidentiel',
        description: 'Construction d\'un immeuble de 10 étages avec 20 appartements',
        adresse: '123 Avenue des Champs, Paris',
        date_debut: '2024-01-15',
        date_fin_prevue: '2024-12-15',
        statut: 'en_cours',
        budget: 2500000.00,
        chef_id: 2,
        priorite: 'haute',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nom: 'Rénovation école primaire',
        description: 'Rénovation complète des salles de classe et sanitaires',
        adresse: '45 Rue des Écoles, Lyon',
        date_debut: '2024-02-01',
        date_fin_prevue: '2024-08-01',
        statut: 'planifié',
        budget: 850000.00,
        chef_id: 2,
        priorite: 'moyenne',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nom: 'Pont piétonnier',
        description: 'Construction d\'un pont piétonnier sur la rivière',
        adresse: 'Rue de la Rivière, Bordeaux',
        date_debut: '2023-11-01',
        date_fin_prevue: '2024-03-01',
        statut: 'terminé',
        date_fin_reelle: '2024-02-28',
        budget: 450000.00,
        chef_id: 2,
        priorite: 'faible',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Affectations
    await queryInterface.bulkInsert('affectations', [
      {
        chantier_id: 1,
        ouvrier_id: 3,
        date_debut: '2024-01-15',
        role_sur_chantier: 'maçon',
        heures_prevues: 160,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        chantier_id: 1,
        ouvrier_id: 4,
        date_debut: '2024-01-15',
        role_sur_chantier: 'charpentier',
        heures_prevues: 120,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        chantier_id: 2,
        ouvrier_id: 3,
        date_debut: '2024-02-01',
        role_sur_chantier: 'électricien',
        heures_prevues: 80,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Logs initiaux
    await queryInterface.bulkInsert('logs', [
      {
        action: 'Système initialisé',
        niveau: 'info',
        user_id: 1,
        ip_address: '127.0.0.1',
        details: 'Installation initiale avec données de test',
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('logs', null, {});
    await queryInterface.bulkDelete('affectations', null, {});
    await queryInterface.bulkDelete('chantiers', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};