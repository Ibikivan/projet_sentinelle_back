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

async function getUserDetails(req, res, next) {
    try {
        const user = await usersServices.getUserDetails(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        next(error);
    }
}

async function deleteProfile(req, res, next) {
    try {
        const user = await usersServices.deleteUser(req.user.id);
        res.clearCookie('session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api'
        });
        res.status(200).json({message: 'Profile deleted successfully', user});
    } catch (error) {
        console.error('Error deleting user:', error);
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
        const user = await usersServices.updateUser(req.user.id, req.body);
        res.status(200).json({message: 'User updated successfully', user});
    } catch (error) {
        console.error('Error updating user:', error);
        next(error);
    }
}

async function adminUpdateUser(req, res, next) {
    try {
        const user = await usersServices.adminUpdateUser(req.params.id, req.body);
        res.status(200).json({message: 'User updated successfully', user});
    } catch (error) {
        console.error('Error updating user:', error);
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const user = await usersServices.deleteUser(req.params.id);
        res.clearCookie('session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api'
        });
        res.status(200).json({message: 'User deleted successfully', user});
    } catch (error) {
        console.error('Error deleting user:', error);
        next(error);
    }
}

async function requestToRestoreUser(req, res, next) {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ message: 'New phone number is required' });

        const otp = await usersServices.requestToRestaureAccount(phoneNumber, req.ip);
        res.status(200).json({message: 'OTP sent successfully', otp});
    } catch (error) {
        console.error('Error during OTP request:', error);
        next(error);
    }
}

async function verifyRestaurationOtp(req, res, next) {
    try {
        const { phoneNumber, otpCode } = req.body;
        if (!phoneNumber || !otpCode) res.status(400).json({ message: "Requester's phone number and otp code are required" });

        const user = await usersServices.validateAccountRestauration(phoneNumber, otpCode);
        res.status(200).json({message: 'Account restaured successfully', user});
    } catch (error) {
        console.error('Error during verification or restauration:', error);
        next(error);
    }
}

module.exports = {
    registerUser,
    getAllUsers,
    getUserDetails,
    deleteProfile,
    getUserById,
    updateUser,
    adminUpdateUser,
    deleteUser,
    requestToRestoreUser,
    verifyRestaurationOtp
};
