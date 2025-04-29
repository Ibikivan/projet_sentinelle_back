const usersServices = require('../services/users.services');

async function registerUser(req, res, next) {
    try {
        const user = await usersServices.createUser(req.body);
        res.status(201).json({message: 'User created successfully', user});
    } catch (error) {
        console.error('Error creating user:', error);
        next(error);
    }
}

async function getAllUsers(req, res, next) {
    try {
        const users = await usersServices.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        next(error);
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await usersServices.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const user = await usersServices.updateUser(req.params.id, req.body);
        res.status(200).json({message: 'User updated successfully', user});
    } catch (error) {
        console.error('Error updating user:', error);
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const user = await usersServices.deleteUser(req.params.id);
        res.status(200).json({message: 'User deleted successfully', user});
    } catch (error) {
        console.error('Error deleting user:', error);
        next(error);
    }
}

module.exports = {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
