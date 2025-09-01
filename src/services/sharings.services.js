const { ValidationError, where } = require("sequelize");
const { getUserAndSubject } = require("../utils/functions");
const { sequelize } = require("../model");
const sharingsRepository = require("../repositories/sharings.repositories");
const userRepository = require("../repositories/users.repositories");
const { NotFoundError } = require("../utils/errors.classes");

async function addSharing(subjectId, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        const validTypes = ['text', 'voice'];
        if (!validTypes.includes(data.type)) throw new ValidationError(`Invalid type received: ${data.type}`);
        if (data.type === 'text' && !data.content) throw new ValidationError('Content must be provided for a text sharing');
        if (data.type === 'voice' && !data.voiceUrl) throw new ValidationError('Url must be provided for a voice sharing');

        const { subject, user } = await getUserAndSubject(subjectId, userId);

        let sharingData = {
            type: data.type,
            userId: user.id,
            subjectId: subject.id
        };

        if (data.type === 'text') {
            sharingData.content = data.content;
        } else if (data.type === 'voice') {
            sharingData.voiceUrl = data.voiceUrl;
        };
        
        return await sharingsRepository.createSharing(sharingData, transaction);
    });
};

async function getSharingsBySubject(subjectId, userId) {
    const { subject } = await getUserAndSubject(subjectId, userId);
    return await sharingsRepository.getSharingsBySubject(subject.id);
};

async function getSharingById(id, userId) {
    const user = await userRepository.getUserById(userId);
    const [sharing] = await user.getSharings({ where: { id } });
    if (!sharing) throw new NotFoundError('Sharing not found');
    return sharing;
};

async function updateSharing(id, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        if (data.type !== 'text') throw new ValidationError('Invalid Type received');
        if (!data.content) throw new ValidationError('Content must be provided');

        const user = await userRepository.getUserById(userId, { transaction });
        const [sharing] = await user.getSharings({ where: { id }, transaction });
        if (!sharing) throw new NotFoundError('Sharing not found');

        sharing.content = data.content;
        await sharing.save({ transaction });
        return sharing;
    });
};

async function deleteSharing(id, userId) {
    return await sequelize.transaction(async (transaction) => {
        const user = await userRepository.getUserById(userId, { transaction });
        const [sharing] = await user.getSharings({ where: { id }, transaction });
        if (!sharing) throw new NotFoundError('Sharing not found');
        await sharing.destroy({ transaction });
    });
};

async function getUserSharings(userId) {
    const user = await userRepository.getUserById(userId);
    return await user.getSharings();
};

module.exports = {
    addSharing,
    getSharingsBySubject,
    getSharingById,
    updateSharing,
    deleteSharing,
    getUserSharings
}
