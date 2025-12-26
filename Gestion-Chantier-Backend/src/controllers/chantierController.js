const db = require('../models');
const PdfService = require('../services/pdfService');
const { Op } = require('sequelize');
const moment = require('moment');

class ChantierController {
  // CRUD Chantiers
  static async getAllChantiers(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        statut, 
        chef_id, 
        priorite,
        search,
        date_debut,
        date_fin,
        retard = 'false'
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const where = {};
      
      // Filtres de base
      if (statut) where.statut = statut;
      if (chef_id) where.chef_id = chef_id;
      if (priorite) where.priorite = priorite;
      
      // Filtre de recherche
      if (search) {
        where[Op.or] = [
          { nom: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { adresse: { [Op.like]: `%${search}%` } }
        ];
      }
      
      // Filtre par date
      if (date_debut && date_fin) {
        where.date_debut = {
          [Op.between]: [date_debut, date_fin]
        };
      }
      
      // Si l'utilisateur est un ouvrier, seulement ses chantiers
      if (req.user.role === 'ouvrier') {
        const affectations = await db.Affectation.findAll({
          where: { ouvrier_id: req.user.id },
          attributes: ['chantier_id']
        });
        
        const chantierIds = affectations.map(a => a.chantier_id);
        where.id = { [Op.in]: chantierIds };
      }
      
      // Si l'utilisateur est un chef, seulement ses chantiers
      if (req.user.role === 'chef') {
        where.chef_id = req.user.id;
      }
      
      const { count, rows: chantiers } = await db.Chantier.findAndCountAll({
        where,
        include: [
          {
            model: db.User,
            as: 'chef',
            attributes: ['id', 'nom', 'email']
          },
          {
            model: db.Affectation,
            as: 'affectations',
            include: [{
              model: db.User,
              as: 'ouvrier',
              attributes: ['id', 'nom']
            }]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['date_debut', 'DESC']]
      });
      
      // Filtrer les chantiers en retard si demandé
      let filteredChantiers = chantiers;
      if (retard === 'true') {
        filteredChantiers = chantiers.filter(chantier => 
          chantier.verifierRetard().en_retard
        );
      }
      
      // Ajouter des données calculées
      const enhancedChantiers = filteredChantiers.map(chantier => {
        const chantierData = chantier.toJSON();
        const retardInfo = chantier.verifierRetard();
        const duree = chantier.calculerDuree();
        const progression = chantier.calculerProgression();
        
        return {
          ...chantierData,
          duree,
          progression,
          en_retard: retardInfo.en_retard,
          jours_retard: retardInfo.jours_retard,
          ouvriers_count: chantierData.affectations?.length || 0
        };
      });
      
      res.json({
        success: true,
        data: enhancedChantiers,
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
        message: 'Erreur lors de la récupération des chantiers',
        error: error.message
      });
    }
  }
  
  static async getChantierById(req, res) {
    try {
      const chantier = await db.Chantier.findByPk(req.params.id, {
        include: [
          {
            model: db.User,
            as: 'chef',
            attributes: { exclude: ['password'] }
          },
          {
            model: db.Affectation,
            as: 'affectations',
            include: [{
              model: db.User,
              as: 'ouvrier',
              attributes: { exclude: ['password'] }
            }]
          }
        ]
      });
      
      if (!chantier) {
        return res.status(404).json({
          success: false,
          message: 'Chantier non trouvé'
        });
      }
      
      // Vérifier les permissions
      if (req.user.role === 'ouvrier') {
        const affectation = await db.Affectation.findOne({
          where: {
            chantier_id: chantier.id,
            ouvrier_id: req.user.id
          }
        });
        
        if (!affectation) {
          return res.status(403).json({
            success: false,
            message: 'Accès non autorisé à ce chantier'
          });
        }
      }
      
      if (req.user.role === 'chef' && chantier.chef_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé à ce chantier'
        });
      }
      
      const chantierData = chantier.toJSON();
      const retardInfo = chantier.verifierRetard();
      const duree = chantier.calculerDuree();
      const progression = chantier.calculerProgression();
      
      res.json({
        success: true,
        data: {
          ...chantierData,
          duree,
          progression,
          en_retard: retardInfo.en_retard,
          jours_retard: retardInfo.jours_retard
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du chantier',
        error: error.message
      });
    }
  }
  
  static async createChantier(req, res) {
    try {
      const chantier = await db.Chantier.create(req.body);
      
      // Log de création
      await db.Log.create({
        action: `Création chantier: ${chantier.nom}`,
        niveau: 'info',
        user_id: req.user.id,
        details: JSON.stringify({ chantier_id: chantier.id })
      });
      
      res.status(201).json({
        success: true,
        message: 'Chantier créé avec succès',
        data: chantier
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création du chantier',
        error: error.message
      });
    }
  }
  
  static async updateChantier(req, res) {
    try {
      const chantier = await db.Chantier.findByPk(req.params.id);
      
      if (!chantier) {
        return res.status(404).json({
          success: false,
          message: 'Chantier non trouvé'
        });
      }
      
      // Vérifier les permissions
      if (req.user.role === 'chef' && chantier.chef_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas le chef de ce chantier'
        });
      }
      
      await chantier.update(req.body);
      
      // Log de modification
      await db.Log.create({
        action: `Modification chantier: ${chantier.nom}`,
        niveau: 'info',
        user_id: req.user.id,
        details: JSON.stringify(req.body)
      });
      
      res.json({
        success: true,
        message: 'Chantier mis à jour avec succès',
        data: chantier
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour du chantier',
        error: error.message
      });
    }
  }
  
  static async deleteChantier(req, res) {
    try {
      const chantier = await db.Chantier.findByPk(req.params.id);
      
      if (!chantier) {
        return res.status(404).json({
          success: false,
          message: 'Chantier non trouvé'
        });
      }
      
      // Vérifier les permissions
      if (req.user.role === 'chef' && chantier.chef_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas le chef de ce chantier'
        });
      }
      
      await chantier.destroy();
      
      // Log de suppression
      await db.Log.create({
        action: `Suppression chantier: ${chantier.nom}`,
        niveau: 'warning',
        user_id: req.user.id,
        details: JSON.stringify({ chantier_id: chantier.id })
      });
      
      res.json({
        success: true,
        message: 'Chantier supprimé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du chantier',
        error: error.message
      });
    }
  }
  
  // Fonctionnalités avancées
  static async getChantierStats(req, res) {
    try {
      const stats = await db.sequelize.query(`
        SELECT 
          statut,
          COUNT(*) as count,
          SUM(budget) as total_budget,
          AVG(budget) as avg_budget
        FROM chantiers
        GROUP BY statut
      `, { type: db.sequelize.QueryTypes.SELECT });
      
      const totalChantiers = await db.Chantier.count();
      const chantiersEnRetard = await db.Chantier.count({
        where: {
          statut: { [Op.ne]: 'terminé' },
          date_fin_prevue: { [Op.lt]: new Date() }
        }
      });
      
      const chantiersParPriorite = await db.Chantier.findAll({
        attributes: [
          'priorite',
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
        ],
        group: ['priorite']
      });
      
      res.json({
        success: true,
        data: {
          parStatut: stats,
          parPriorite: chantiersParPriorite,
          total: totalChantiers,
          en_retard: chantiersEnRetard,
          progression: Math.round((stats.find(s => s.statut === 'terminé')?.count || 0) / totalChantiers * 100)
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
  
  static async generatePdfReport(req, res) {
    try {
      const pdfBuffer = await PdfService.generateChantierReport(req.params.id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rapport-chantier-${req.params.id}.pdf"`,
        'Content-Length': pdfBuffer.length
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération du PDF',
        error: error.message
      });
    }
  }
  
  static async getPlanning(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      const where = {};
      
      if (start_date && end_date) {
        where[Op.or] = [
          {
            date_debut: {
              [Op.between]: [start_date, end_date]
            }
          },
          {
            date_fin_prevue: {
              [Op.between]: [start_date, end_date]
            }
          }
        ];
      }
      
      // Limiter selon le rôle
      if (req.user.role === 'chef') {
        where.chef_id = req.user.id;
      } else if (req.user.role === 'ouvrier') {
        const affectations = await db.Affectation.findAll({
          where: { ouvrier_id: req.user.id },
          attributes: ['chantier_id']
        });
        
        const chantierIds = affectations.map(a => a.chantier_id);
        where.id = { [Op.in]: chantierIds };
      }
      
      const chantiers = await db.Chantier.findAll({
        where,
        include: [
          {
            model: db.User,
            as: 'chef',
            attributes: ['id', 'nom']
          }
        ],
        order: [['date_debut', 'ASC']]
      });
      
      const planning = chantiers.map(chantier => ({
        id: chantier.id,
        title: chantier.nom,
        start: chantier.date_debut,
        end: chantier.date_fin_prevue,
        statut: chantier.statut,
        priorite: chantier.priorite,
        chef: chantier.chef.nom,
        retard: chantier.verifierRetard().en_retard
      }));
      
      res.json({
        success: true,
        data: planning
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du planning',
        error: error.message
      });
    }
  }
}

module.exports = ChantierController;