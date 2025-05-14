const express = require('express');
const usersController = require('../controllers/users.controllers');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', usersController.registerUser);
router.get('/', authenticate, usersController.getAllUsers);
router.put('/', authenticate, usersController.updateUser);
router.get('/details', authenticate, usersController.getUserDetails);
/** Routes à doucumenter *************************************/
router.post('/request-restauration', authenticate, usersController.requestToRestaureUser);
router.post('/verify-restauration', authenticate, usersController.verifyRestaurationOtp);
/*********************************************************** */
router.delete('/', authenticate, usersController.deleteProfile);
router.get('/:id', authenticate, usersController.getUserById); // Obtenir le profil public d'un utilisateur
router.put('/:id', authenticate, authorize('ADMIN'), usersController.adminUpdateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), usersController.deleteUser);

module.exports = router;
