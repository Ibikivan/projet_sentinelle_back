const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
        allowNull: false,
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
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['name'] },
    ],
});

City.associate = (models) => {
    City.hasMany(models.User, {
        foreignKey: 'city_id',
        as: 'residents',
    });
};

module.exports = City;
