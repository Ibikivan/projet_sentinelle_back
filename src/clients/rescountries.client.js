const axios = require("axios");
const config = require('./config');

const { rescountries } = config;
const country = axios.create({
    baseURL: rescountries.baseURL,
    timeout: rescountries.timeout,
});

async function getAllCountries() {
    const response = await country.get('/v2/all', {
        params: { fields: 'alpha2Code,callingCodes,region,name' }
    });
    return response.data;
}

module.exports = {
    getAllCountries
};
