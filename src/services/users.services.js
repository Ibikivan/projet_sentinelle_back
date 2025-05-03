const { sequelize } = require('../model');
const usersRepositories = require('../repositories/users.repositories');
const { formatUserPhoneNumber } = require('../utils');
const bcrypt = require('bcrypt');
const { ValidationError, NotFoundError } = require('../utils/errors.classes');

async function createUser(user) {
    return await sequelize.transaction(async (transaction) => {
        if (user.password.length < 8) throw new ValidationError('Password must be at least 8 characters');
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

async function getUserDetails(id) {
    const user = await usersRepositories.getUserDetails(id);
    return user;
}

async function getUserById(id) {
    const user = await usersRepositories.getUserById(id);
    console.log('Targeted ID', user)
    return user;
}

async function updateUser(id, user) {
    return await sequelize.transaction(async (transaction) => {
        const userExists = await usersRepositories.getUserById(id);
        if (!userExists) {
            throw new NotFoundError(`User with ID ${id} not found`);
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

async function adminUpdateUser(id, user) {
    return await sequelize.transaction(async (transaction) => {
        const userExists = await usersRepositories.getUserById(id);
        if (!userExists) {
            throw new NotFoundError(`User with ID ${id} not found`);
        }
        const newUser = {
            role: user.role,
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
            throw new NotFoundError(`User with ID ${id} not found`);
        }
        const deleted = await usersRepositories.deleteUser(id, transaction);
        return deleted;
    });
}

module.exports = {
    createUser,
    getAllUsers,
    getUserDetails,
    getUserById,
    updateUser,
    adminUpdateUser,
    deleteUser,
};
