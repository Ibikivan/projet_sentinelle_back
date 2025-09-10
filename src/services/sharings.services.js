const { ValidationError, where } = require("sequelize");
const { getUserAndSubject } = require("../utils/functions");
const { sequelize } = require("../model");
const sharingsRepository = require("../repositories/sharings.repositories");
const userRepository = require("../repositories/users.repositories");
const { NotFoundError, ConflictError } = require("../utils/errors.classes");

async function addSharing(subjectId, userId, data, file) {
    return await sequelize.transaction(async (transaction) => {
        const validTypes = ['text', 'voice'];
        if (!validTypes.includes(data.type)) throw new ValidationError(`Invalid type received: ${data.type}`);
        if (data.type === 'text' && !data.content) throw new ValidationError('Content must be provided for a text sharing');
        if (data.type === 'voice' && !file) throw new ValidationError('A file must be provided for a voice sharing');

        const { subject, user } = await getUserAndSubject(subjectId, userId);

        let sharingData = {
            type: data.type,
            userId: user.id,
            subjectId: subject.id
        };

        if (data.type === 'text') {
            sharingData.content = data.content;
        } else if (data.type === 'voice') {
            sharingData.voiceUrl = file ? `/uploads/${file.fieldname}/${file.filename}` : null;
        };
        
        return await sharingsRepository.createSharing(sharingData, transaction);
    });
};

async function getSharingsBySubject(subjectId, userId, params = {}) {
    const { subject } = await getUserAndSubject(subjectId, userId);
    if (params.limit && parseInt(params.limit, 10) > 100)
        throw new ValidationError('Limit cannot exceed 100');
    return await sharingsRepository.getSharingsBySubject(subject.id, params);
};

async function getSharingById(id, userId) {
    const user = await userRepository.getUserById(userId);
    const [sharing] = await user.getSharings({ where: { id } });
    if (!sharing) throw new NotFoundError('Sharing not found');
    return sharing;
};

async function updateSharing(id, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        if (data.type && data.type !== 'text') throw new ValidationError('Only text sharings can be updated');
        if (!data.content) throw new ValidationError('Content must be provided');

        const user = await userRepository.getUserById(userId, { transaction });
        const [sharing] = await user.getSharings({ where: { id }, transaction });
        if (!sharing) throw new NotFoundError('Sharing not found');
        if (sharing.type === 'voice') throw new ConflictError('Unable to update voice sharing')

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

async function getUserSharings(userId, params = {}) {
    const user = await userRepository.getUserById(userId);
    // Build options for association getter
    const where = {};
    const order = [];
    if (params.type) where.type = params.type;
    const validSortFields = ['createdAt', 'type'];
    if (params.sortBy && validSortFields.includes(params.sortBy)) {
        const sortOrder = params.sortOrder === 'asc' ? 'ASC' : 'DESC';
        order.push([params.sortBy, sortOrder]);
    } else {
        order.push(['createdAt', 'DESC']);
    }
    const limit = params.limit ? parseInt(params.limit, 10) : undefined;
    const page = params.page ? parseInt(params.page, 10) : undefined;
    const offset = limit && page ? (page - 1) * limit : undefined;
    return await user.getSharings({ where, order, limit, offset });
};

module.exports = {
    addSharing,
    getSharingsBySubject,
    getSharingById,
    updateSharing,
    deleteSharing,
    getUserSharings
}
