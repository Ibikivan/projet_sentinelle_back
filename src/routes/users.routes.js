const express = require('express');
const usersController = require('../controllers/users.controllers');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { createUpload, FILE_TYPES } = require('../middlewares/uploads');

const router = express.Router();
const uploadAvatar = createUpload({
    folder: 'profilePicture',
    allowedTypes: FILE_TYPES.image
});

router.post('/', uploadAvatar, usersController.registerUser);
router.get('/', authenticate, usersController.getAllUsers);
router.put('/', authenticate, uploadAvatar, usersController.updateUser);
router.get('/details', authenticate, usersController.getUserDetails);
router.post('/request-restauration', usersController.requestToRestoreUser);
router.post('/verify-restauration', usersController.verifyRestaurationOtp);
router.delete('/', authenticate, usersController.deleteProfile);
router.get('/:id', authenticate, usersController.getUserById); // Obtenir le profil public d'un utilisateur
router.put('/:id', authenticate, uploadAvatar, authorize('ADMIN'), usersController.adminUpdateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), usersController.deleteUser);

module.exports = router;
