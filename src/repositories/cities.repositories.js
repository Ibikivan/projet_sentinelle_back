const { City } = require("../model");
const { buildQuery, formatPaginatedResult, Op } = require("../utils/queryBuilder");

/**
 * Generic query method for cities with filtering, sorting, pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated cities result
 */
async function getCities(params = {}) {
    const queryOptions = buildQuery(City, params, {
        allowedFilters: ['countryCode', 'countryName', 'continent', 'continentName', 'region'],
        allowedSorts: ['name', 'population', 'countryName'],
        searchFields: ['name', 'countryName', 'continentName'],
        defaultSort: 'name',
        defaultOrder: 'ASC',
    });

    const result = await City.findAndCountAll(queryOptions);
    return formatPaginatedResult(result, queryOptions._meta, 'cities');
}

async function getCityById(id) {
    return await City.findByPk(id);
}

async function getCitiesByName(name) {
    return await City.findAll({
        where: { name }
    });
}

async function searchCities(query, limit = 20) {
    return await City.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.iLike]: `%${query}%` } },
                { countryName: { [Op.iLike]: `%${query}%` } }
            ]
        },
        limit,
        order: [['population', 'DESC']],
        attributes: ['id', 'name', 'countryCode', 'countryName', 'lat', 'lng', 'population']
    });
}

async function getCitiesByCountry(countryCode, params = {}) {
    return await getCities({ ...params, countryCode });
}

async function getCitiesByContinent(continent, params = {}) {
    return await getCities({ ...params, continent });
}

async function createCity(city, transaction = null) {
    return await City.create(city, { transaction });
}

async function bulkCreateCities(cities, transaction = null) {
    return await City.bulkCreate(cities, { transaction });
}

module.exports = {
    getCities,
    getCityById,
    getCitiesByName,
    searchCities,
    getCitiesByCountry,
    getCitiesByContinent,
    createCity,
    bulkCreateCities,
};
