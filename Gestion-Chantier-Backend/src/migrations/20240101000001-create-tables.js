'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Table Users
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nom: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'chef', 'ouvrier'),
        allowNull: false,
        defaultValue: 'ouvrier'
      },
      telephone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      actif: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      derniere_connexion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Table Chantiers
    await queryInterface.createTable('chantiers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nom: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      adresse: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      date_debut: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      date_fin_prevue: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      date_fin_reelle: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      statut: {
        type: Sequelize.ENUM('planifié', 'en_cours', 'suspendu', 'terminé', 'annulé'),
        allowNull: false,
        defaultValue: 'planifié'
      },
      budget: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      chef_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      priorite: {
        type: Sequelize.ENUM('faible', 'moyenne', 'haute', 'critique'),
        defaultValue: 'moyenne'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Table Affectations
    await queryInterface.createTable('affectations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      chantier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'chantiers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ouvrier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date_debut: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },
      date_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      role_sur_chantier: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: 'ouvrier'
      },
      heures_prevues: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Table Logs
    await queryInterface.createTable('logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      action: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      niveau: {
        type: Sequelize.ENUM('info', 'warning', 'error', 'critical'),
        defaultValue: 'info'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      endpoint: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      method: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Indexes
    await queryInterface.addIndex('affectations', ['chantier_id', 'ouvrier_id'], {
      unique: true,
      name: 'affectation_unique'
    });

    await queryInterface.addIndex('chantiers', ['statut']);
    await queryInterface.addIndex('chantiers', ['chef_id']);
    await queryInterface.addIndex('affectations', ['ouvrier_id']);
    await queryInterface.addIndex('logs', ['user_id']);
    await queryInterface.addIndex('logs', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('logs');
    await queryInterface.dropTable('affectations');
    await queryInterface.dropTable('chantiers');
    await queryInterface.dropTable('users');
  }
};