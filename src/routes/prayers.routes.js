const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const prayersController = require('../controllers/prayers.controller');

const router = express.Router();

router.post('/', authenticate, prayersController.createSubject);
router.get('/publics', authenticate, prayersController.getAllPublicSubjects);

router.get('/me/all', authenticate, prayersController.getAllCurrentUserSubjects);
router.get('/:id/me', authenticate, prayersController.getOneCurrentUserSubject);

router.get('/:id', authenticate, prayersController.getOnePublicSubject);

router.put('/:id/me', authenticate, prayersController.updateCurrentUserSubject);
router.delete('/:id/me', authenticate, prayersController.deleteCurrentUserSubject);

router.patch('/:id/visibility/:visibility', authenticate, prayersController.updatePrayerVisibility);
router.patch('/:id/state/:state', authenticate, prayersController.updatePrayerState);
router.patch('/:id/testimony/:action', authenticate, prayersController.handleTestimony);
router.patch('/:id/crew/:action', authenticate, prayersController.handleSubjectCrewing);
router.patch('/:id/community/:action', authenticate, prayersController.handleSubjectCommunitying);

module.exports = router;

