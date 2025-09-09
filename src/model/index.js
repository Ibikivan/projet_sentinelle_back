const sequelize = require('../config/database');
const { ServiceUnavailableError } = require('../utils/errors.classes');
const User = require('./User');
const City = require('./City');
const Otp = require('./Otp');
const PrayerSubject = require('./PrayerSubject');
const Sharing = require('./Sharing');
const Testimony = require('./Testimony');
const Community = require('./Community');
const PrayerCrew = require('./PrayerCrew');
const PrayerSession = require('./PrayerSession');

const models = {
    User,
    City,
    Otp,
    PrayerSubject,
    Sharing,
    Testimony,
    Community,
    PrayerCrew,
    PrayerSession,
};

Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

async function testDBConnexion() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established.');
    } catch (error) {
        throw new ServiceUnavailableError('Unable to connect to the database');
    };
};

async function syncDB() {
    try {
        await sequelize.sync();
        console.log('Database synchronized.');
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
