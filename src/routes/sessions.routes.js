const express = require('express');
const sessionsController = require('../controllers/sessions.controllers');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticate, sessionsController.startSession);
router.get('/user/me', authenticate, sessionsController.getUserSessions);
router.get('/all', authenticate, sessionsController.getAllSessions); // filter, pagination, etc... in query params
router.get('/', authenticate, sessionsController.getSessionsBySubject); // subjectId in query params
router.get('/:id', authenticate, sessionsController.getSessionById);
router.patch('/:id', authenticate, sessionsController.updateSession);
router.delete('/:id', authenticate, sessionsController.endSession);

module.exports = router;
