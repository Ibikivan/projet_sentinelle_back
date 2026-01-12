const { PrayerSubject } = require("../model");
const { buildQuery, formatPaginatedResult } = require("../utils/queryBuilder");

/**
 * Generic query method for prayer subjects with filtering, sorting, pagination
 * @param {Object} params - Query parameters  
 * @returns {Promise<Object>} Paginated subjects result
 */
async function getSubjects(params = {}) {
    const queryOptions = buildQuery(PrayerSubject, params, {
        allowedFilters: ['isPublic', 'state', 'userId'],
        allowedSorts: ['createdAt', 'title', 'state'],
        searchFields: ['title', 'description'],
        allowedIncludes: [
            { association: 'creator', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'testimony', attributes: ['id', 'title'] },
        ],
        defaultSort: 'createdAt',
        defaultOrder: 'DESC',
    });

    const result = await PrayerSubject.findAndCountAll(queryOptions);
    return formatPaginatedResult(result, queryOptions._meta, 'subjects');
}

async function getSubjectById(id) {
    return await PrayerSubject.findByPk(id);
}

async function getSubjectWithDetails(id) {
    return await PrayerSubject.findByPk(id, {
        include: [
            { association: 'creator', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'testimony' },
            { association: 'prayerCrews', attributes: ['id', 'name'] },
            { association: 'communities', attributes: ['id', 'name'] },
        ]
    });
}

async function getPublicSubjects(params = {}) {
    return await getSubjects({ ...params, isPublic: true });
}

async function getUserSubjects(userId, params = {}) {
    return await getSubjects({ ...params, userId });
}

async function getOnePublicSubject(id) {
    return await PrayerSubject.findOne({ where: { id, isPublic: true } });
}

async function getOneCurrentUserSubject(id, userId) {
    return await PrayerSubject.findOne({ where: { id, userId } });
}

async function createSubject(subject, transaction = null) {
    return await PrayerSubject.create(subject, { transaction });
}

async function updateSubject(id, data, transaction = null) {
    const [affectedRows] = await PrayerSubject.update(data, {
        where: { id },
        transaction
    });
    if (affectedRows === 0) return null;
    return await PrayerSubject.findByPk(id, { transaction });
}

async function deleteSubject(id, transaction = null) {
    return await PrayerSubject.destroy({
        where: { id },
        transaction
    });
}

module.exports = {
    getSubjects,
    getSubjectById,
    getSubjectWithDetails,
    getPublicSubjects,
    getUserSubjects,
    getOnePublicSubject,
    getOneCurrentUserSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    // Backward compatibility aliases
    getAllPublicSubjects: getPublicSubjects,
    getAllCurrentUserSubjects: getUserSubjects,
    updateCurrentUserSubject: updateSubject,
    deleteCurrentUserSubject: deleteSubject,
};
