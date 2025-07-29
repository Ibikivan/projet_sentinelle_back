const express = require('express');
const testimoniesController = require('../controllers/testimonies.controllers');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/:prayerId', authenticate, testimoniesController.add);

module.exports = router;
