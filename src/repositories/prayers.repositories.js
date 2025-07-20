const { PrayerSubject } = require("../model");

async function createSubject(subject, transaction=null) {
    return await PrayerSubject.create(subject, { transaction });
};

async function getAllPublicSubjects() {
    return await PrayerSubject.findAll({ where: { isPublic: true } });
};

async function getAllCurrentUserSubjects(userId) {
    return await PrayerSubject.findAll({ where: { userId } })
}

async function getOnePublicSubject(id) {
    return await PrayerSubject.findByPk(id, { where: { isPublic: true } });
};

async function getOneCurrentUserSubject(id, userId) {
    return await PrayerSubject.findOne({ where: { id, userId } });
};

async function updateCurrentUserSubject(id, userId, data, transaction=null) {
    return await PrayerSubject.update(data, {
        where: { id, userId },
        transaction
    });
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
    getOnePublicSubject,
    getOneCurrentUserSubject,
    updateCurrentUserSubject,
    deleteCurrentUserSubject,
};
