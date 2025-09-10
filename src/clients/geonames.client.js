const axios = require("axios");
const config = require('./config');

const { geoname } = config;
const geo = axios.create({
  baseURL: geoname.baseURL,
  timeout: geoname.timeout,
});

async function getAllCitiesPaginated(featureClass='p', maxRows=1000, startRow=0) {
    const response = await geo.get('/searchJSON', {
        params: { featureClass, maxRows, startRow, username: geoname.username }
    });
    return response.data;
}

async function getAllCountries() {
    const response = await geo.get('/countryInfoJSON', {
        params: { username: geoname.username }
    });
    return response.data;
}

module.exports = {
    getAllCitiesPaginated,
    getAllCountries
};
