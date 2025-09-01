const axios = require("axios");
const config = require("./config");

const { bigdatacloud } = config;
const bdc = axios.create({
    baseURL: bigdatacloud.baseUrl,
    timeout: bigdatacloud.timeout,
});

async function getNearestCityByPosition(latitude, longitude, localityLanguage) {
    const response = await bdc.get('/data/reverse-geocode-client', {
        params: {
            latitude: latitude,
            longitude: longitude,
            localityLanguage: localityLanguage,
        },
    });
    return response.data;
}

module.exports = {
    getNearestCityByPosition
};
