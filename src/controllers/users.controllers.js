const { asyncHandler } = require('../middlewares/async-handler.middleware');
const usersServices = require('../services/users.services');

const registerUser = asyncHandler(async (req, res) => {
    const user = await usersServices.createUser(req.body);
    res.status(201).json({message: 'User created', user});
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await usersServices.getAllUsers();
    res.status(200).json(users);
});

const getUserDetails = asyncHandler(async (req, res) => {
    const user = await usersServices.getUserDetails(req.user.id);
    res.status(200).json(user);
});

const deleteProfile = asyncHandler(async (req, res) => {
    const user = await usersServices.deleteUser(req.user.id);
    res.clearCookie('session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api'
    });
    res.status(200).json({message: 'Profile deleted', user});
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await usersServices.getUserById(req.params.id);
    res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await usersServices.updateUser(req.user.id, req.body);
    res.status(200).json({message: 'User updated', user});
});

const adminUpdateUser = asyncHandler(async (req, res) => {
    const user = await usersServices.adminUpdateUser(req.params.id, req.body);
    res.status(200).json({message: 'User updated', user});
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await usersServices.deleteUser(req.params.id);
    res.clearCookie('session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api'
    });
    res.status(200).json({message: 'User deleted', user});
});

const requestToRestoreUser = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: 'New phone number is required' });

    const otp = await usersServices.requestToRestaureAccount(phoneNumber, req.ip);
    res.status(200).json({message: 'OTP sent', otp});
});

const verifyRestaurationOtp = asyncHandler(async (req, res) => {
    const { phoneNumber, otpCode } = req.body;
    if (!phoneNumber || !otpCode) res.status(400).json({ message: "Requester's phone number and otp code are required" });

    const user = await usersServices.validateAccountRestauration(phoneNumber, otpCode);
    res.status(200).json({message: 'Account restaured', user});
});

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
