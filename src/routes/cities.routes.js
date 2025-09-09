const express = require('express');
const citiesController = require('../controllers/cities.controllers');

const router = express.Router();

router.post('/', citiesController.createCity);
router.get('/', citiesController.getAllCities);
router.get('/search', citiesController.researchCities);
router.get('/:id', citiesController.getCityById);
router.put('/:id', citiesController.updateCity);
router.delete('/:id', citiesController.deleteCity);

module.exports = router;
