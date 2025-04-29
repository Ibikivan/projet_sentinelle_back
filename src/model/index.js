const sequelize = require('../config/database');
const User = require('./User');
const City = require('./City');
const Otp = require('./Otp');

Otp.belongsTo(User, { foreignKey: 'userId' });

async function testDBConnexion() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        throw new Error('Unable to connect to the database:', error);
    }
}

async function syncDB() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        throw new Error('Unable to synchronize the database:', error);
    }
}

module.exports = {
    User,
    City,
    Otp,
    testDBConnexion,
    syncDB,
    sequelize,
};
