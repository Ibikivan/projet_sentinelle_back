const { PrayerSubject } = require("../model");

async function createSubject(subject, transaction=null) {
    return await PrayerSubject.create(subject, { transaction });
};

async function getAllPublicSubjects(params={}) {
    let where = {};
    let config = {
        order: [['createdAt', 'DESC']]
    };

    if (params.isPublic) where.isPublic = params.isPublic;
    if (params.state) where.state = params.state;

    if (params.limit) config.limit = params.limit;
    if (params.offset) config.offset = params.offset;
    if (params.order) config.order = [['createdAt', params.order]];

    const result = await PrayerSubject.findAndCountAll({
        where,
        ...config
    });
    return {
        subjects: result.rows,
        pagination: {
            total: result.count,
            page: params.limit ? Math.floor((params.offset || 0) / params.limit) + 1 : 1,
            limit: parseInt(params.limit, 10) || result.count,
            totalPages: params.limit ? Math.ceil(result.count / params.limit) : 1
        }
    };
};

async function getAllCurrentUserSubjects(userId, params={}) {
    let where = { userId: userId };
    let config = {
        order: [['createdAt', 'DESC']]
    };

    if (params.isPublic) where.isPublic = params.isPublic;
    if (params.state) where.state = params.state;

    if (params.limit) config.limit = params.limit;
    if (params.offset) config.offset = params.offset;
    if (params.order) config.order = [['createdAt', params.order]];

    const result = await PrayerSubject.findAndCountAll({
        where,
        ...config
    });
    return {
        subjects: result.rows,
        pagination: {
            total: result.count,
            page: params.limit ? Math.floor((params.offset || 0) / params.limit) + 1 : 1,
            limit: parseInt(params.limit, 10) || result.count,
            totalPages: params.limit ? Math.ceil(result.count / params.limit) : 1
        }
    };
};

async function getSubjectById(id) {
    return await PrayerSubject.findByPk(id);
}

async function getOnePublicSubject(id) {
    return await PrayerSubject.findOne({ where: { id, isPublic: true } });
};

async function getOneCurrentUserSubject(id, userId) {
    return await PrayerSubject.findOne({ where: { id, userId } });
};

async function updateCurrentUserSubject(id, userId, data, transaction=null) {
    const [affectedRows] = await PrayerSubject.update(data, {
        where: { id, userId },
        transaction
    });
    if (affectedRows === 0) return null;
    return await PrayerSubject.findOne({ where: { id, userId }, transaction });
};

async function deleteCurrentUserSubject(id, userId, transaction=null) {
    return await PrayerSubject.destroy({
        where: { id, userId },
        transaction
    })
}

module.exports = {
    createSubject,
    getAllPublicSubjects,
    getAllCurrentUserSubjects,
    getSubjectById,
    getOnePublicSubject,
    getOneCurrentUserSubject,
    updateCurrentUserSubject,
    deleteCurrentUserSubject,
};
