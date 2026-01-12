const { User } = require("../model");
const { buildQuery, formatPaginatedResult } = require("../utils/queryBuilder");

/**
 * Generic query method for users with filtering, sorting, pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated users result
 */
async function getUsers(params = {}) {
    const queryOptions = buildQuery(User, params, {
        allowedFilters: ['role', 'cityId', 'email'],
        allowedSorts: ['createdAt', 'lastName', 'firstName', 'role', 'cityId'],
        searchFields: ['firstName', 'lastName', 'email'],
        allowedIncludes: [
            { association: 'city', attributes: ['id', 'name', 'countryCode', 'countryName', 'continent', 'continentName'] }
        ],
        defaultSort: 'createdAt',
        defaultOrder: 'DESC',
    });

    // Handle includeCity shorthand
    if (params.includeCity === 'true') {
        queryOptions.include = [
            { association: 'city', attributes: ['id', 'name', 'countryCode', 'countryName', 'continent', 'continentName'] }
        ];
    }

    const result = await User.findAndCountAll(queryOptions);
    return formatPaginatedResult(result, queryOptions._meta, 'users');
}

async function getUserByEmail(email) {
    return await User.findOne({ where: { email } });
}

async function getUserById(id, options = {}) {
    return await User.findByPk(id, options);
}

async function getUserByPhoneNumber(phoneNumber, paranoid = true) {
    return await User.findOne({
        where: { phoneNumber },
        paranoid
    });
}

async function getUserDetails(id) {
    return await User.findByPk(id, {
        include: [
            { association: 'city', attributes: ['id', 'name', 'countryCode', 'countryName'] },
            { association: 'createdCommunities', attributes: ['id', 'name'] },
            { association: 'createdCrews', attributes: ['id', 'name'] },
        ]
    });
}

async function createUser(user, transaction = null) {
    return await User.create(user, { transaction });
}

async function updateUser(id, user, transaction = null) {
    const [updated] = await User.update(user, {
        where: { id },
        transaction
    });
    return updated;
}

async function deleteUser(id, transaction = null) {
    return await User.destroy({
        where: { id },
        transaction
    });
}

async function restoreUser(id, transaction = null) {
    return await User.restore({
        where: { id },
        transaction
    });
}

module.exports = {
    getUsers,
    getUserByEmail,
    getUserById,
    getUserByPhoneNumber,
    getUserDetails,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    // Backward compatibility aliases
    getAllUsers: getUsers,
};
