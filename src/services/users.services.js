const { sequelize } = require('../model');
const usersRepositories = require('../repositories/users.repositories');
const { formatUserPhoneNumber } = require('../utils');
const bcrypt = require('bcrypt');

async function createUser(user) {
    return await sequelize.transaction(async (transaction) => {
        formatUserPhoneNumber(user);
        user.password = await bcrypt.hash(user.password, 10);
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
        const newUser = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
            cityId: user.cityId,
        }
        const updated = await usersRepositories.updateUser(id, newUser, transaction);
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
