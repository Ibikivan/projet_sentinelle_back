const { City } = require("../model");
const { Op, Sequelize } = require('sequelize');

async function getCityByCode(fcl) {
    const city = await City.findOne({
        where: { fcl }
    });
    return city;
}

async function createCity(city, transaction=null) {
    const newCity = await City.create(city, { transaction });
    return newCity;
}

async function getAllCities(params = {}) {
    const where = {};
    const order = [];

    // Filters
    if (params.name) where.name = params.name;
    if (params.countryCode) where.countryCode = params.countryCode;
    if (params.countryName) where.countryName = params.countryName;
    if (params.continent) where.continent = params.continent;
    if (params.continentName) where.continentName = params.continentName;

    // Basic search
    if (params.q) {
        where[Op.or] = [
            { name: { [Op.iLike || Op.like]: `%${params.q}%` } },
            { adminName1: { [Op.iLike || Op.like]: `%${params.q}%` } },
            { countryName: { [Op.iLike || Op.like]: `%${params.q}%` } },
        ];
    }

    // Sorting
    const validSortFields = ['createdAt', 'name', 'population', 'countryCode'];
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

    const result = await City.findAndCountAll({ where, order, limit, offset });

    const currentPage = (limit && offset !== undefined)
        ? Math.floor(offset / limit) + 1
        : (page || 1);
    const totalPages = limit ? Math.ceil(result.count / limit) : 1;

    return {
        cities: result.rows,
        pagination: {
            total: result.count,
            page: currentPage,
            limit: limit,
            totalPages: totalPages
        }
    };
}

async function fullTextResearch(params, lang='english') {
    const cities = await City.findAll({
        attributes: {
            include: [[
                Sequelize.literal(`
                    ts_rank(search_field, websearch_to_tsquery('${lang}', :search))
                `),
                'rank'
            ], [
                Sequelize.literal(`
                    ts_headline('${lang}', country_name, websearch_to_tsquery('${lang}', :search))    
                `),
                'excerpt'
            ]]
        },
        where: Sequelize.literal(`
            search_field @@ websearch_to_tsquery('${lang}', :search)
        `),
        order: [[Sequelize.literal('rank'), 'DESC']],
        replacements: { search: params }
    })
    return cities;
}

async function getCitiesByName(name) {
    const cities = await City.findAll({
        where: { name }
    });
    return cities;
}

async function getCitiesByCountry(countryCode) {
    const cities = await City.findAll({
        where: { countryCode }
    });
    return cities;
}

async function getCityById(id) {
    const city = await City.findByPk(id);
    return city;
}

async function updateCity(id, city, transaction=null) {
    const [updated] = await City.update(city, {
        where: { id },
        transaction
    });
    return updated;
}

async function deleteCity(id, transaction=null) {
    const deleted = await City.destroy({
        where: { id },
        transaction
    });
    return deleted;
}

module.exports = {
    getCityByCode,
    createCity,
    getAllCities,
    fullTextResearch,
    getCityById,
    getCitiesByName,
    getCitiesByCountry,
    updateCity,
    deleteCity,
};
