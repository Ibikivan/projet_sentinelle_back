const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
        validate: { isIn: [['USER', 'ADMIN', 'SUPER_ADMIN']] }
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
        validate: { len: { args: [8, 100], msg: 'Password must be between 8 and 100 characters long' } },
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 100] },
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 100] },
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    tokenRevokedBefore: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['phone_number'] },
        { fields: ['email'] },
        { fields: ['token_revoked_before'] },
    ]
})

User.associate = (models) => {
    User.hasMany(models.Community, {
        foreignKey: 'userId',
        as: 'communities',
    });

    User.hasMany(models.PrayerCrew, {
        foreignKey: 'userId',
        as: 'prayerCrews',
    });

    User.hasMany(models.PrayerSubject, {
        foreignKey: 'userId',
        as: 'prayerSubjects',
    });

    User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments',
    });

    User.hasMany(models.Otp, {
        foreignKey: 'userId',
        as: 'otps',
    });

    // Opimisation possible en ne rajoutant que l'info de la city dont on a besoin,
    // sans associaion à la table
    User.belongsTo(models.City, {
        foreignKey: 'cityId',
        as: 'city',
    });
};

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.tokenRevokedBefore;
    return values;
};

module.exports = User;