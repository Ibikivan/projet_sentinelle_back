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
        allowNull: false,
        validate: {
            len: [8, 100], // Minimum length of 8 characters
            is: /^[a-zA-Z0-9!@#$%^&*]+$/ // Alphanumeric and special characters
        }
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
    otpHash: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^[0-9]{6}$/, // 6-digit OTP
        }
    },
    otpExpireAt: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: true,
        },
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: City,
            key: 'id',
        },
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        },
    },
    instanceMethods: {
        comparePassword(password) {
            return bcrypt.compare(password, this.password);
        },
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