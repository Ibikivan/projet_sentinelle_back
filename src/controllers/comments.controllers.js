const { asyncHandler } = require("../middlewares/async-handler.middleware");
const commentsService = require("../services/comments.service");

const addComment = asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const comment = await commentsService.addComment(subjectId, req.user.id, req.body);
    res.status(201).json(comment);
});

module.exports = {
    addComment,
};
