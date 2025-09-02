const usersRepository = require('../repositories/users.repositories');
const prayersRepository = require('../repositories/prayers.repositories');
const sessionsRepository = require('../repositories/sessions.repositories')
const { AuthentificationError, NotFoundError } = require('./errors.classes');

async function getUserAndSubject(id, userId) {
    const user = await usersRepository.getUserById(userId);
    if (!user) throw new AuthentificationError('User data is missing');

    // Trouver un moyen d'accepter la requette si le sujet est publique...
    const subject = await prayersRepository.getOneCurrentUserSubject(id, user.id);
    if (!subject) throw new NotFoundError(`Subject '${id}' not found for the user '${user.id}'`);

    return {user, subject};
};

async function getCurrentUserSession(id, userId) {
    const session = await sessionsRepository.getSessionById(id);
    if (!session || session.userId !== userId) throw new NotFoundError(`No session ${id} found for the current user`);
    return session;
};

module.exports = {
    getUserAndSubject,
    getCurrentUserSession,
}
