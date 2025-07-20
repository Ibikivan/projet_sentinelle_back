const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { ValidationError } = require('../utils/errors.classes');

const OTP_TTL_MINUTES = parseInt(process.env.OTP_TTL_MINUTES, 10) || 15;

const Otp = sequelize.define('Otp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.ENUM('PASSWORD_RESET', 'PHONE_CHANGE', 'RESTORE_ACCOUNT'),
        allowNull: false,
        validate: { isIn: [['PASSWORD_RESET', 'PHONE_CHANGE', 'RESTORE_ACCOUNT']] },
    },
    newValue: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isPhoneNumber(value) {
                if (this.type === 'PHONE_CHANGE' && !/^\+?[1-9]\d{1,14}$/.test(value)) {
                    throw new ValidationError('Invalid phone number format');
                }
            },
        },
    },
    otpHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + OTP_TTL_MINUTES * 60_000),
        validate: { isDate: true },
    },
    attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 5 },
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
    underscored: true,
    indexes: [
        [{ fields: ['user_id'] }],
        [{ fields: ['expiresAt'] }],
    ],
});

Otp.associate = (models) => {
    Otp.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'creator',
    });
};

module.exports = Otp;
