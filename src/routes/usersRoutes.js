const express = require('express');
const usersController = require('../controllers/usersControllers');

const router = express.Router();

router.post('/', usersController.registerUser);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
