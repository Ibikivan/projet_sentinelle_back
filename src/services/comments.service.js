const { ValidationError } = require("sequelize");
const { getUserAndSubject } = require("../utils/fonctions");
const { sequelize } = require("../model");
const commentsRepository = require("../repositories/comments.repositories");

async function addComment(subjectId, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        const validTypes = ['text', 'voice'];
        if (validTypes.includes(data.type)) throw new ValidationError('Invalid Type recieved');
        if (type === 'text' && !data.content) throw new ValidationError('Content must be provided for a text comment');
        if (type === 'voice' && !data.voiceUrl) throw new ValidationError('Url must be provided for a voice comment');

        const { subject, user } = getUserAndSubject(subjectId, userId);

        let commentData = {
            type: data.type,
            userId: user.id,
            subjectId: subject.id
        };

        if (data.type === 'text') {
            commentData.content = data.content;
        } else if (data.type === 'voice') {
            commentData.voiceUrl = data.voiceUrl;
        };
        
        const comment = await commentsRepository.createComment(commentData, transaction);
        await subject.addComment(comment, { transaction });

        return comment;
    });
};

module.exports = {
    addComment,
}
