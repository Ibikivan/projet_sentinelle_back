const { sequelize } = require('../model');
const citiesRepositories = require('../repositories/citiesRepositories');

async function addCity(city) {
    return await sequelize.transaction(async (transaction) => {
        const isCityExist = await citiesRepositories.getCityByCode(city.code);
        if (isCityExist) {
            throw new Error('City already exists');
        }
        const newCity = await citiesRepositories.createCity(city);
        return newCity;
    })
}

async function getAllCities() {
    const cities = await citiesRepositories.getAllCities();
    return cities;
}

async function getCityById(id) {
    const city = await citiesRepositories.getCityById(id);
    if (!city) {
        throw new Error('City not found');
    }
    return city;
}

async function updateCity(id, city) {
    return await sequelize.transaction(async (transaction) => {
        const existingCity = await citiesRepositories.getCityById(id);
        if (!existingCity) {
            throw new Error('City not found');
        }
        const updatedCity = await citiesRepositories.updateCity(id, city);
        return updatedCity;
    })
}

async function deleteCity(id) {
    return await sequelize.transaction(async (transaction) => {
        const existingCity = await citiesRepositories.getCityById(id);
        if (!existingCity) {
            throw new Error('City not found');
        }
        const deletedCity = await citiesRepositories.deleteCity(id);
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
