const db = require('../models');

class AffectationController {
  // CRUD Affectations
  static async getAllAffectations(req, res) {
    try {
      const { page = 1, limit = 10, chantier_id, ouvrier_id } = req.query;
      const offset = (page - 1) * limit;
      
      const where = {};
      
      if (chantier_id) where.chantier_id = chantier_id;
      if (ouvrier_id) where.ouvrier_id = ouvrier_id;
      
      // Limiter selon le rôle
      if (req.user.role === 'chef') {
        // Seulement les chantiers où l'utilisateur est chef
        const chantiers = await db.Chantier.findAll({
          where: { chef_id: req.user.id },
          attributes: ['id']
        });
        
        const chantierIds = chantiers.map(c => c.id);
        where.chantier_id = { [Op.in]: chantierIds };
      } else if (req.user.role === 'ouvrier') {
        where.ouvrier_id = req.user.id;
      }
      
      const { count, rows: affectations } = await db.Affectation.findAndCountAll({
        where,
        include: [
          {
            model: db.Chantier,
            as: 'chantier',
            attributes: ['id', 'nom', 'statut']
          },
          {
            model: db.User,
            as: 'ouvrier',
            attributes: ['id', 'nom', 'email']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: affectations,
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
        message: 'Erreur lors de la récupération des affectations',
        error: error.message
      });
    }
  }
  
  static async createAffectation(req, res) {
    try {
      const affectation = await db.Affectation.create(req.body);
      
      // Log de création
      await db.Log.create({
        action: `Affectation ouvrier au chantier ${req.body.chantier_id}`,
        niveau: 'info',
        user_id: req.user.id,
        details: JSON.stringify(req.body)
      });
      
      res.status(201).json({
        success: true,
        message: 'Affectation créée avec succès',
        data: affectation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création de l\'affectation',
        error: error.message
      });
    }
  }
  
  static async updateAffectation(req, res) {
    try {
      const affectation = await db.Affectation.findByPk(req.params.id, {
        include: [{
          model: db.Chantier,
          as: 'chantier'
        }]
      });
      
      if (!affectation) {
        return res.status(404).json({
          success: false,
          message: 'Affectation non trouvée'
        });
      }
      
      // Vérifier les permissions
      if (req.user.role === 'chef' && affectation.chantier.chef_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas le chef de ce chantier'
        });
      }
      
      await affectation.update(req.body);
      
      // Log de modification
      await db.Log.create({
        action: `Modification affectation ${req.params.id}`,
        niveau: 'info',
        user_id: req.user.id,
        details: JSON.stringify(req.body)
      });
      
      res.json({
        success: true,
        message: 'Affectation mise à jour avec succès',
        data: affectation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'affectation',
        error: error.message
      });
    }
  }
  
  static async deleteAffectation(req, res) {
    try {
      const affectation = await db.Affectation.findByPk(req.params.id, {
        include: [{
          model: db.Chantier,
          as: 'chantier'
        }]
      });
      
      if (!affectation) {
        return res.status(404).json({
          success: false,
          message: 'Affectation non trouvée'
        });
      }
      
      // Vérifier les permissions
      if (req.user.role === 'chef' && affectation.chantier.chef_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas le chef de ce chantier'
        });
      }
      
      await affectation.destroy();
      
      // Log de suppression
      await db.Log.create({
        action: `Suppression affectation ${req.params.id}`,
        niveau: 'warning',
        user_id: req.user.id,
        details: JSON.stringify({ affectation_id: req.params.id })
      });
      
      res.json({
        success: true,
        message: 'Affectation supprimée avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'affectation',
        error: error.message
      });
    }
  }
  
  // Fonctionnalités spécifiques
  static async getOuvriersDisponibles(req, res) {
    try {
      const { chantier_id, date } = req.query;
      
      // Trouver les ouvriers déjà affectés à ce chantier
      const affectationsExistantes = await db.Affectation.findAll({
        where: {
          chantier_id,
          date_fin: null
        },
        attributes: ['ouvrier_id']
      });
      
      const ouvriersIdsAffectes = affectationsExistantes.map(a => a.ouvrier_id);
      
      // Trouver tous les ouvriers non affectés
      const ouvriers = await db.User.findAll({
        where: {
          role: 'ouvrier',
          actif: true,
          id: { [Op.notIn]: ouvriersIdsAffectes }
        },
        attributes: ['id', 'nom', 'email', 'telephone'],
        order: [['nom', 'ASC']]
      });
      
      res.json({
        success: true,
        data: ouvriers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des ouvriers disponibles',
        error: error.message
      });
    }
  }
}

module.exports = AffectationController;
