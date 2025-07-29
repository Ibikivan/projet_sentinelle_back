const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const prayersController = require('../controllers/prayers.controller');

const router = express.Router();

// Create a new prayer subject
router.post('/', authenticate, prayersController.createSubject);

// Public subjects (paginated or filterable if needed)
router.get('/publics', authenticate, prayersController.getAllPublicSubjects);

// Current user's subjects
router.get('/current-user/all', authenticate, prayersController.getAllCurrentUserSubjects);
router.get('/current-user/:id', authenticate, prayersController.getOneCurrentUserSubject);

// Single public subject by ID
router.get('/:id', authenticate, prayersController.getOnePublicSubject);

// Update and delete for current user's subject
router.put('/:id', authenticate, prayersController.updateCurrentUserSubject);
router.delete('/:id', authenticate, prayersController.deleteCurrentUserSubject);

// Change visibility (public/private)
router.patch('/visibility/:id/:visibility', authenticate, prayersController.updatePrayerVisibility);

// Change state (active/close\_exhausted/close\_expired)
router.patch('/state/:id/:state', authenticate, prayersController.updatePrayerState);

// Handle testimony: add or remove
router.patch('/testimony/:id/:action', authenticate, prayersController.handleTestimony);

// Manage prayer crew (add or remove)
router.patch('/crew/:id/:action', authenticate, prayersController.handleSubjectCrewing);

// Manage subject communities (add or remove)
router.patch('/community/:id/:action', authenticate, prayersController.handleSubjectCommunitying);

module.exports = router;

