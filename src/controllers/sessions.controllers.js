const { asyncHandler } = require('../middlewares/async-handler.middleware');
const sessionServices = require('../services/sessions.services');

const startSession = asyncHandler(async (req, res) => {
    const session = await sessionServices.startSession(req.user.id, req.body);
    res.status(201).json({
        message: 'Session started',
        data: session
    });
});

const getUserSessions = asyncHandler(async (req, res) => {
    const sessions = await sessionServices.getUserSessions(req.user.id, req.query);
    res.status(200).json({
        message: 'Sessions retrieved',
        data: sessions
    });
});

const getSessionsBySubject = asyncHandler(async (req, res) => {
    const sessions = await sessionServices.getSessionsBySubject(req.query);
    res.status(200).json({
        message: 'Sessions retrieved',
        data: sessions
    });
});

const getSessionById = asyncHandler(async (req, res) => {
    const session = await sessionServices.getSessionById(req.params.id);
    res.status(200).json({
        message: 'Session retrieved',
        data: session
    });
});

const getAllSessions = asyncHandler(async (req, res) => {
    const sessions = await sessionServices.getAllSessions(req.query);
    res.status(200).json({
        message: 'Sessions retrieved',
        data: sessions
    });
});

const updateSession = asyncHandler(async (req, res) => {
    const session = await sessionServices.updateSession(req.params.id, req.user.id, req.body);
    res.status(200).json({
        message: 'Session updated',
        data: session
    });
});

const endSession = asyncHandler(async (req, res) => {
    await sessionServices.endSession(req.params.id, req.user.id);
    res.sendStatus(204);
});

module.exports = {
    startSession,
    getUserSessions,
    getSessionsBySubject,
    getSessionById,
    getAllSessions,
    updateSession,
    endSession,
};
