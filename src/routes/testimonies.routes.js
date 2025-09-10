const express = require('express');
const testimoniesController = require('../controllers/testimonies.controllers');
const { authenticate } = require('../middlewares/auth.middleware');
const { createUpload, FILE_TYPES } = require('../middlewares/uploads');

const router = express.Router();
const voiceContentUpload = createUpload({
    folder: 'voiceContent',
    allowedTypes: FILE_TYPES.audio,
});

router.post('/subjects/:subjectId', authenticate, voiceContentUpload, testimoniesController.addTestimony);
router.get('/subjects/:subjectId', authenticate, testimoniesController.getTestimonyBySubject);
router.put('/subjects/:subjectId', authenticate, voiceContentUpload, testimoniesController.updateTestimony);
router.delete('/subjects/:subjectId', authenticate, testimoniesController.deleteTestimony);

module.exports = router;
