const { asyncHandler } = require('../middlewares/async-handler.middleware');
const prayerServices = require('../services/prayers.services');

const createSubject = asyncHandler(async (req, res) => {
    const subject = await prayerServices.createSubject(req.body, req.user.id);
    res.status(201).json({
        message: 'Prayer subject created',
        data: subject
    });
});

const getAllPublicSubjects = asyncHandler(async (req, res) => {
    const subjects = await prayerServices.getAllPublicSubjects();
    res.status(200).json({
        message: 'Subjects retrieved',
        data: subjects
    });
});

const getAllCurrentUserSubjects = asyncHandler(async (req, res) => {
    const subjects = await prayerServices.getAllCurrentUserSubjects(req.user.id);
    res.status(200).json({
        message: 'Subjects retrieved',
        data: subjects
    });
});

const getOnePublicSubject = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subject = await prayerServices.getOnePublicSubject(id);
    res.status(200).json({
        message: 'Subject retrieved',
        data: subject
    });
});

const getOneCurrentUserSubject = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subject = await prayerServices.getOneCurrentUserSubject(id, req.user.id);
    res.status(200).json({
        message: 'Subject retrieved',
        data: subject
    });
});

const updateCurrentUserSubject = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subject = await prayerServices.updateCurrentUserSubject(id, req.user.id, req.body);
    res.status(200).json({
        message: 'Subject updated',
        data: subject
    });
});

const deleteCurrentUserSubject = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await prayerServices.deleteCurrentUserSubject(id, req.user.id);
    res.status(204).send();
});

const updatePrayerVisibility = asyncHandler(async (req, res) => {
    const { id, visibility } = req.params;
    const subject = await prayerServices.updatePrayerVisibility(id, req.user.id, visibility);
    res.status(200).json({
        message: 'Visibility updated',
        data: subject
    });
});

const updatePrayerState = asyncHandler(async (req, res) => {
    const { id, state } = req.params;
    const subject = await prayerServices.updatePrayerState(id, req.user.id, state);
    res.status(200).json({
        message: 'State updated',
        data: subject
    });
});

const handleTestimony = asyncHandler(async (req, res) => {
    const { id, action } = req.params;
    const subject = await prayerServices.handleTestimony(id, req.user.id, action, req.body);
    res.status(200).json({
        message: `Testimony ${action}d`,
        data: subject
    });
});

const handleSubjectCrewing = asyncHandler(async (req, res) => {
    const { id, action } = req.params;
    const subject = await prayerServices.handleSubjectCrewing(id, req.user.id, action, req.body);
    res.status(200).json({
        message: `Prayer ${action}ed`,
        data: subject
    });
});

const handleSubjectCommunitying = asyncHandler(async (req, res) => {
    const { id, action } = req.params;
    const subject = await prayerServices.handleSubjectCommunitying(id, req.user.id, action, req.boby);
    res.status(200).json({
        message: `Prayer ${action}d`,
        data: subject
    });
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
