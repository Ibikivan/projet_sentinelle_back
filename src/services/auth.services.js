const bcrypt = require('bcrypt');
const { sequelize } = require('../model');
const { formatPhoneNumber, generateResetCode } = require('../utils');
const jwtUtil = require('../utils/jwt');
const { sendSMSOTP } = require('../utils/sms.services');
const { sendEmailOTP } = require('../utils/email.services');
const usersRepositories = require('../repositories/users.repositories');
const authRepositories = require('../repositories/auth.repositories');

/**
 * @function login
 * @param {string} phoneNumber 
 * @param {string} password 
 * @returns {string} token
 * @description This function logs in a user by verifying their phone number and password.
 * It retrieves the user from the database, compares the provided password with the stored hashed password,
 * and generates a JWT token if the credentials are valid.
 * @throws {Error} If the user is not found or the password is invalid.
 * @example
 * const token = await login('+237123456789', 'password123');
 * console.log(token); // JWT token
 */
async function login(phoneNumber, password) {
    const currentUser = await usersRepositories.getUserByPhoneNumber(formatPhoneNumber(phoneNumber));

    if (!currentUser || !(await bcrypt.compare(password, currentUser.password))) {
        throw new Error('Invalid credentials');
    }      

    const payload = {
        id: currentUser.id,
        role: currentUser.role
    };
    const token = jwtUtil.sign(payload);
    return token;
};

/**
 * @function requestToChangePhoneNumber
 * @param {number} userId 
 * @param {string} newPhoneNumber 
 * @param {string} ipAdress 
 * @returns {object}
 */
async function requestToChangePhoneNumber(userId, newPhoneNumber, ipAdress) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepositories.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const existingUser = await usersRepositories.getUserByPhoneNumber(formatPhoneNumber(newPhoneNumber));
        if (existingUser) {
            throw new Error('Phone number already in use');
        }

        // génère le otp
        const otpCode = generateResetCode();
        const cleanPhoneNumber = formatPhoneNumber(newPhoneNumber);
        const otpData = {
            userId: userId,
            type: 'PHONE_CHANGE',
            newValue: cleanPhoneNumber,
            otpHash: await bcrypt.hash(otpCode, 10),
            ip: ipAdress,
        }

        // enregistre le otp dans la base de données
        const otp = await authRepositories.createOtp(otpData, transaction);
        
        // envoie le otp par sms
        // await sendSMSOTP(parseInt(cleanPhoneNumber), otpCode);
        await sendEmailOTP(user.email, otpCode, 'Votre code OTP pour la modification du numéro de téléphone');

        return {
            message: 'OTP sent successfully',
            otp
        };
    });
}

module.exports = {
    login,
    requestToChangePhoneNumber,
};
