const authServices = require('../services/auth.services');
const dotenv = require('dotenv');
dotenv.config();


async function login(req, res, next) {
    try {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: 'Phone number and password are required' });
        }

        const token = await authServices.login(phoneNumber, password);

        if (!token) {
            return res.status(401).json({ message: 'Invalid credentials' });
        };

        const ttlHours = parseInt(process.env.JWT_EXPIRE_IN, 10) || 1;
        res.cookie('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: ttlHours * 60 * 60 * 1000, // 1 day
            sameSite: 'lax', // CSRF protection
            path: '/api'
        });

        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        next(error);
    }
};

async function requestToChangePhoneNumber(req, res, next) {
    try {
        const { newPhoneNumber } = req.body;
        if (!newPhoneNumber) return res.status(400).json({ message: 'New phone number is required' });

        const otp = await authServices.requestToChangePhoneNumber(req.user.id, newPhoneNumber, req.ip);
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        console.error('Error during OTP request:', error);
        next(error);
    }
};

async function verifyOtp(req, res, next) {
    try {
        const { otpCode } = req.body;
        if (!otpCode) return res.status(400).json({ message: 'OTP code is required' });
        const otp = await authServices.verifyPhoneNumberOtp(req.user.id, otpCode);

        res.clearCookie('session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api'
        });
        res.status(200).json({ message: 'Phone number updated', otp });
    } catch (error) {
        next(error);
    }
};

async function changePassword(req, res, next) {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Old and new passwords are required' });
        const result = await authServices.changePassword(req.user.id, oldPassword, newPassword);

        res.clearCookie('session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api'
        });
        res.status(200).json({ message: 'Password changed', result });
    } catch (error) {
        next(error)
    }
};

async function forgotPassword(req, res, next) {
    try {
        const { phoneNumber } = req.body;
        if ( !phoneNumber ) res.status(400).json("Requester's phone number is required");

        const otp = await authServices.requestToResetForgottenPassword(phoneNumber, req.ip);
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        next(error)
    }
}

async function verifyPasswordOtp(req, res, next) {
    try {
        const { phoneNumber, otpCode } = req.body;
        if (!phoneNumber || !otpCode) res.status(400).json({ message: "Requester's phone number and otp code are required" });

        const otp = await authServices.verifyPasswordOtp(phoneNumber, otpCode);
        res.status(200).json({ message: 'Otp verified successfully', otp });
    } catch (error) {
        next(error)
    }
};

async function resetPassword(req, res, next) {
    try {
        const { otpId, newPassword } = req.body;
        if (!otpId || !newPassword) res.status(400).json({ message: "Requester's phone number and otp id are requierd" });

        const user = await authServices.resetPassword(otpId, newPassword);

        res.clearCookie('session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api'
        });
        res.status(200).json({ message: "Password reseted seccessfully", user });
    } catch (error) {
        next(error)
    }
};

async function logout(req, res, next) {
    try {
        const user = await authServices.logout(req.user.id);

        res.clearCookie('session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api'
        });
        res.status(200).json({ message: 'User successfully logged out', user });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    login,
    requestToChangePhoneNumber,
    verifyOtp,
    changePassword,
    forgotPassword,
    verifyPasswordOtp,
    resetPassword,
    logout
};
