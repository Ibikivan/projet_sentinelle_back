const jwt = require('jsonwebtoken');

/**
 * @function sign
 * @param {object} payload 
 * @returns {string} token
 * @description This function generates a JWT token using the provided payload and a secret key.
 * The token is signed with the secret key and has an expiration time defined in the environment variables.
 * The expiration time is set to the value of JWT_EXPIRE_IN in hours, or defaults to 1 hour if not specified.
 * The secret key is retrieved from the environment variable JWT_SECRET.
 * The generated token can be used for authentication and authorization purposes in a web application.
 * @throws {Error} If the JWT_SECRET environment variable is not set.
 * @example
 * const payload = { id: 123 };
 * const token = sign(payload);
 * console.log(token); // JWT token
 */
function sign(payload) {
    const secret = process.env.JWT_SECRET;
    const hours = parseInt(process.env.JWT_EXPIRE_IN, 10) || 1;
    return jwt.sign(payload, secret, { expiresIn: `${hours}h` });
}

module.exports = {
    sign
}
