const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;