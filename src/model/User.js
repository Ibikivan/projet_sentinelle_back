const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const City = require('./City');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^\+?[1-9]\d{1,14}$/, // E.164 format
        },
        set(value) {
            this.setDataValue('phoneNumber', value.replace(/\s+/g, ''));
        },
    },
    role: {
        type: DataTypes.ENUM('USER', 'ADMIN', 'SUPER_ADMIN'),
        allowNull: false,
        defaultValue: 'USER',
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: City,
            key: 'id',
        },
    },
    tokenRevokedBefore: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'users',
    timestamps: true,
    instanceMethods: {
        async hashOtp(otp) {
            this.otpHash = await bcrypt.hash(otp, 10);
            this.otpExpireAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
            await this.save();
        }
    },
    paranoid: true,
})

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
}

module.exports = User;