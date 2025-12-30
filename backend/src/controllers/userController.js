const db = require('../models');
const { Op } = require('sequelize');

class UserController {
  // CRUD Utilisateurs
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (role) {
        where.role = role;
      }
      
      if (search) {
        where[Op.or] = [
          { nom: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const { count, rows: users } = await db.User.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message
      });
    }
  }
  
  static async getUserById(req, res) {
    try {
      const user = await db.User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur',
        error: error.message
      });
    }
  }
  
  static async createUser(req, res) {
    try {
      const user = await db.User.create(req.body);
      
      // Log de création
      await db.Log.create({
        action: `Création utilisateur: ${user.email}`,
        niveau: 'info',
        user_id: req.user.id,
        details: JSON.stringify({ user_id: user.id, role: user.role })
      });
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: user.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message
      });
    }
  }
  
  static async updateUser(req, res) {
    try {
      const user = await db.User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      // Empêcher la modification de son propre rôle
      if (req.user.id === user.id && req.body.role && req.body.role !== user.role) {
        return res.status(403).json({
          success: false,
          message: 'Vous ne pouvez pas modifier votre propre rôle'
        });
      }
      
      await user.update(req.body);
      
      // Log de modification
      await db.Log.create({
        action: `Modification utilisateur: ${user.email}`,
        niveau: 'info',
        user_id: req.user.id,
        details: JSON.stringify(req.body)
      });
      
      res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: user.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        error: error.message
      });
    }
  }
  
  static async deleteUser(req, res) {
    try {
      const user = await db.User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      // Empêcher la suppression de soi-même
      if (req.user.id === user.id) {
        return res.status(403).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte'
        });
      }
      
      await user.destroy();
      
      // Log de suppression
      await db.Log.create({
        action: `Suppression utilisateur: ${user.email}`,
        niveau: 'warning',
        user_id: req.user.id,
        details: JSON.stringify({ user_id: user.id })
      });
      
      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        error: error.message
      });
    }
  }
  
  // Statistiques utilisateurs
  static async getUserStats(req, res) {
    try {
      const stats = await db.User.findAll({
        attributes: [
          'role',
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
        ],
        group: ['role']
      });
      
      const totalUsers = await db.User.count();
      const activeUsers = await db.User.count({ where: { actif: true } });
      
      res.json({
        success: true,
        data: {
          byRole: stats,
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }
}

module.exports = UserController;