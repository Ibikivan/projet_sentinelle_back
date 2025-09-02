const { sequelize } = require('../model');
const citiesRepository = require('../repositories/cities.repositories');
const { ConflictError, NotFoundError } = require('../utils/errors.classes');

async function addCity(city) {
    return await sequelize.transaction(async (transaction) => {
        const isCityExist = await citiesRepository.getCityByCode(city.fcl); // A remplacer par un identifiant unique de ville
        if (isCityExist)
            throw new ConflictError('City already exists');
        const newCity = await citiesRepository.createCity(city, transaction);
        return newCity;
    })
}

async function getAllCities(params = {}) {
    if (params.limit && parseInt(params.limit, 10) > 100)
        throw new ConflictError('Limit cannot exceed 100');
    const cities = await citiesRepository.getAllCities(params);
    return cities;
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
        const updatedCity = await citiesRepository.updateCity(id, city);
        return updatedCity;
    })
}

async function deleteCity(id) {
    return await sequelize.transaction(async (transaction) => {
        const existingCity = await citiesRepository.getCityById(id);
        if (!existingCity) {
            throw new NotFoundError(`City with ID ${id} not found`);
        }
        const deletedCity = await citiesRepository.deleteCity(id);
        return deletedCity;
    })
}

module.exports = {
    addCity,
    getAllCities,
    getCityById,
    updateCity,
    deleteCity,
};
