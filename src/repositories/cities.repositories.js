const { City } = require("../model");

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

async function getAllCities() {
    const cities = await City.findAll();
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
    getCityById,
    updateCity,
    deleteCity,
};
