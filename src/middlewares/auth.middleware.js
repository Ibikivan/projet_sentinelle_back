const jwt = require('jsonwebtoken');
const createError = require('http-errors'); // pour gérer proprement 401/403
const usersRepositories = require('../repositories/users.repositories');
const { AuthentificationError, AuthorizationError } = require('../utils/errors.classes');

/**
 * @function authenticate
 * @param {Request} req 
 * @param {Response} res 
 * @param {next} next 
 * @returns {void|Error}
 */
async function authenticate(req, res, next) {
  try {
    const token = req.cookies.session;
    if (!token) throw new AuthentificationError('Missing token');

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthentificationError('Invalid token')
    };

    const user = await usersRepositories.getUserById(payload.id);
    if (!user) throw new AuthentificationError('Authenticated user not found');

    if (user.tokenRevokedBefore && payload.iat * 1000 < user.tokenRevokedBefore.getTime()) {
      throw new AuthentificationError('Token expired by logout');
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
}

/**
 * @function authorize
 * @param  {Array} allowedRoles 
 * @returns {void|Error}
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthentificationError('Not authenticated user');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError('Access denied');
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
