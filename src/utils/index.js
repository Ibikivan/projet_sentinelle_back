
/**
 * @function formatUserPhoneNumber
 * @param {object} user 
 * @returns {object}
 * @description This function formats the phone number of a user object by adding the country code if it is not already present.
 * @example
 * const user = { phoneNumber: '123456789' };
 * const formattedUser = formatUserPhoneNumber(user);
 * console.log(formattedUser); // { phoneNumber: '+237123456789' }
 */
function formatUserPhoneNumber(user) {
    const phoneIndex = '+237';

    if (!user.phoneNumber.startsWith(phoneIndex)) {
        user.phoneNumber = phoneIndex + user.phoneNumber;
    }

    return user;
};

/**
 * @function formatPhoneNumber
 * @param {string} phoneNumber 
 * @returns {string}
 * @description This function formats a phone number by adding the country code if it is not already present.
 * @example
 * const formattedPhoneNumber = formatPhoneNumber('123456789');
 * console.log(formattedPhoneNumber); // '+237123456789'
 */
function formatPhoneNumber(phoneNumber) {
    const phoneIndex = '+237';

    if (!phoneNumber.startsWith(phoneIndex)) {
        phoneNumber = phoneIndex + phoneNumber;
    }

    return phoneNumber;
};

/**
 * @function generateResetCode
 * @returns {string}
 * @description This function generates a random 6-digit reset code.
 * @example
 * const resetCode = generateResetCode();
 * console.log(resetCode); // '123456'
 */
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    formatUserPhoneNumber,
    formatPhoneNumber,
    generateResetCode
};
