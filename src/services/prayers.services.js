const { sequelize } = require("../model");
const prayerRepositories = require("../repositories/prayers.repositories");
const usersRepositories = require("../repositories/users.repositories");
const { NotFoundError, ValidationError, AuthentificationError } = require("../utils/errors.classes");

async function createSubject(data, userId) {
    return await sequelize.transaction(async (transaction) => {

        if (!data.title) throw new ValidationError('Subject must have a title');
        const user = await usersRepositories.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subjectData = {
            title: data.title,
            description: data.description,
            userId: user.id
        }

        return await prayerRepositories.createSubject(subjectData, transaction);
    });
};

async function getAllPublicSubjects() {
    return await prayerRepositories.getAllPublicSubjects();
};

async function getAllCurrentUserSubjects(userId) {
    const user = await usersRepositories.getUserById(userId);
    if (!user) throw new AuthentificationError('User data is missing');

    return await prayerRepositories.getAllCurrentUserSubjects(user.id);
};

async function getOnePublicSubject(id) {
    const subject = await prayerRepositories.getOnePublicSubject(id);
    if (!subject) throw new NotFoundError(`Subject '${id}' not found`)
    return subject;
};

async function getOneCurrentUserSubject(id, userId) {
    const user = await usersRepositories.getUserById(userId);
    if (!user) throw new AuthentificationError('User data is missing');

    const subject = await prayerRepositories.getOneCurrentUserSubject(id, user.id);
    if (!subject) throw new NotFoundError(`Subject '${id}' not found for the user '${user.id}'`)
    return subject;
};

async function updateCurrentUserSubject(id, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepositories.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subject = await prayerRepositories.getOneCurrentUserSubject(id, user.id);
        if (!subject) throw new NotFoundError(`Subject '${id}' not found for the user '${user.id}'`);

        let subjectData;
        if (!data.title && !data.description) throw new ValidationError('No title or description to update');
        if (data.title) subjectData.title = data.title;
        if (data.description) subjectData.description = data.description;

        return await prayerRepositories.updateCurrentUserSubject(id, user.id, subjectData, transaction);  // Voir comment utiliser directement la methode update sur l'objet subject
    })
};

async function deleteCurrentUserSubject(id, userId) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepositories.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subject = await prayerRepositories.getOneCurrentUserSubject(id, user.id);
        if (!subject) throw new NotFoundError(`Subject '${id}' not found for the user '${user.id}'`);

        return await prayerRepositories.deleteCurrentUserSubject(id, user.id, transaction);  // Voir comment utiliser directement la methode destroy sur l'objet subject
    })
};

async function updatePrayerVisibility(params, userId) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepositories.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subject = await prayerRepositories.getOneCurrentUserSubject(params.id, user.id);
        if (!subject) throw new NotFoundError(`Subject '${params.id}' not found for the user '${user.id}'`);
        if (params.visibilty !== 'public' && params.visibilty !== 'private') throw new ValidationError(`Visibility '${params.visibilty}' must be 'public' or 'private'`);
        const value = { isPublic: params.visibilty === 'public' }

        return await prayerRepositories.updateCurrentUserSubject(params.id, user.id, value, transaction);
    });
};

async function updatePrayerState(params, userId) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepositories.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subject = await prayerRepositories.getOneCurrentUserSubject(params.id, user.id);
        if (!subject) throw new NotFoundError(`Subject '${params.id}' not found for the user '${user.id}'`);
        if (
            params.state !== 'active'
            || params.state !== 'close_exhausted'
            || params.state !== 'close_expired'
        ) throw new ValidationError(`Invalde state: '${params.state}'`);
        const value = { state: params.state };

        return await prayerRepositories.updateCurrentUserSubject(params.id, user.id, value, transaction);
    });
};

async function handleTestimony(params, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepositories.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subject = await prayerRepositories.getOneCurrentUserSubject(params.id, user.id);
        if (!subject) throw new NotFoundError(`Subject '${params.id}' not found for the user '${user.id}'`);
        if (!data.testimonyId || typeof data.testimonyId !== 'number') 
            throw new ValidationError(`Testimony id required as a number ${data.testimonyId}`);
        
        if (params.action === "add") {
            const value = { testimonyId: data.testimonyId };
            return await prayerRepositories.updateCurrentUserSubject(params.id, user.id, value, transaction);
        };

        if (params.action === "remove") {
            const value = { testimonyId: null };
            return await prayerRepositories.updateCurrentUserSubject(params.id, user.id, value, transaction);
        };
    });
};

async function handleSubjectCrewing(params, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepositories.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subject = await prayerRepositories.getOneCurrentUserSubject(params.id, user.id);
        if (!subject) throw new NotFoundError(`Subject '${params.id}' not found for the user '${user.id}'`);

        if (!data.prayerCrewId || typeof data.prayerCrewId !== 'number') 
            throw new ValidationError(`PrayerCrew id required as a number ${data.prayerCrewId}`);

        if (params.action === "add") {
            const value = { prayerCrewId: data.prayerCrewId };
            return await prayerRepositories.updateCurrentUserSubject(params.id, user.id, value, transaction);
        };

        if (params.action === "remove") {
            const value = { prayerCrewId: null };
            return await prayerRepositories.updateCurrentUserSubject(params.id, user.id, value, transaction);
        };
    });
};

async function handleSubjectCommunitying(params, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepositories.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subject = await prayerRepositories.getOneCurrentUserSubject(params.id, user.id);
        if (!subject) throw new NotFoundError(`Subject '${params.id}' not found for the user '${user.id}'`);

        if (!data.communityId || typeof data.communityId !== 'number') 
            throw new ValidationError(`Community id required as a number ${data.communityId}`);

        if (params.action === "add") {
            const value = { communityId: data.communityId };
            return await prayerRepositories.updateCurrentUserSubject(params.id, user.id, value, transaction);
        };

        if (params.action === "remove") {
            const value = { communityId: null };
            return await prayerRepositories.updateCurrentUserSubject(params.id, user.id, value, transaction);
        };
    });
};

module.exports = {
    createSubject,
    getAllPublicSubjects,
    getAllCurrentUserSubjects,
    getOnePublicSubject,
    getOneCurrentUserSubject,
    updateCurrentUserSubject,
    deleteCurrentUserSubject,
    updatePrayerVisibility,
    updatePrayerState,
    handleTestimony,
    handleSubjectCrewing,
    handleSubjectCommunitying,
};
