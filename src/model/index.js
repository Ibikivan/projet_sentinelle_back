const sequelize = require('../config/database');
const User = require('./User');
const City = require('./City');
const Otp = require('./Otp');
const { ServiceUnavailableError } = require('../utils/errors.classes');
const PrayerSubject = require('./PrayerSubject');
const Comment = require('./Comment');
const Testimony = require('./Testimony');
const Community = require('./Community');
const PrayerCrew = require('./PrayerCrew');

Otp.belongsTo(User, { foreignKey: 'userId' });

PrayerSubject.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(PrayerSubject, { foreignKey: 'userId' });

PrayerSubject.hasMany(Comment, { foreignKey: 'subjectId' });
Comment.hasOne(PrayerSubject, { foreignKey: 'subjectId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });

PrayerSubject.hasOne(Testimony, { foreignKey: 'testimonyId' });
Testimony.belongsTo(PrayerSubject, { foreignKey: 'subjectId' })

async function testDBConnexion() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        throw new ServiceUnavailableError('Unable to connect to the database');
    }
}

async function syncDB() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        throw new ServiceUnavailableError('Unable to synchronize the database');
    }
}

module.exports = {
    User,
    City,
    Otp,
    PrayerSubject,
    Comment,
    Testimony,
    Community,
    PrayerCrew,
    testDBConnexion,
    syncDB,
    sequelize,
};
