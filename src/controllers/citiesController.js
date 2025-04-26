const citiesServices = require('../services/citiesServices');

async function createCity(req, res, next) {
    try {
        const city = await citiesServices.addCity(req.body);
        res.status(201).json({message: 'City created successfully', city});
    } catch (error) {
        console.error('Error creating city:', error);
        next(error);
    }
}

async function getAllCities(req, res, next) {
    try {
        const cities = await citiesServices.getAllCities();
        res.status(200).json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        next(error);
    }
}

async function getCityById(req, res, next) {
    try {
        const city = await citiesServices.getCityById(req.params.id);
        res.status(200).json(city);
    } catch (error) {
        console.error('Error fetching city:', error);
        next(error);
    }
}

async function updateCity(req, res, next) {
    try {
        const city = await citiesServices.updateCity(req.params.id, req.body);
        res.status(200).json({message: 'City updated successfully', city});
    } catch (error) {
        console.error('Error updating city:', error);
        next(error);
    }
}

async function deleteCity(req, res, next) {
    try {
        const city = await citiesServices.deleteCity(req.params.id);
        res.status(200).json({message: 'City deleted successfully', city});
    } catch (error) {
        console.error('Error deleting city:', error);
        next(error);
    }
}

module.exports = {
    createCity,
    getAllCities,
    getCityById,
    updateCity,
    deleteCity,
};
