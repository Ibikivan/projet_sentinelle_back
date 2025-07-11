import axios from "axios";
import config from './config.js';

const { rescountries } = config;
const country = axios.create({
    baseURL: rescountries.baseURL,
    timeout: rescountries.timeout,
});

export async function getAllCountries() {
    const response = await country.get('/v2/all', {
        params: { fields: 'alpha2Code,callingCodes,region,name' }
    });
    return response.data;
};
