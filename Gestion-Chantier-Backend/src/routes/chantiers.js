const express = require('express');
const router = express.Router();
const ChantierController = require('../controllers/chantierController');
const { auth, authorize } = require('../middlewares/auth');
const { validateCreateChantier } = require('../middlewares/validation');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes pour tous les rôles
router.get('/', ChantierController.getAllChantiers);
router.get('/planning', ChantierController.getPlanning);
router.get('/:id', ChantierController.getChantierById);
router.get('/:id/pdf', ChantierController.generatePdfReport);

// Routes pour admin et chef
router.post('/', authorize('admin', 'chef'), validateCreateChantier, ChantierController.createChantier);
router.put('/:id', authorize('admin', 'chef'), ChantierController.updateChantier);
router.delete('/:id', authorize('admin'), ChantierController.deleteChantier);

// Routes pour admin seulement
router.get('/stats/dashboard', authorize('admin'), ChantierController.getChantierStats);

module.exports = router;