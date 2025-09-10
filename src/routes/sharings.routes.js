const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const sharingsController = require('../controllers/sharings.controllers');
const { createUpload, FILE_TYPES } = require('../middlewares/uploads');

const router = express.Router();
const uploadVoice = createUpload({
    folder: 'voiceUrl',
    allowedTypes: FILE_TYPES.audio,
});

router.post('/', authenticate, uploadVoice, sharingsController.addSharing); // subjectId in query params
router.get('/', authenticate, sharingsController.getSharingsBySubject); // subjectId in query params

router.get('/:id', authenticate, sharingsController.getSharingById);
router.put('/:id', authenticate, sharingsController.updateSharing);
router.delete('/:id', authenticate, sharingsController.deleteSharing);

router.get('/user/me', authenticate, sharingsController.getUserSharings);

module.exports = router;
