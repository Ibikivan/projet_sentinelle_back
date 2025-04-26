const { sequelize } = require('../model');
const usersRepositories = require('../repositories/usersRepositories');

async function createUser(user) {
    return await sequelize.transaction(async (transaction) => {
        const phoneIndex = '+237';

        if (!user.phoneNumber.startsWith(phoneIndex)) {
            user.phoneNumber = phoneIndex + user.phoneNumber;
        }

        const newUser = await usersRepositories.createUser(user, transaction);
        return newUser; 
    });
}

async function getAllUsers() {
    const users = await usersRepositories.getAllUsers();
    return users;
}

async function getUserById(id) {
    const user = await usersRepositories.getUserById(id);
    return user;
}

async function updateUser(id, user) {
    return await sequelize.transaction(async (transaction) => {
        const userExists = await usersRepositories.getUserById(id);
        if (!userExists) {
            throw new Error('User not found');
        }
        const updated = await usersRepositories.updateUser(id, user, transaction);
        return updated;
    });
}

async function deleteUser(id) {
    return await sequelize.transaction(async (transaction) => {
        const userExists = await usersRepositories.getUserById(id);
        if (!userExists) {
            throw new Error('User not found');
        }
        const deleted = await usersRepositories.deleteUser(id, transaction);
        return deleted;
    });
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
