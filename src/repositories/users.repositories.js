const { User } = require("../model");

async function getUserByEmail(email) {
    const user = await User.findOne({
        where: { email: email }
    });
    return user;
}

async function createUser(user, transaction=null) {
    const newUser = await User.create(user, { transaction });
    return newUser;
}

async function getAllUsers(params = {}) {
    const where = {};
    const include = [];
    const order = [];

    // Filters
    if (params.role) where.role = params.role;
    if (params.cityId) where.cityId = params.cityId;
    if (params.email) where.email = params.email;
    if (params.q) {
        // Basic OR search across name and email using sequelize operators
        const { Op } = require('sequelize');
        where[Op.or] = [
            { firstName: { [Op.iLike || Op.like]: `%${params.q}%` } },
            { lastName: { [Op.iLike || Op.like]: `%${params.q}%` } },
            { email: { [Op.iLike || Op.like]: `%${params.q}%` } },
        ];
    }

    // Include city minimal info when requested
    if (params.includeCity === 'true')
        include.push({ association: 'city', attributes: ['id', 'name', 'countryCode', 'countryName', 'continent', 'continentName'] });

    // Sorting
    const validSortFields = ['createdAt', 'lastName', 'firstName', 'role', 'cityId'];
    if (params.sortBy && validSortFields.includes(params.sortBy)) {
        const sortOrder = params.sortOrder === 'asc' ? 'ASC' : 'DESC';
        order.push([params.sortBy, sortOrder]);
    } else {
        order.push(['createdAt', 'DESC']);
    }

    // Pagination
    const limit = params.limit ? parseInt(params.limit, 10) : undefined;
    const page = params.page ? parseInt(params.page, 10) : undefined;
    const offset = limit && page ? (page - 1) * limit : undefined;

    const result = await User.findAndCountAll({ where, include, order, limit, offset });
    return {
        users: result.rows,
        pagination: {
            total: result.count,
            page: limit ? Math.floor((offset || 0) / limit) + 1 : 1,
            limit: parseInt(limit, 10) || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1
        }
    };
}

async function getUserDetails(id) {
    // Aggreger toutes les données nécessaire au profil privé
    const user = await User.findByPk(id);
    return user;
}

async function getUserById(id) {
    // Limiter les champs pour le profil publique
    const user = await User.findByPk(id);
    return user;
}

async function updateUser(id, user, transaction=null) {
    const [updated] = await User.update(user, {
        where: { id: id },
        transaction
    });
    return updated;
}

async function deleteUser(id, transaction=null) {
    const deleted = await User.destroy({
        where: { id: id },
        transaction
    });
    return deleted;
}

async function restoreUser(id, transaction=null) {
    const user = await User.restore(
        { where: { id },
        transaction
    });
    return user;
}

async function getUserByPhoneNumber(phoneNumber, paranoid=true) {
    const user = await User.findOne({
        where: { phoneNumber: phoneNumber },
        paranoid
    });
    return user;
}

module.exports = {
    getUserByEmail,
    createUser,
    getAllUsers,
    getUserDetails,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
    getUserByPhoneNumber
}
