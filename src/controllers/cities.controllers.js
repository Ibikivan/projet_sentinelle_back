const { asyncHandler } = require('../middlewares/async-handler.middleware');
const citiesServices = require('../services/cities.services');

const createCity = asyncHandler(async (req, res) => {
    const city = await citiesServices.addCity(req.body);
    res.status(201).json({message: 'City created', city});
});

const getAllCities = asyncHandler(async (req, res) => {
    const cities = await citiesServices.getAllCities(req.query);
    res.status(200).json(cities);
});

const getCityById = asyncHandler(async (req, res) => {
    const city = await citiesServices.getCityById(req.params.id);
    res.status(200).json(city);
});

const updateCity = asyncHandler(async (req, res) => {
    const city = await citiesServices.updateCity(req.params.id, req.body);
    res.status(200).json({message: 'City updated', city});
});

const deleteCity = asyncHandler(async (req, res) => {
    const city = await citiesServices.deleteCity(req.params.id);
    res.sendStatus(204);
});

module.exports = {
    createCity,
    getAllCities,
    getCityById,
    updateCity,
    deleteCity,
};
