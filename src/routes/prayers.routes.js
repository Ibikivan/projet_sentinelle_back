const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const prayerController = require('../controllers/prayers.controller');

const router = express.Router();

// Create a new prayer subject
router.post('/', authenticate, prayerController.createSubject);

// Public subjects (paginated or filterable if needed)
router.get('/publics', authenticate, prayerController.getAllPublicSubjects);

// Current user's subjects
router.get('/current-user/all', authenticate, prayerController.getAllCurrentUserSubjects);
router.get('/current-user/:id', authenticate, prayerController.getOneCurrentUserSubject);

// Single public subject by ID
router.get('/:id', authenticate, prayerController.getOnePublicSubject);

// Update and delete for current user's subject
router.put('/:id', authenticate, prayerController.updateCurrentUserSubject);
router.delete('/:id', authenticate, prayerController.deleteCurrentUserSubject);

// Change visibility (public/private)
router.patch('/visibility/:id/:visibility', authenticate, prayerController.updatePrayerVisibility);

// Change state (active/close\_exhausted/close\_expired)
router.patch('/state/:id/:state', authenticate, prayerController.updatePrayerState);

// Handle testimony: add or remove
router.patch('/testimony/:id/:action', authenticate, prayerController.handleTestimony);

// Manage prayer crew (add or remove)
router.patch('/crew/:id/:action', authenticate, prayerController.handleSubjectCrewing);

// Manage subject communities (add or remove)
router.patch('/community/:id/:action', authenticate, prayerController.handleSubjectCommunitying);

module.exports = router;

