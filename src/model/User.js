const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
        allowNull: false,
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
    // Ownership relations (creator)
    User.hasMany(models.Community, {
        foreignKey: 'userId',
        as: 'createdCommunities',
    });

    User.hasMany(models.PrayerCrew, {
        foreignKey: 'userId',
        as: 'createdCrews',
    });

    User.hasMany(models.PrayerSubject, {
        foreignKey: 'userId',
        as: 'prayerSubjects',
    });

    User.hasMany(models.Sharing, {
        foreignKey: 'userId',
        as: 'sharings',
    });

    User.hasMany(models.Otp, {
        foreignKey: 'userId',
        as: 'otps',
    });

    User.belongsTo(models.City, {
        foreignKey: 'cityId',
        as: 'city',
    });

    User.hasMany(models.PrayerSession, {
        foreignKey: 'userId',
        as: 'prayerSessions'
    });

    // Membership relations (N:M via pivot tables)
    User.belongsToMany(models.PrayerCrew, {
        through: models.PrayerCrewMember,
        foreignKey: 'userId',
        otherKey: 'prayerCrewId',
        as: 'joinedCrews',
    });

    User.belongsToMany(models.Community, {
        through: models.CommunityMember,
        foreignKey: 'userId',
        otherKey: 'communityId',
        as: 'joinedCommunities',
    });
};

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.tokenRevokedBefore;
    values.profilePicture = values.profilePicture ? process.env.BACKEND_ENDPOINT + values.profilePicture : null;
    return values;
};

module.exports = User;