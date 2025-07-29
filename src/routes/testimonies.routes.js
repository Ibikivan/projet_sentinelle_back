const express = require('express');
const testimoniesController = require('../controllers/testimonies.controllers');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/subject/:subjectId/testimony', authenticate, testimoniesController.addTestimony);
router.get('/subject/:subjectId/testimony', authenticate, testimoniesController.getTestimonyBySubject);
router.put('/subject/:subjectId/testimony', authenticate, testimoniesController.updateTestimony);
router.delete('/subject/:subjectId/testimony', authenticate, testimoniesController.deleteTestimony);

module.exports = router;
