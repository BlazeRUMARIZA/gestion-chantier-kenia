const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { auth, authorize } = require('../middlewares/auth');
const { validateCreateUser } = require('../middlewares/validation');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes accessibles par admin seulement
router.get('/', authorize('admin'), UserController.getAllUsers);
router.get('/stats', authorize('admin'), UserController.getUserStats);
router.post('/', authorize('admin'), validateCreateUser, UserController.createUser);

// Routes accessibles par tous les utilisateurs authentifiés
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', authorize('admin'), UserController.deleteUser);

module.exports = router;