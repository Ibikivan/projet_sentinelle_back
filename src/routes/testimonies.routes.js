const express = require('express');
const testimonyController = require('../controllers/testimonies.controllers');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticate, testimonyController.add);

module.exports = router;
