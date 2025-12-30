const { body, validationResult, param, query } = require('express-validator');
const db = require('../models');

// Validation de l'authentification
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation de la création d'utilisateur
const validateCreateUser = [
  body('nom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .custom(async (email) => {
      const user = await db.User.findOne({ where: { email } });
      if (user) {
        throw new Error('Cet email est déjà utilisé');
      }
      return true;
    })
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role')
    .isIn(['admin', 'chef', 'ouvrier'])
    .withMessage('Rôle invalide'),
  body('telephone')
    .optional()
    .matches(/^[0-9+\-\s()]{10,20}$/)
    .withMessage('Numéro de téléphone invalide'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation de la création de chantier
const validateCreateChantier = [
  body('nom')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Le nom doit contenir entre 3 et 150 caractères'),
  body('date_debut')
    .isDate()
    .withMessage('Date de début invalide'),
  body('date_fin_prevue')
    .isDate()
    .withMessage('Date de fin prévue invalide')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.date_debut)) {
        throw new Error('La date de fin doit être après la date de début');
      }
      return true;
    }),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le budget doit être un nombre positif'),
  body('statut')
    .optional()
    .isIn(['planifié', 'en_cours', 'suspendu', 'terminé', 'annulé'])
    .withMessage('Statut invalide'),
  body('chef_id')
    .isInt()
    .withMessage('ID du chef invalide')
    .custom(async (chefId) => {
      const chef = await db.User.findByPk(chefId);
      if (!chef || chef.role !== 'chef') {
        throw new Error('Le chef spécifié n\'existe pas ou n\'est pas un chef');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation de l'affectation
const validateAffectation = [
  body('chantier_id')
    .isInt()
    .withMessage('ID du chantier invalide')
    .custom(async (chantierId) => {
      const chantier = await db.Chantier.findByPk(chantierId);
      if (!chantier) {
        throw new Error('Chantier non trouvé');
      }
      return true;
    }),
  body('ouvrier_id')
    .isInt()
    .withMessage('ID de l\'ouvrier invalide')
    .custom(async (ouvrierId, { req }) => {
      const ouvrier = await db.User.findByPk(ouvrierId);
      if (!ouvrier || ouvrier.role !== 'ouvrier') {
        throw new Error('L\'ouvrier spécifié n\'existe pas ou n\'est pas un ouvrier');
      }
      
      // Vérifier si l'ouvrier est déjà affecté à ce chantier
      const existingAffectation = await db.Affectation.findOne({
        where: {
          chantier_id: req.body.chantier_id,
          ouvrier_id: ouvrierId,
          date_fin: null
        }
      });
      
      if (existingAffectation) {
        throw new Error('Cet ouvrier est déjà affecté à ce chantier');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateLogin,
  validateCreateUser,
  validateCreateChantier,
  validateAffectation,
  validationResult
};