const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PrayerSession = sequelize.define('PrayerSession', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'completed'),
        allowNull: false,
        defaultValue: 'active',
        validate: { isIn: [['active', 'completed']] },
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    accuracy: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0.000001
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'prayer_sessions',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['subject_id'] },
        { fields: ['user_id'] },
        { fields: ['city_id'] },
        { fields: ['latitude', 'longitude'] }
    ],
});

PrayerSession.associate = (models) => {
    PrayerSession.belongsTo(models.PrayerSubject, {
        foreignKey: 'subjectId',
        as: 'subject',
    });

    PrayerSession.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });

    PrayerSession.belongsTo(models.City, {
        foreignKey: 'cityId',
        as: 'location',
    });
};

module.exports = PrayerSession;
