const { Comment } = require("../model");

async function createComment(data, transaction = null) {
    return await Comment.create(data, { transaction });
};

module.exports = {
    createComment
};
