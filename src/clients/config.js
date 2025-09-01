
const config = {
    geoname: {
        baseURL: process.env.GEONAMES_URL || 'https://secure.geonames.org',
        username: process.env.GEONAMES_USERNAME || 'sentinelle',
        timeout: Number(process.env.GEONAMES_TIMEOUT || 5000),
    },
    rescountries: {
        baseURL: process.env.RESCOUNTRIES_URL || 'https://restcountries.com',
        timeout: Number(process.env.RESCOUNTRIES_TIMEOUT || 5000),
    },
    bigdatacloud: {
        baseUrl: process.env.BIGDATACLOUD_URL || 'https://api-bdc.io',
        timeout: Number(process.env.BIGDATACLOUD_TIMEOUT || 5000),
    },
}

module.exports = config;
