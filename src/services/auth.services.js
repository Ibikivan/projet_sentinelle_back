const bcrypt = require('bcrypt');
const { sequelize } = require('../model');
const { formatPhoneNumber, generateResetCode } = require('../utils');
const jwtUtil = require('../utils/jwt');
const { sendSMSOTP } = require('../utils/sms.services');
const { sendEmailOTP } = require('../utils/email.services');
const usersRepository = require('../repositories/users.repositories');
const authRepository = require('../repositories/auth.repositories');
const {
    AuthentificationError,
    NotFoundError,
    ConflictError,
    ValidationError,
    GoneError,
    TooManyRequestsError
} = require('../utils/errors.classes');

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
    const currentUser = await usersRepository.getUserByPhoneNumber(formatPhoneNumber(phoneNumber));

    if (!currentUser || !(await bcrypt.compare(password, currentUser.password))) {
        throw new AuthentificationError('Invalid credentials');
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
        const user = await usersRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const cleanPhoneNumber = formatPhoneNumber(newPhoneNumber);
        const existingUser = await usersRepository.getUserByPhoneNumber(cleanPhoneNumber);
        if (existingUser) {
            throw new ConflictError('Phone number already in use');
        }

        // génère le otp
        const otpCode = generateResetCode();
        const otpData = {
            userId: userId,
            type: 'PHONE_CHANGE',
            newValue: cleanPhoneNumber,
            otpHash: await bcrypt.hash(otpCode, 10),
            ip: ipAdress,
        }

        // invalide les anciens otps pour le même utilisateur
        await authRepository.invalidateOtps(userId, 'PHONE_CHANGE', transaction);

        // enregistre le otp dans la base de données
        const otp = await authRepository.createOtp(otpData, transaction);
        
        // envoie le otp par sms et email
        // await sendSMSOTP(cleanPhoneNumber, otpCode); // penser à enlever le + de +237 pour que sa marche
        await sendEmailOTP(user.email, otpCode, 'Votre code OTP pour la modification du numéro de téléphone');

        return { id: otp.id, expiresAt: otp.expiresAt };
    });
};

/**
 * @function verifyPhoneNumberOtp
 * @param {number} userId 
 * @param {string} otpCode 
 * @returns {object}
 */
async function verifyPhoneNumberOtp(userId, otpCode) {
    return await sequelize.transaction(async (transaction) => {
        if (!/^\d{6}$/.test(otpCode)) {
            // throw createError(400, 'Invalid OTP format');
            throw new ValidationError('Invalid OTP format');
        };
          
        const otp = await authRepository.getOtpByUserIdAndType(
            userId, 'PHONE_CHANGE',
            { lock: transaction.LOCK.UPDATE }
        );

        if (!otp) throw new NotFoundError('OTP not found');
        if (otp.isVerified) throw new ConflictError('OTP already verified');
        if (otp.expiresAt < new Date()) throw new GoneError('OTP expired');
        if (otp.attempts >= 3) throw new TooManyRequestsError('Maximum attempts exceeded');

        const isValid = await bcrypt.compare(otpCode, otp.otpHash);
        if (!isValid) {
            await authRepository.incrementOtpAttempts(otp.id, transaction);
            throw new AuthentificationError('Invalid OTP');
        };

        // Update the user's phone number
        const newUser = { phoneNumber: otp.newValue, tokenRevokedBefore: new Date() };
        await usersRepository.updateUser(userId, newUser, transaction);

        // Mark the OTP as consumed
        const newOtp = await authRepository.consumeOtp(otp.id, transaction);

        return { id: otp.id, verifiedAt: newOtp.verifiedAt };
    });
}

/**
 * @function changePassword
 * @param {number} userId 
 * @param {string} oldPassword 
 * @param {string} newPassword 
 * @returns {object}
 */
async function changePassword(userId, oldPassword, newPassword) {
    return await sequelize.transaction(async (transaction) => {
        if (newPassword.length < 8) throw new ValidationError('Password must be at least 8 characters');

        const user = await usersRepository.getUserById(userId);
        if (!user) throw new NotFoundError(`User with ID ${userId} not found`);

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) throw new AuthentificationError('Invalid current password');
        if (await bcrypt.compare(newPassword, user.password)) throw new ValidationError('New password must be different from the old one');

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const newUser = { password: hashedNewPassword, tokenRevokedBefore: new Date() };
        const updatedUser = await usersRepository.updateUser(user.id, newUser, transaction);

        return updatedUser;
    });
};

/**
 * @function requestToResetForgottenPassword
 * @param {string} phoneNumber 
 * @param {string} ipAdress 
 * @returns {object}
 */
async function requestToResetForgottenPassword(phoneNumber, ipAdress) {
    return await sequelize.transaction(async (transaction) => {
        const cleanPhoneNumber = formatPhoneNumber(phoneNumber)
        const user = await usersRepository.getUserByPhoneNumber(cleanPhoneNumber);
        if (!user) throw new NotFoundError(`User with phone ${cleanPhoneNumber} not found`);

        // génère le otp
        const otpCode = generateResetCode();
        const otpData = {
            userId: user.id,
            type: 'PASSWORD_RESET',
            otpHash: await bcrypt.hash(otpCode, 10),
            ip: ipAdress,
        };

        // invalide les anciens otps pour le même utilisateur
        await authRepository.invalidateOtps(user.id, 'PASSWORD_RESET', transaction);

        // enregistre le otp dans la base de données
        const otp = await authRepository.createOtp(otpData, transaction);

        // envoie le otp par sms et email
        // await sendSMSOTP(cleanPhoneNumber, otpCode); // penser à enlever le + de +237 pour que sa marche
        await sendEmailOTP(user.email, otpCode, 'Votre code OTP pour la modification du numéro de téléphone');

        return { id: otp.id, expiresAt: otp.expiresAt };
    });
};

/**
 * @function verifyPasswordOtp
 * @param {string} phoneNumber 
 * @param {string} otpCode 
 * @returns {object}
 */
async function verifyPasswordOtp(phoneNumber, otpCode) {
    return await sequelize.transaction(async (transaction) => {
        if (!/^\d{6}$/.test(otpCode)) {
            // throw createError(400, 'Invalid OTP format');
            throw new ValidationError('Invalid OTP format');
        };

        const cleanPhoneNumber = formatPhoneNumber(phoneNumber);
        const user = await usersRepository.getUserByPhoneNumber(cleanPhoneNumber);
        if (!user) throw new NotFoundError(`User with phone ${cleanPhone} not found`);

        const otp = await authRepository.getOtpByUserIdAndType(
            user.id, 'PASSWORD_RESET',
            { lock: transaction.LOCK.UPDATE }
        );

        if (!otp) throw new NotFoundError('OTP not found');
        if (otp.isVerified) throw new ConflictError('OTP already verified');
        if (otp.expiresAt < new Date()) throw new GoneError('OTP expired');
        if (otp.attempts >= 3) throw new TooManyRequestsError('Maximum attempts exceeded');

        const isValid = await bcrypt.compare(otpCode, otp.otpHash);
        if (!isValid) {
            await authRepository.incrementOtpAttempts(otp.id, transaction);
            throw new AuthentificationError('Invalid OTP');
        };

        // Mark the OTP as consumed
        const newOtp = await authRepository.consumeOtp(otp.id, transaction);

        return { id: otp.id, verifiedAt: newOtp.verifiedAt };
    });
};

/**
 * @function resetPassword
 * @param {number} otpId 
 * @param {string} newPassword 
 * @returns {Object}
 */
async function resetPassword(otpId, newPassword) {
    return await sequelize.transaction(async (transaction) => {
        if (newPassword.length < 8) throw new ValidationError('Password must be at least 8 characters');

        const otp = await authRepository.getOtpById(otpId, {
            paranoid: false,
            lock: transaction.LOCK.UPDATE
        });

        if (!otp) throw new NotFoundError('Otp not found');
        if (!otp.isVerified) throw new ConflictError('Unverified otp code');
        if (otp.expiresAt < new Date()) throw new GoneError('OTP expired');

        const user = await usersRepository.getUserById(otp.userId);
        if (!user) throw new NotFoundError('User linked to OTP not found');
        if (await bcrypt.compare(newPassword, user.password)) throw new ValidationError('New password must be different from the old one');

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const newUser = { password: hashedNewPassword, tokenRevokedBefore: new Date() };
        const updatedUser = await usersRepository.updateUser(user.id, newUser, transaction);

        return updatedUser;
    });
};

/**
 * @function logout
 * @param {number} id 
 * @returns {object}
 */
async function logout(id) {
    return await sequelize.transaction(async (transaction) => {
        const user = await usersRepository.getUserById(id);
        if (!user) throw new NotFoundError(`User with ID ${id} not found`);

        const newUser = { tokenRevokedBefore: new Date() };
        const updatedUser = await usersRepository.updateUser(user.id, newUser, transaction);

        return updatedUser;
    });
};

module.exports = {
    login,
    requestToChangePhoneNumber,
    verifyPhoneNumberOtp,
    changePassword,
    requestToResetForgottenPassword,
    verifyPasswordOtp,
    resetPassword,
    logout
};
