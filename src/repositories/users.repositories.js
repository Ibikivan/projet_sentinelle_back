const { User } = require("../model");

async function getUserByEmail(email) {
    const user = await User.findOne({
        where: { email: email }
    });
    return user;
}

async function createUser(user, transaction=null) {
    const newUser = await User.create(user, { transaction });
    return newUser;
}

async function getAllUsers() {
    const users = await User.findAll();
    return users;
}

async function getUserDetails(id) {
    // Aggreger toutes les données nécessaire au profil privé
    const user = await User.findByPk(id);
    return user;
}

async function getUserById(id) {
    // Limiter les champs pour le profil publique
    const user = await User.findByPk(id);
    return user;
}

async function updateUser(id, user, transaction=null) {
    const [updated] = await User.update(user, {
        where: { id: id }
    }, { transaction });
    return updated;
}

async function deleteUser(id, transaction=null) {
    const deleted = await User.destroy({
        where: { id: id }
    }, { transaction });
    return deleted;
}

async function getUserByPhoneNumber(phoneNumber) {
    const user = await User.findOne({
        where: { phoneNumber: phoneNumber }
    });
    return user;
}

module.exports = {
    getUserByEmail,
    createUser,
    getAllUsers,
    getUserDetails,
    getUserById,
    updateUser,
    deleteUser,
    getUserByPhoneNumber
}
