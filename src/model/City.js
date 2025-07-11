const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const rowData = {
    // From geonames get all cities paginated
    adminCode1: "11",
    lng: 2.3488, // float
    geonameId: 2988507,
    toponymName: 'Paris',
    countryId: 3017382, // int
    fcl: "P",
    population: 2138551,
    countryCode: "FR",
    name: 'Paris',
    fclName: 'city, village,...',
    ISO3166_2: 'IDF',
    countryName: 'France',
    fcodeName: 'capital of a political entity',
    adminName1: 'Île-de-France',
    lat: 48.85341, // float
    fcode: "PPLC",

    // From geonames get all countries
    continent: "EU",
    contryCapital: "Paris",
    languages: "fr",
    countryId: 3017382,
    south: 41.303, // float
    isoAlpha3: "FRA",
    north: 51.124, // float
    fipsCode: "FR",
    countryPopulation: 65273511, // int
    east: 9.561, // float
    isoNumeric: 250, // int
    areaInSqKm: 551695, // float
    countryCode: "FR",
    west: -5.142, // float
    postalCodeFormat: "#####",
    continentName: "Europe",
    currencyCode: "EUR",

    // From rescountries get all countries
    alpha2Code: "FR",
    callingCodes: "+33", // string
    region: "Europe"
};

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    adminCode1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lng: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    geonameId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    toponymName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    countryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fcl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    population: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fclName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ISO3166_2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    countryName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fcodeName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    adminName1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lat: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    fcode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    continent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contryCapital: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    languages: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    south: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    isoAlpha3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    north: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    fipsCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    countryPopulation: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    east: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    isoNumeric: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    areaInSqKm: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    west: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    postalCodeFormat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    continentName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    currencyCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alpha2Code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    callingCodes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'cities',
    timestamps: true,
    paranoid: true
});

module.exports = City;
