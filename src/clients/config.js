
const config = {
    geoname: {
        baseURL: process.env.GEONAMES_URL || 'http://api.geonames.org',
        username: process.env.GEONAMES_USERNAME || 'sentinelle',
        timeout: Number(process.env.GEONAMES_TIMEOUT || 5000),
    },
    rescountries: {
        baseURL: process.env.RESCOUNTRIES_URL || 'https://restcountries.com',
        timeout: Number(process.env.RESCOUNTRIES_TIMEOUT || 5000),
    },
}

module.exports = config;
