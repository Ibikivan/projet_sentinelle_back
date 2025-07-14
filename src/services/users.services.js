const { sequelize } = require('../model');
const usersRepositories = require('../repositories/users.repositories');
const authRepositories = require('../repositories/auth.repositories');
const { formatUserPhoneNumber, generateResetCode, formatPhoneNumber } = require('../utils');
const bcrypt = require('bcrypt');
const { ValidationError, NotFoundError, ConflictError, GoneError, TooManyRequestsError, AuthentificationError } = require('../utils/errors.classes');
const { sendEmailOTP } = require('../utils/email.services');

async function createUser(user) {
    return await sequelize.transaction(async (transaction) => {
        if (user.password.length < 8) throw new ValidationError('Password must be at least 8 characters');
        
        formatUserPhoneNumber(user);
        const isUserExist = await usersRepositories.getUserByPhoneNumber(user.phoneNumber, false);
        if (isUserExist?.deletedAt) throw new GoneError(`${user.phoneNumber}`);        

        user.password = await bcrypt.hash(user.password, 10);
        return usersRepositories.createUser(user, transaction)
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError') throw new ConflictError(err.message);
                throw err;
            });
    });
};

async function getAllUsers() {
    const users = await usersRepositories.getAllUsers();
    return users;
};

async function getUserDetails(id) {
    const user = await usersRepositories.getUserDetails(id);
    return user;
};

async function getUserById(id) {
    const user = await usersRepositories.getUserById(id);
    console.log('Targeted ID', user)
    return user;
};

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
};

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
};

async function deleteUser(id) {
    return await sequelize.transaction(async (transaction) => {
        const userExist = await usersRepositories.getUserById(id);
        if (!userExist) throw new NotFoundError(`User with ID ${id} not found`);

        const newUser = { tokenRevokedBefore: new Date() };
        await usersRepositories.updateUser(userExist.id, newUser, transaction);

        const deleted = await usersRepositories.deleteUser(id, transaction);
        return deleted;
    });
};

async function requestToRestaureAccount(phoneNumber, ipAdress) {
    return await sequelize.transaction(async (transaction) => {
        const cleanPhoneNumber = formatPhoneNumber(phoneNumber);
        const user = await usersRepositories.getUserByPhoneNumber(cleanPhoneNumber, false);
        if (!user) throw new NotFoundError(`User with phone number ${phoneNumber} not found`);
        if (!user.deletedAt) throw new GoneError(`Account is not deleted`);

        // génère le otp
        const otpCode = generateResetCode();
        const otpData = {
            userId: user.id,
            type: 'RESTAURE_ACCOUNT',
            otpHash: await bcrypt.hash(otpCode, 10),
            ip: ipAdress,
        }

        // invalide les anciens otps pour le même utilisateur
        await authRepositories.invalidateOtps(user.id, 'RESTAURE_ACCOUNT', transaction);

        const otp = await authRepositories.createOtp(otpData, transaction)
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError') throw new ConflictError(err.message);
                throw err;
            });

        // envoie le otp par sms et email
        // await sendSMSOTP(cleanPhoneNumber, otpCode); // penser à enlever le + de +237 pour que sa marche
        await sendEmailOTP(user.email, otpCode, 'Votre code OTP pour la restauration de votre compte');

        return { id: otp.id, expiresAt: otp.expiresAt };
    });
};

async function validateAccountRestauration(phoneNumber, otpCode) {
    return await sequelize.transaction(async (transaction) => {
        if (!/^\d{6}$/.test(otpCode)) {
            // throw createError(400, 'Invalid OTP format');
            throw new ValidationError('Invalid OTP format');
        };

        const cleanPhoneNumber = formatPhoneNumber(phoneNumber);
        const user = await usersRepositories.getUserByPhoneNumber(cleanPhoneNumber, false);
        if (!user) throw new NotFoundError(`User with phone ${cleanPhoneNumber} not found`);

        const otp = await authRepositories.getOtpByUserIdAndType(
            user.id, 'RESTAURE_ACCOUNT',
            { lock: transaction.LOCK.UPDATE }
        );

        if (!otp) throw new NotFoundError('OTP not found');
        if (otp.isVerified) throw new ConflictError('OTP already verified');
        if (otp.expiresAt < new Date()) throw new GoneError('OTP expired');
        if (otp.attempts >= 3) throw new TooManyRequestsError('Maximum attempts exceeded');

        const isValid = await bcrypt.compare(otpCode, otp.otpHash);
        if (!isValid) {
            await authRepositories.incrementOtpAttempts(otp.id, transaction);
            throw new AuthentificationError('Invalid OTP');
        };

        await authRepositories.consumeOtp(otp.id, transaction);

        // Resature account
        const restauredUser = await usersRepositories.restoreUser(user.id, transaction);

        return restauredUser;
    });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserDetails,
    getUserById,
    updateUser,
    adminUpdateUser,
    deleteUser,
    requestToRestaureAccount,
    validateAccountRestauration
};
