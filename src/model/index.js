const sequelize = require('../config/database');
const { ServiceUnavailableError } = require('../utils/errors.classes');
const User = require('./User');
const City = require('./City');
const Otp = require('./Otp');
const PrayerSubject = require('./PrayerSubject');
const Comment = require('./Comment');
const Testimony = require('./Testimony');
const Community = require('./Community');
const PrayerCrew = require('./PrayerCrew');

const models = {
    User,
    City,
    Otp,
    PrayerSubject,
    Comment,
    Testimony,
    Community,
    PrayerCrew
};

Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

async function testDBConnexion() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        throw new ServiceUnavailableError('Unable to connect to the database');
    };
};

async function syncDB() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        throw new ServiceUnavailableError('Unable to synchronize the database');
    };
};

module.exports = {
    ...models,
    testDBConnexion,
    syncDB,
    sequelize,
};
