const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[A-Z]{3}$/, // 3-letter uppercase code
        },
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[A-Z]{2}$/,
        }
    }
}, {
    tableName: 'cities',
    timestamps: true,
    paranoid: true
})

module.exports = City;
