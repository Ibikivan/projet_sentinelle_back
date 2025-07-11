const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Community = require("./Community");

const PrayerCrew = sequelize.define('PrayerCrew', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    communityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Community,
            key: 'id',
        },
    },
}, {
    tableName: 'prayer_crews',
    timestamps: true,
    paranoid: true,
});

module.exports = PrayerCrew;
