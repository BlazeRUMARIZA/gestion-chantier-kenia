const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Affectation = sequelize.define('Affectation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chantier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chantiers',
        key: 'id'
      }
    },
    ouvrier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date_debut: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    date_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    role_sur_chantier: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'ouvrier'
    },
    heures_prevues: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'affectations',
    timestamps: true
  });

  Affectation.associate = (models) => {
    Affectation.belongsTo(models.Chantier, {
      foreignKey: 'chantier_id',
      as: 'chantier'
    });
    
    Affectation.belongsTo(models.User, {
      foreignKey: 'ouvrier_id',
      as: 'ouvrier'
    });
  };

  return Affectation;
};