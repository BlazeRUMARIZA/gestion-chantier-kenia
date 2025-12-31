const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Log = sequelize.define('Log', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    niveau: {
      type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
      defaultValue: 'info'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    endpoint: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    tableName: 'logs',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
    underscored: true
  });

  Log.associate = (models) => {
    Log.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Log;
};