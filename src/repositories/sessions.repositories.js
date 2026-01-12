const { PrayerSession } = require("../model");
const { buildQuery, formatPaginatedResult, Op } = require("../utils/queryBuilder");

/**
 * Generic query method for prayer sessions with filtering, sorting, pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated sessions result
 */
async function getSessions(params = {}) {
    const queryOptions = buildQuery(PrayerSession, params, {
        allowedFilters: ['status', 'userId', 'subjectId', 'cityId'],
        allowedSorts: ['createdAt', 'updatedAt', 'status', 'cityId'],
        allowedIncludes: [
            { association: 'subject', attributes: ['id', 'title', 'state', 'description'] },
            { association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { association: 'location', attributes: ['id', 'name', 'countryCode', 'countryName', 'continent', 'continentName'] }
        ],
        defaultSort: 'createdAt',
        defaultOrder: 'DESC',
    });

    // Auto-include associations for sessions
    queryOptions.include = [
        { association: 'subject', attributes: ['id', 'title', 'state', 'description'] },
        { association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { association: 'location', attributes: ['id', 'name', 'countryCode', 'countryName', 'continent', 'continentName'], where: {} }
    ];

    // Country/Continent filters via location
    const locationWhere = queryOptions.include[2].where;
    if (params.countryCode) locationWhere.countryCode = params.countryCode;
    if (params.countryName) locationWhere.countryName = params.countryName;
    if (params.continent) locationWhere.continent = params.continent;
    if (params.continentName) locationWhere.continentName = params.continentName;

    // Remove empty where on location
    if (Object.keys(locationWhere).length === 0) {
        delete queryOptions.include[2].where;
    }

    const result = await PrayerSession.findAndCountAll(queryOptions);
    return formatPaginatedResult(result, queryOptions._meta, 'sessions');
}

async function getSessionById(id) {
    return await PrayerSession.findByPk(id);
}

async function getSessionByIdWithAssociations(id) {
    return await PrayerSession.findByPk(id, {
        include: [
            { association: 'subject', attributes: ['id', 'title', 'state', 'description'] },
            { association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { association: 'location', attributes: ['id', 'name', 'countryCode', 'lat', 'lng'] }
        ]
    });
}

async function getSessionsByUserId(userId, config = {}) {
    return await PrayerSession.findAll({
        where: { userId, ...config }
    });
}

async function getSessionsBySubjectId(subjectId, config = {}) {
    return await PrayerSession.findAll({
        where: { subjectId, ...config }
    });
}

async function getSessionsByLocation(latitude, longitude, radius = 0.01) {
    return await PrayerSession.findAll({
        where: {
            latitude: { [Op.between]: [latitude - radius, latitude + radius] },
            longitude: { [Op.between]: [longitude - radius, longitude + radius] }
        }
    });
}

async function createSession(session, transaction = null) {
    return await PrayerSession.create(session, { transaction });
}

async function updateSession(id, session, transaction = null) {
    const [updated] = await PrayerSession.update(session, {
        where: { id },
        transaction
    });
    return updated;
}

async function completeSession(id, transaction = null) {
    const [updated] = await PrayerSession.update(
        { status: 'completed' },
        { where: { id }, transaction }
    );
    return updated;
}

async function deleteSession(id, transaction = null) {
    return await PrayerSession.destroy({
        where: { id },
        transaction
    });
}

async function restoreSession(id, transaction = null) {
    return await PrayerSession.restore({
        where: { id },
        transaction
    });
}

async function getSessionsCount(options = {}) {
    return await PrayerSession.count(options);
}

module.exports = {
    getSessions,
    getSessionById,
    getSessionByIdWithAssociations,
    getSessionsByUserId,
    getSessionsBySubjectId,
    getSessionsByLocation,
    createSession,
    updateSession,
    completeSession,
    deleteSession,
    restoreSession,
    getSessionsCount,
    // Backward compatibility
    getAllSessions: getSessions,
    getAllSessionsWithFilters: getSessions,
    getActiveSessions: (opts) => getSessions({ ...opts, status: 'active' }),
    getCompletedSessions: (opts) => getSessions({ ...opts, status: 'completed' }),
};
