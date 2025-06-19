const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

let dbOptions = {}

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT_ENCRYPTION } = process.env;

if (DB_DIALECT_ENCRYPTION === 'ssl') {
    dbOptions.ssl = {
        require: true,
        rejectUnauthorized: false
    };
};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,

    dialectOptions: dbOptions
});

module.exports = sequelize;