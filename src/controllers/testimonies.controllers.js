const { asyncHandler } = require("../middlewares/async-handler.middleware");
const testimoniesServices = require("../services/testimonies.services");

const addTestimony = asyncHandler(async (req, res) => {
    const testimony = await testimoniesServices.addTestimony(req.params.subjectId, req.user.id, req.body, req.file);
    res.status(201).json({
        message: 'Testimony added',
        data: testimony
    });
});

const getTestimonyBySubject = asyncHandler(async (req, res) => {
    const testimonies = await testimoniesServices.getTestimonyBySubject(req.params.subjectId, req.user.id)
    res.status(200).json({
        message: 'Testimonies retrived',
        data: testimonies
    });
});

const updateTestimony = asyncHandler(async (req, res) => {
    const testimony = await testimoniesServices.updateTestimony(req.params.subjectId, req.user.id, req.body, req.file);
    res.status(200).json({
        message: 'Testimony updated',
        data: testimony
    });
});

const deleteTestimony = asyncHandler(async (req, res) => {
    await testimoniesServices.deleteTestimony(req.params.subjectId, req.user.id);
    res.sendStatus(204);
});

module.exports = {
    addTestimony,
    getTestimonyBySubject,
    updateTestimony,
    deleteTestimony,
};
