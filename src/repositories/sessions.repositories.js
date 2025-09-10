const { PrayerSession } = require("../model");

async function createSession(session, transaction = null) {
    const newSession = await PrayerSession.create(session, { transaction });
    return newSession;
}

async function getSessionById(id) {
    const session = await PrayerSession.findByPk(id);
    return session;
}

async function getSessionByIdWithAssociations(id) {
    const session = await PrayerSession.findByPk(id, {
        include: [
            { association: 'subject', attributes: ['id', 'title', 'state', 'description'] },
            { association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { association: 'location', attributes: ['id', 'name', 'countryCode', 'lat', 'lng'] }
        ]
    });
    return session;
}

async function getAllSessions(options = {}) {
    const sessions = await PrayerSession.findAll(options);
    return sessions;
}

async function getAllSessionsWithFilters(options = {}) {
    const { Op } = require('sequelize');
    
    // Build the query options
    const queryOptions = {
        include: options.include || [
            { association: 'subject', attributes: ['id', 'title', 'state', 'description'] },
            { association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
            { association: 'location', attributes: ['id', 'name', 'countryCode', 'countryName', 'continent', 'continentName'] }
        ],
        order: options.order || [['createdAt', 'DESC']],
        limit: options.limit || 20,
        offset: options.offset || 0
    };
    
    // Add where clause if provided
    if (options.where && Object.keys(options.where).length > 0) {
        queryOptions.where = options.where;
    }
    
    // Execute the query
    const sessions = await PrayerSession.findAndCountAll(queryOptions);
    
    return {
        sessions: sessions.rows,
        pagination: {
            total: sessions.count,
            page: Math.floor(options.offset / options.limit) + 1,
            limit: options.limit,
            totalPages: Math.ceil(sessions.count / options.limit)
        }
    };
}

async function getSessionsByUserId(userId, config = {}, options = {}) {
    const sessions = await PrayerSession.findAll({
        where: { userId, ...config },
        ...options
    });
    return sessions;
}

async function getSessionsBySubjectId(subjectId, config = {}, options = {}) {
    const sessions = await PrayerSession.findAll({
        where: { subjectId, ...config },
        ...options
    });
    return sessions;
}

async function getSessionsByStatus(status, options = {}) {
    const sessions = await PrayerSession.findAll({
        where: { status },
        ...options
    });
    return sessions;
}

async function getActiveSessions(options = {}) {
    const sessions = await PrayerSession.findAll({
        where: { status: 'active' },
        ...options
    });
    return sessions;
}

async function getCompletedSessions(options = {}) {
    const sessions = await PrayerSession.findAll({
        where: { status: 'completed' },
        ...options
    });
    return sessions;
}

async function getSessionsByLocation(latitude, longitude, radius = 0.01, options = {}) {
    const sessions = await PrayerSession.findAll({
        where: {
            latitude: {
                [require('sequelize').Op.between]: [latitude - radius, latitude + radius]
            },
            longitude: {
                [require('sequelize').Op.between]: [longitude - radius, longitude + radius]
            }
        },
        ...options
    });
    return sessions;
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
        {
            where: { id },
            transaction
        }
    );
    return updated;
}

async function deleteSession(id, transaction = null) {
    const deleted = await PrayerSession.destroy({
        where: { id },
        transaction
    });
    return deleted;
}

async function restoreSession(id, transaction = null) {
    const session = await PrayerSession.restore({
        where: { id },
        transaction
    });
    return session;
}

async function getSessionsCount(options = {}) {
    const count = await PrayerSession.count(options);
    return count;
}

async function getSessionsByDateRange(startDate, endDate, options = {}) {
    const sessions = await PrayerSession.findAll({
        where: {
            createdAt: {
                [require('sequelize').Op.between]: [startDate, endDate]
            }
        },
        ...options
    });
    return sessions;
}

module.exports = {
    createSession,
    getSessionById,
    getSessionByIdWithAssociations,
    getAllSessions,
    getAllSessionsWithFilters,
    getSessionsByUserId,
    getSessionsBySubjectId,
    getSessionsByStatus,
    getActiveSessions,
    getCompletedSessions,
    getSessionsByLocation,
    updateSession,
    completeSession,
    deleteSession,
    restoreSession,
    getSessionsCount,
    getSessionsByDateRange
};
