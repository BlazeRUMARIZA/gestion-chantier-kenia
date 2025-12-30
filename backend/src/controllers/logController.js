const db = require('../models');
const { Op } = require('sequelize');

class LogController {
  static async getAllLogs(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        niveau, 
        user_id, 
        action,
        date_debut,
        date_fin 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (niveau) where.niveau = niveau;
      if (user_id) where.user_id = user_id;
      if (action) where.action = { [Op.like]: `%${action}%` };
      
      // Filtre par date
      if (date_debut && date_fin) {
        where.created_at = {
          [Op.between]: [new Date(date_debut), new Date(date_fin)]
        };
      }
      
      const { count, rows: logs } = await db.Log.findAndCountAll({
        where,
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['id', 'nom', 'email', 'role']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: logs,
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
        message: 'Erreur lors de la récupération des logs',
        error: error.message
      });
    }
  }
  
  static async getLoginHistory(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      
      const logs = await db.Log.findAndCountAll({
        where: {
          action: { [Op.like]: '%Connexion%' }
        },
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['id', 'nom', 'email', 'role']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: logs.rows,
        pagination: {
          total: logs.count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(logs.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique des connexions',
        error: error.message
      });
    }
  }
}

module.exports = LogController;