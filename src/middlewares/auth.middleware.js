const jwt = require('jsonwebtoken');
const createError = require('http-errors'); // pour gérer proprement 401/403
const usersRepositories = require('../repositories/users.repositories')

/**
 * @function authenticate
 * @param {Request} req 
 * @param {Response} res 
 * @param {next} next 
 * @returns {void|Error}
 */
async function authenticate(req, res, next) {
  console.log('Cookie token:', req.cookies.session);
  try {
    const token = req.cookies.session;
    if (!token) throw createError(401, 'Missing token');

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = usersRepositories.getUserById(payload.sub);

    if (user.tokenRevokedBefore && payload.iat * 1000 < user.tokenRevokedBefore.getTime()) {
        throw new Error('Token expired by logout');
    }

    req.user = user;

    next();
  } catch (err) {
    // Différencier TokenExpiredError vs autres ?
    return next(createError(401, 'Unauthorized'));
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
      return next(createError(401, 'Unauthorized'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(createError(403, 'Access denied'));
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
