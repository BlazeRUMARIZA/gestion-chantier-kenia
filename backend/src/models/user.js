const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le nom est requis' },
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        msg: 'Cet email est déjà utilisé'
      },
      validate: {
        isEmail: { msg: 'Email invalide' },
        notEmpty: { msg: 'L\'email est requis' }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le mot de passe est requis' },
        len: [6, 255]
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'chef', 'ouvrier'),
      allowNull: false,
      defaultValue: 'ouvrier',
      validate: {
        isIn: [['admin', 'chef', 'ouvrier']]
      }
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    derniere_connexion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
    // Hooks removed - password hashing is handled in AuthService
  });

  User.associate = (models) => {
    User.hasMany(models.Chantier, {
      foreignKey: 'chef_id',
      as: 'chantiers_chef'
    });
    
    User.hasMany(models.Affectation, {
      foreignKey: 'ouvrier_id',
      as: 'affectations'
    });
    
    User.hasMany(models.Log, {
      foreignKey: 'user_id',
      as: 'logs'
    });
  };

  // ⚠️ ENLEVER la méthode comparePassword qui utilise bcrypt
  // User.prototype.comparePassword = async function(password) {
  //   const bcrypt = require('bcryptjs');
  //   return await bcrypt.compare(password, this.password);
  // };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  return User;
};