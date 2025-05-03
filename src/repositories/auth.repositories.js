const { Transaction, Op } = require('sequelize');
const Otp = require('../model/Otp');

async function createOtp(data, transaction = null) {
    const newOtp = await Otp.create(data, { transaction });
    return newOtp;
}

/**
 * Invalide (soft-delete) tous les OTP non consommés pour un user + type donné.
 * @function invalidateOtps
 * @param {number} userId - Identifiant de l’utilisateur
 * @param {string} type   - Type d’OTP, ex. 'PHONE_CHANGE'
 * @param {Transaction} transaction - La transaction Sequelize en cours
 * @returns {Promise<number>} - Nombre d’enregistrements invalidés
 */
async function invalidateOtps(userId, type, transaction) {
    const [count] = await Otp.update(
        { isVerified: false },
        {
            where: {
                userId,
                type,
                isVerified: false
            },
            transaction
        }
    );

    await Otp.destroy({
        where: {
            userId,
            type,
            isVerified: false
        },
        transaction
    });

    return count;
};

/**
 * @function getOtpByUserIdAndType
 * @param {number} userId 
 * @param {string} type 
 * @param {object} options 
 * @param {Transaction} transaction 
 * @returns {object} otp
 */
async function getOtpByUserIdAndType(userId, type, options) {
    const otp = await Otp.findOne({
        where: {
            userId,
            type,
            isVerified: false
        },
        ...options
    });
    return otp;
};

/**
 * @function getOtpById
 * @param {number} id 
 * @returns {object}
 */
async function getOtpById(id, options) {
    return await Otp.findByPk(id, options);
};

/**
 * @function incrementOtpAttempts
 * @param {number} id 
 * @param {Transaction} transaction 
 * @returns {object} updatedOtp
 */
async function incrementOtpAttempts(id, transaction=null) {
    const otp = await Otp.findByPk(id);
    const updatedOtp = await Otp.update(
        { attempts: otp.attempts++},
        {
            where: { id },
            transaction
        }
    );
    return updatedOtp;
};

/**
 * @function consumeOtp
 * @param {number} id 
 * @param {Transaction} transaction 
 * @returns {object} otp
 */
async function consumeOtp(id, transaction=null) {
    const otp = await Otp.update(
        { isVerified: true, verifiedAt: new Date() },
        {
            where: { id },
            transaction
        }
    );

    await Otp.destroy({
        where: {id},
        transaction
    });

    return otp;
};

module.exports = {
    createOtp,
    invalidateOtps,
    getOtpByUserIdAndType,
    getOtpById,
    incrementOtpAttempts,
    consumeOtp
};
