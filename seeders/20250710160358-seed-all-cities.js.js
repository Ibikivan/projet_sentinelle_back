'use strict';

const { getAllCitiesPaginated, getAllCountries: getGeoCountries } = require('../src/clients/geonames.client');
const { getAllCountries: getResCountries } = require('../src/clients/rescountries.client');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // 1) Charger et combiner les données de pays
      const geoCountries = (await getGeoCountries()).geonames;
      const resCountries = await getResCountries();

      // Construire un map alpha2 → { continent, continentName } depuis geoCountries
      const geoMap = {};
      geoCountries.forEach(c => {
        geoMap[c.countryCode] = {
          continent: c.continent ? c.continent : null,
          contry_capital: c.capital ? c.capital : null,
          languages: c.languages ? c.languages : null,
          // countryId: c.geonameId ? c.geonameId : null,
          south: c.south ? parseFloat(c.south) : null,
          iso_alpha3: c.isoAlpha3 ? c.isoAlpha3 : null,
          north: c.north ? parseFloat(c.north) : null,
          fips_code: c.fipsCode ? c.fipsCode : null,
          country_population: parseInt(c.population, 10) || 0,
          east: c.east ? parseFloat(c.east) : null,
          iso_numeric: parseInt(c.isoNumeric, 10) || null,
          area_in_sq_km: c.areaInSqKm ? parseFloat(c.areaInSqKm) : null,
          west: c.west ? parseFloat(c.west) : null,
          postal_code_format: c.postalCodeFormat ? c.postalCodeFormat : null,
          continent_name: c.continentName ? c.continentName : null,
          currency_code: c.currencyCode ? c.currencyCode : null,
        };
      });

      // Construire un map alpha2 → callingCode depuis resCountries
      const resMap = {};
      resCountries.forEach(c => {
        // selon la structure de l’API : ici V2 renvoie callingCodes = ["237"]
        const dial = c.callingCodes?.[0] || '';
        resMap[c.alpha2Code] = {
          calling_codes: `+${dial}`,
          region: c.region ? c.region : null
        };
      });

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      // 2) Pagination des villes GeoNames
      const BATCH = 500;
      let start = 0;
      const records = [];

      while (true) {
        const response = await getAllCitiesPaginated('P', BATCH, start);
        if (!response || !Array.isArray(response.geonames)) {
          console.error('GeoNames malformed or error response:', response);
          break; // ou throw pour arrêter le seed
        }

        const geonames = response.geonames;
        if (!geonames.length) break;

        geonames.forEach(city => {
          const cc2 = city.countryCode;           // ex. "KH"
          const geoInfo = geoMap[cc2] || {};
          const phone   = resMap[cc2] || '';

          records.push({
            admin_code1: city.adminCode1 ? city.adminCode1 : null,
            lng: city.lng ? parseFloat(city.lng) : null,
            geoname_id: parseInt(city.geonameId, 10) || null,
            toponym_name: city.toponymName ? city.toponymName : null,
            country_id: parseInt(city.countryId, 10) || null,
            fcl: city.fcl ? city.fcl : null,
            population: city.population ? parseFloat(city.population) : null,
            country_code: city.countryCode ? city.countryCode : null,
            name: city.name ? city.name : null,
            fcl_name: city.fclName ? city.fclName : null,
            i_s_o3166_2: city.ISO3166_2 ? city.ISO3166_2 : null,
            country_name: city.countryName ? city.countryName : null,
            fcode_name: city.fcodeName ? city.fcodeName : null,
            admin_name1: city.adminName1 ? city.adminName1 : null,
            lat: city.lat ? parseFloat(city.lat) : null,
            fcode: city.fcode ? city.fcode : null,
            ...geoInfo,
            ...phone,
            created_at: new Date(),
            updated_at: new Date(),
          });
        });

        start += BATCH;
        await sleep(1000);
      }

      // 3) Insertion en base par lots (pour éviter les timeouts)
      const chunkSize = 2000;
      for (let i = 0; i < records.length; i += chunkSize) {
        /* ignoreDuplicates empêche l’erreur si une ville existe déjà */
        await queryInterface.bulkInsert('cities', records.slice(i, i + chunkSize), {
          ignoreDuplicates: true
        });
      };
    } catch (error) {
      console.error('seeding cities data error :-------> ', error)
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Supprime tout (ou affiner avec une condition “WHERE geonameId IN (…)”)
      await queryInterface.bulkDelete('cities', null, {});
    } catch (error) {
      console.error('Error trying to undo seeding :-------> ', error)
    }
  }
};
