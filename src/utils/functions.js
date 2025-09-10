const usersRepository = require('../repositories/users.repositories');
const prayersRepository = require('../repositories/prayers.repositories');
const sessionsRepository = require('../repositories/sessions.repositories')
const { AuthentificationError, NotFoundError } = require('./errors.classes');
const fs = require('fs');

async function getUserAndSubject(id, userId) {
    const user = await usersRepository.getUserById(userId);
    if (!user) throw new AuthentificationError('User data is missing');

    const subject = await prayersRepository.getSubjectById(id);
    if (!subject) throw new NotFoundError(`Subject '${id}' not found or private`);

    if (!subject.isPublic && subject.userId !== user.id)
        throw new NotFoundError(`Can't retriev someone's private subject`);

    return {user, subject};
};

async function getCurrentUserSession(id, userId) {
    const session = await sessionsRepository.getSessionById(id);
    if (!session || session.userId !== userId)
        throw new NotFoundError(`No session ${id} found for the current user`);
    return session;
};

function createFileIfDosntExist(path) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

module.exports = {
    getUserAndSubject,
    getCurrentUserSession,
    createFileIfDosntExist
}
