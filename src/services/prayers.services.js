const { sequelize } = require("../model");
const prayersRepository = require("../repositories/prayers.repositories");
const usersRepository = require("../repositories/users.repositories");
const { NotFoundError, ValidationError, AuthentificationError } = require("../utils/errors.classes");
const { getUserAndSubject } = require("../utils/functions");

async function createSubject(data, userId) {
    return await sequelize.transaction(async (transaction) => {

        if (!data.title) throw new ValidationError('Subject must have a title');
        const user = await usersRepository.getUserById(userId);
        if (!user) throw new AuthentificationError('User data is missing');

        const subjectData = {
            title: data.title,
            description: data.description,
            userId: user.id
        }

        return await prayersRepository.createSubject(subjectData, transaction);
    });
};

async function getAllPublicSubjects() {
    return await prayersRepository.getAllPublicSubjects();
};

async function getAllCurrentUserSubjects(userId) {
    const user = await usersRepository.getUserById(userId);
    if (!user) throw new AuthentificationError('User data is missing');

    return await prayersRepository.getAllCurrentUserSubjects(user.id);
};

async function getOnePublicSubject(id) {
    const subject = await prayersRepository.getOnePublicSubject(id);
    if (!subject) throw new NotFoundError(`Subject '${id}' not found`)
    return subject;
};

async function getOneCurrentUserSubject(id, userId) {
    const { subject } = await getUserAndSubject(id, userId);
    return subject;
};

async function updateCurrentUserSubject(id, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(id, userId);

        if (!data.title && !data.description) throw new ValidationError('either title nor description is require');

        await subject.update(data, { transaction });
        return subject;
    })
};

async function deleteCurrentUserSubject(id, userId) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(id, userId);
        await subject.destroy({ transaction });
    })
};

async function updatePrayerVisibility(id, userId, visibility) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(id, userId);

        if (visibility !== 'public' && visibility !== 'private') throw new ValidationError(`Visibility '${visibility}' must be 'public' or 'private'`);

        const vis = visibility === 'public';
        subject.isPublic = vis;
        await subject.save({ transaction });

        return subject;
    });
};

async function updatePrayerState(id, userId, state) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(id, userId);
        const validStates = ['active', 'close_exhausted', 'close_expired'];

        if (!validStates.includes(state)) throw new ValidationError(`Invalde state: '${state}'`);
        subject.state = state;
        subject.save({ transaction });

        return subject;
    });
};

async function handleTestimony(id, userId, action, data) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(id, userId);
        const validActions = ['add', 'remove'];

        if (!data.testimonyId || typeof data.testimonyId !== 'number') 
            throw new ValidationError(`Testimony id required as a number ${data.testimonyId}`);
        if (!validActions.includes(action)) throw new ValidationError(`Invalde action: '${action}'`);
        
        if (action === "add") {
            await subject.setTestimony(data.testimonyId, { transaction });
        } else if (action === "remove") {
            await subject.setTestimony(null, { transaction });
        };

        return subject;
    });
};

async function handleSubjectCrewing(id, userId, action, data) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(id, userId);
        const validActions = ['add', 'remove'];

        if (!data.prayerCrewId || typeof data.prayerCrewId !== 'number') 
            throw new ValidationError(`PrayerCrew id required as a number ${data.prayerCrewId}`);
        if (!validActions.includes(action)) throw new ValidationError(`Invalde action: '${action}'`);

        if (action === "add") {
            await subject.addPrayerCrew(data.prayerCrewId, { transaction })
        } else if (action === "remove") {
            await subject.removePrayerCrew(data.prayerCrewId, { transaction })
        };

        return subject;
    });
};

async function handleSubjectCommunitying(id, userId, action, data) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(id, userId);
        const validActions = ['add', 'remove'];

        if (!data.communityId || typeof data.communityId !== 'number') 
            throw new ValidationError(`Community id required as a number ${data.communityId}`);
        if (!validActions.includes(action)) throw new ValidationError(`Invalde action: '${action}'`);

        if (action === "add") {
            await subject.addCommunity(data.communityId, { transaction });
        } else if (action === "remove") {
            await subject.removeCommunity(data.communityId, { transaction });
        };

        return subject;
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
