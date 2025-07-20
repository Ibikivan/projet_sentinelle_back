const { asyncHandler } = require('../middlewares/async-handler.middleware');
const prayerServices = require('../services/prayers.services');

const createSubject = asyncHandler(async (req, res) => {
    const subject = await prayerServices.createSubject(req.body, req.user.id);
    res.status(201).json({ message: 'Prayer subject created successfully', subject });
});

const getAllPublicSubjects = asyncHandler(async (req, res) => {
    const subjects = await prayerServices.getAllPublicSubjects();
    res.status(200).json({ message: 'Subjects getted successfully', subjects })
});

const getAllCurrentUserSubjects = asyncHandler(async (req, res) => {
    const subjects = await prayerServices.getAllCurrentUserSubjects(req.user.id);
    res.status(200).json({ message: 'Subjects getted seccessfull', subjects });
});

const getOnePublicSubject = asyncHandler(async (req, res) => {
    const subject = await prayerServices.getOnePublicSubject(req.params.id);
    res.status(200).json({ message: 'Subject getted successfully', subject })
});

const getOneCurrentUserSubject = asyncHandler(async (req, res) => {
    const subject = await prayerServices.getOneCurrentUserSubject(req.params.id, req.user.id);
    res.status(200).json({ message: 'Subject getted', subject });
});

const updateCurrentUserSubject = asyncHandler(async (req, res) => {
    const subject = await prayerServices.updateCurrentUserSubject(req.params.id, req.user.id, req.body);
    res.status(200).json({ message: 'Updated successufully', subject });
});

const deleteCurrentUserSubject = asyncHandler(async (req, res) => {
    const subject = await prayerServices.deleteCurrentUserSubject(req.params.id, req.user.id);
    res.status(200).json({ message: 'deleted successufully', subject });
});

const updatePrayerVisibility = asyncHandler(async (req, res) => {
    const subject = await prayerServices.updatePrayerVisibility(req.params, req.user.id);
    res.status(200).json({ message: 'Updated successfully', subject });
});

const updatePrayerState = asyncHandler(async (req, res) => {
    const subject = await prayerServices.updatePrayerState(req.params, req.user.id);
    res.status(200).json({ message: 'Updated successfully', subject });
});

const handleTestimony = asyncHandler(async (req, res) => {
    const subject = await prayerServices.handleTestimony(req.params, req.user.id, req.body);
    res.status(200).json({ message: 'Updated successfully', subject });
});

const handleSubjectCrewing = asyncHandler(async (req, res) => {
    const subject = await prayerServices.handleSubjectCrewing(req.params, req.user.id, req.body);
    res.status(200).json({ message: 'Updated seccessfully', subject });
});

const handleSubjectCommunitying = asyncHandler(async (req, res) => {
    const subject = await prayerServices.handleSubjectCommunitying(req.params, req.user.id, req.boby);
    res.status(200).json({ message: 'Updated successfully', subject });
});

module.exports = {
    createSubject,
    getAllPublicSubjects,
    getAllCurrentUserSubjects,
    getOnePublicSubject,
    getOneCurrentUserSubject,
    updateCurrentUserSubject,
    deleteCurrentUserSubject,
    updatePrayerVisibility,
    updatePrayerState,
    handleTestimony,
    handleSubjectCrewing,
    handleSubjectCommunitying,
};
