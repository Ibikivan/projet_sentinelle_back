const { asyncHandler } = require("../middlewares/async-handler.middleware");
const sharingsService = require("../services/sharings.services");

const addSharing = asyncHandler(async (req, res) => {
    const { subjectId } = req.query;
    const sharing = await sharingsService.addSharing(subjectId, req.user.id, req.body);
    res.status(201).json({
        message: "Sharing added",
        data: sharing
    });
});

const getSharingsBySubject = asyncHandler(async (req, res) => {
    const { subjectId } = req.query;
    const sharings = await sharingsService.getSharingsBySubject(subjectId, req.user.id);
    res.status(200).json({
        message: "Sharings retrieved",
        data: sharings
    });
});

const getSharingById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sharing = await sharingsService.getSharingById(id, req.user.id);
    res.status(200).json({
        message: "Sharing retrieved",
        data: sharing
    });
});

const updateSharing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedSharing = await sharingsService.updateSharing(id, req.user.id, req.body);
    res.status(200).json({
        message: "Sharing updated",
        data: updatedSharing
    });
});

const deleteSharing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await sharingsService.deleteSharing(id, req.user.id);
    res.sendStatus(204);
});

const getUserSharings = asyncHandler(async (req, res) => {
    const sharings = await sharingsService.getUserSharings(req.user.id);
    res.status(200).json({
        message: "User sharings retrieved",
        data: sharings
    });
});

module.exports = {
    addSharing,
    getSharingsBySubject,
    getSharingById,
    updateSharing,
    deleteSharing,
    getUserSharings
};
