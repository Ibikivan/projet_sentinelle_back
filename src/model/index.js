const sequelize = require('../config/database');
const logger = require('../utils/logger');
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
const PrayerCrewMember = require('./PrayerCrewMember');
const CommunityMember = require('./CommunityMember');

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
    PrayerCrewMember,
    CommunityMember,
};

Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

async function testDBConnexion() {
    try {
        await sequelize.authenticate();
        logger.info('Connection to the database has been established.');
    } catch (error) {
        throw new ServiceUnavailableError('Unable to connect to the database');
    };
};

async function syncDB() {
    try {
        await sequelize.sync();
        logger.info('Database synchronized.');
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
