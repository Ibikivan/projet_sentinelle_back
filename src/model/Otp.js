const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Otp = sequelize.define('Otp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    type: {
        type: DataTypes.ENUM('PASSWORD_RESET', 'PHONE_CHANGE'),
        allowNull: false,
    },
    newValue: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^\+?[1-9]\d{1,14}$/, // E.164 format
        },
    },
    otpHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: true,
        },
    },
    attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIP: true,
        },
    },
}, {
    tableName: 'otps',
    timestamps: true,
    paranoid: true,
});

module.exports = Otp;
