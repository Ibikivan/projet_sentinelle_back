const { path, request } = require('../../app');
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
        const userId = req.user.id;
        const ipAdress = req.ip;

        if (!newPhoneNumber) {
            return res.status(400).json({ message: 'New phone number is required' });
        }

        const otpData = await authServices.requestToChangePhoneNumber(userId, newPhoneNumber, ipAdress);
        res.status(200).json({ message: 'OTP sent successfully', otpData });
    } catch (error) {
        console.error('Error during OTP request:', error);
        next(error);
    }
};

module.exports = {
    login,
    requestToChangePhoneNumber
};
