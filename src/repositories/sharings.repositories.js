const { Sharing } = require("../model");
const { buildQuery, formatPaginatedResult } = require("../utils/queryBuilder");

/**
 * Generic query method for sharings with filtering, sorting, pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated sharings result
 */
async function getSharings(params = {}) {
    const queryOptions = buildQuery(Sharing, params, {
        allowedFilters: ['type', 'userId', 'subjectId'],
        allowedSorts: ['createdAt', 'type'],
        allowedIncludes: [
            { association: 'creator', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'subject', attributes: ['id', 'title'] },
        ],
        defaultSort: 'createdAt',
        defaultOrder: 'DESC',
    });

    const result = await Sharing.findAndCountAll(queryOptions);
    return formatPaginatedResult(result, queryOptions._meta, 'sharings');
}

async function getSharingById(id) {
    return await Sharing.findByPk(id);
}

async function getSharingsBySubject(subjectId, params = {}) {
    return await getSharings({ ...params, subjectId });
}

async function getSharingsByUser(userId, params = {}) {
    return await getSharings({ ...params, userId });
}

async function createSharing(sharing, transaction = null) {
    return await Sharing.create(sharing, { transaction });
}

async function updateSharing(id, data, transaction = null) {
    const [updated] = await Sharing.update(data, {
        where: { id },
        transaction
    });
    if (updated === 0) return null;
    return await Sharing.findByPk(id, { transaction });
}

async function deleteSharing(id, transaction = null) {
    return await Sharing.destroy({
        where: { id },
        transaction
    });
}

module.exports = {
    getSharings,
    getSharingById,
    getSharingsBySubject,
    getSharingsByUser,
    createSharing,
    updateSharing,
    deleteSharing,
};
