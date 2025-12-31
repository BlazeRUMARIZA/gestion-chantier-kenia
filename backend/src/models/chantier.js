const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chantier = sequelize.define('Chantier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le nom du chantier est requis' },
        len: [3, 150]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    adresse: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date_debut: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'Date de début invalide' },
        notEmpty: { msg: 'La date de début est requise' }
      }
    },
    date_fin_prevue: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'Date de fin prévue invalide' },
        notEmpty: { msg: 'La date de fin prévue est requise' }
      }
    },
    date_fin_reelle: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    statut: {
      type: DataTypes.ENUM('planifié', 'en_cours', 'suspendu', 'terminé', 'annulé'),
      allowNull: false,
      defaultValue: 'planifié',
      validate: {
        isIn: [['planifié', 'en_cours', 'suspendu', 'terminé', 'annulé']]
      }
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00,
      validate: {
        isDecimal: { msg: 'Le budget doit être un nombre décimal' }
      }
    },
    chef_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      validate: {
        notEmpty: { msg: 'Le chef de chantier est requis' }
      }
    },
    priorite: {
      type: DataTypes.ENUM('faible', 'moyenne', 'haute', 'critique'),
      defaultValue: 'moyenne'
    }
  }, {
    tableName: 'chantiers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  Chantier.associate = (models) => {
    Chantier.belongsTo(models.User, {
      foreignKey: 'chef_id',
      as: 'chef'
    });
    
    Chantier.hasMany(models.Affectation, {
      foreignKey: 'chantier_id',
      as: 'affectations'
    });
  };

  // Méthode pour calculer la durée
  Chantier.prototype.calculerDuree = function() {
    const moment = require('moment');
    const dateDebut = moment(this.date_debut);
    const dateFin = this.date_fin_reelle ? moment(this.date_fin_reelle) : moment(this.date_fin_prevue);
    return dateFin.diff(dateDebut, 'days');
  };

  // Méthode pour vérifier les retards
  Chantier.prototype.verifierRetard = function() {
    const moment = require('moment');
    const aujourdhui = moment();
    const dateFinPrevue = moment(this.date_fin_prevue);
    
    if (aujourdhui.isAfter(dateFinPrevue) && this.statut !== 'terminé') {
      return {
        en_retard: true,
        jours_retard: aujourdhui.diff(dateFinPrevue, 'days')
      };
    }
    return { en_retard: false, jours_retard: 0 };
  };

  // Méthode pour le pourcentage de complétion
  Chantier.prototype.calculerProgression = function() {
    const progress = {
      'planifié': 10,
      'en_cours': 50,
      'suspendu': 30,
      'terminé': 100,
      'annulé': 0
    };
    return progress[this.statut] || 0;
  };

  return Chantier;
};