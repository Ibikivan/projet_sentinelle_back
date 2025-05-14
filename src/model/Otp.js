const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const OTP_TTL_MINUTES = parseInt(process.env.OTP_TTL_MINUTES, 10) || 15;

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
        type: DataTypes.ENUM('PASSWORD_RESET', 'PHONE_CHANGE', 'RESTAURE_ACCOUNT'),
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
    verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
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
    hooks: {
        beforeValidate(otp) {
            if (!otp.expiresAt) otp.expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);
        }
    }
});

module.exports = Otp;
