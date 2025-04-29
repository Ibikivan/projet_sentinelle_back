const express = require('express');
const usersController = require('../controllers/users.controllers');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', usersController.registerUser);
router.get('/', authenticate, usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', authenticate, usersController.updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), usersController.deleteUser);

module.exports = router;
