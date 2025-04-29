const Otp = require('../model/Otp');

async function createOtp(data, transaction = null) {
    const newOtp = await Otp.create(data, { transaction });
    return newOtp;
}

module.exports = {
    createOtp,
};
