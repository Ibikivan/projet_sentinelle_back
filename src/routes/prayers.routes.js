const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const prayerController = require('../controllers/prayers.controller');

const router = express.Router();

router.post('/', authenticate, prayerController.createSubject);
router.get('/publics', authenticate, prayerController.getAllPublicSubjects);
router.get('/current-user-all', authenticate, prayerController.getAllCurrentUserSubjects);
router.get('/:id', authenticate, prayerController.getOnePublicSubject);
router.get('/current-user:id', authenticate, prayerController.getOneCurrentUserSubject);
router.put('/:id', authenticate, prayerController.updateCurrentUserSubject);
router.delete('/:id', authenticate, prayerController.deleteCurrentUserSubject);
router.patch('/visibility/:id/:visibilty', authenticate, prayerController.updatePrayerVisibility); // Need param 'visibilty'
router.patch('/state/:id/:state', authenticate, prayerController.updatePrayerState); // Need param 'state'
router.patch('/testimony/:id/:action', authenticate, prayerController.handleTestimony); // Need param 'action'
router.patch('/crew/:id/:action', authenticate, prayerController.handleSubjectCrewing); // Need param 'action'
router.patch('/community/:id/:action', authenticate, prayerController.handleSubjectCommunitying); // Need param 'action'

module.exports = router;
