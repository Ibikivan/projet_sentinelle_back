const { Testimony } = require("../model");
const { buildQuery, formatPaginatedResult } = require("../utils/queryBuilder");

/**
 * Generic query method for testimonies
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated testimonies result
 */
async function getTestimonies(params = {}) {
    const queryOptions = buildQuery(Testimony, params, {
        allowedFilters: [],
        allowedSorts: ['createdAt', 'title'],
        searchFields: ['title', 'content'],
        allowedIncludes: [
            { association: 'prayerSubject', attributes: ['id', 'title'] },
        ],
        defaultSort: 'createdAt',
        defaultOrder: 'DESC',
    });

    const result = await Testimony.findAndCountAll(queryOptions);
    return formatPaginatedResult(result, queryOptions._meta, 'testimonies');
}

async function getTestimonyById(id) {
    return await Testimony.findByPk(id);
}

async function createTestimony(testimony, transaction = null) {
    return await Testimony.create(testimony, { transaction });
}

async function updateTestimony(id, data, transaction = null) {
    const [updated] = await Testimony.update(data, {
        where: { id },
        transaction
    });
    if (updated === 0) return null;
    return await Testimony.findByPk(id, { transaction });
}

async function deleteTestimony(id, transaction = null) {
    return await Testimony.destroy({
        where: { id },
        transaction
    });
}

module.exports = {
    getTestimonies,
    getTestimonyById,
    createTestimony,
    updateTestimony,
    deleteTestimony,
};