const express = require('express');
const router = express.Router();
const AffectationController = require('../controllers/affectationController');
const { auth, authorize } = require('../middlewares/auth');
const { validateAffectation } = require('../middlewares/validation');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes pour tous les rôles (avec restrictions dans le controller)
router.get('/', AffectationController.getAllAffectations);
router.get('/ouvriers-disponibles', AffectationController.getOuvriersDisponibles);

// Routes pour admin et chef seulement
router.post('/', authorize('admin', 'chef'), validateAffectation, AffectationController.createAffectation);
router.put('/:id', authorize('admin', 'chef'), AffectationController.updateAffectation);
router.delete('/:id', authorize('admin', 'chef'), AffectationController.deleteAffectation);

module.exports = router;