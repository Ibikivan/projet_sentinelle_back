const usersRepository = require('../repositories/users.repositories');
const prayersRepository = require('../repositories/prayers.repositories');
const { AuthentificationError, NotFoundError } = require('./errors.classes');

async function getUserAndSubject(id, userId) {
    const user = await usersRepository.getUserById(userId);
    if (!user) throw new AuthentificationError('User data is missing');

    const subject = await prayersRepository.getOneCurrentUserSubject(id, user.id);
    if (!subject) throw new NotFoundError(`Subject '${id}' not found for the user '${user.id}'`);

    return {user, subject};
};

module.exports = {
    getUserAndSubject,
}
