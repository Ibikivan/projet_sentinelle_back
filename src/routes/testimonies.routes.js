const express = require('express');
const testimoniesController = require('../controllers/testimonies.controllers');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/subjects/:subjectId', authenticate, testimoniesController.addTestimony);
router.get('/subjects/:subjectId', authenticate, testimoniesController.getTestimonyBySubject);
router.put('/subjects/:subjectId', authenticate, testimoniesController.updateTestimony);
router.delete('/subjects/:subjectId', authenticate, testimoniesController.deleteTestimony);

module.exports = router;
