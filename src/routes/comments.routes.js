const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const commentsController = require('../controllers/comments.controllers');

const router = express.Router();

router.post('/subjects/:subjectId/comment', authenticate, commentsController.addComment);

module.exports = router;
