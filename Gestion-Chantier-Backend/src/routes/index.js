const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const chantierRoutes = require('./chantiers');  // CORRECTION: './chantiers' sans 's' à la fin
const affectationRoutes = require('./affectations');
const logRoutes = require('./logs');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chantiers', chantierRoutes);
router.use('/affectations', affectationRoutes);
router.use('/logs', logRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Gestion des Chantiers API'
  });
});

module.exports = router;