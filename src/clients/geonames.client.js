import axios from "axios";
import config from './config.js';

const { geoname } = config;
const geo = axios.create({
  baseURL: geoname.baseURL,
  timeout: geoname.timeout,
});

export async function getAllCitiesPaginated(featureClass='p', maxRows=1000, startRow=0) {
    const response = await geo.get('/searchJSON', {
        params: { featureClass, maxRows, startRow, username: geoname.username }
    });
    return response.data;
};

export async function getAllCountries() {
    const response = await geo.get('/countryInfoJSON', {
        params: { username: geoname.username }
    });
    return response.data;
};
