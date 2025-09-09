const { sequelize } = require('../model');
const citiesRepository = require('../repositories/cities.repositories');
const { ConflictError, NotFoundError } = require('../utils/errors.classes');

async function addCity(city) {
    return await sequelize.transaction(async (transaction) => {
        const isCityExist = await citiesRepository.getCityByCode(city.fcl); // A remplacer par un identifiant unique de ville
        if (isCityExist)
            throw new ConflictError('City already exists');
        return await citiesRepository.createCity(city, transaction);
    })
}

async function getAllCities(params = {}) {
    if (params.limit && parseInt(params.limit, 10) > 100)
        throw new ConflictError('Limit cannot exceed 100');
    return await citiesRepository.getAllCities(params);
}

async function researchCities(params={}) {
    return await citiesRepository.fullTextResearch(params);
}

async function getCityById(id) {
    const city = await citiesRepository.getCityById(id);
    if (!city) {
        throw new NotFoundError(`City with ID ${id} not found`);
    }
    return city;
}

async function updateCity(id, city) {
    return await sequelize.transaction(async (transaction) => {
        const existingCity = await citiesRepository.getCityById(id);
        if (!existingCity) {
            throw new NotFoundError(`City with ID ${id} not found`);
        }
        return await citiesRepository.updateCity(id, city);
    })
}

async function deleteCity(id) {
    return await sequelize.transaction(async (transaction) => {
        const existingCity = await citiesRepository.getCityById(id);
        if (!existingCity) {
            throw new NotFoundError(`City with ID ${id} not found`);
        }
        return await citiesRepository.deleteCity(id);
    })
}

module.exports = {
    addCity,
    getAllCities,
    researchCities,
    getCityById,
    updateCity,
    deleteCity,
};
