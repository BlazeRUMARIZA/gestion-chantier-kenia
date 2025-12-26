const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const { validateLogin } = require('../middlewares/validation');

// Public routes
router.post('/login', validateLogin, AuthController.login);

// Protected routes - IMPORTANT: ajouter le middleware 'auth'
router.post('/logout', auth, AuthController.logout);
router.get('/profile', auth, AuthController.getProfile);

module.exports = router;