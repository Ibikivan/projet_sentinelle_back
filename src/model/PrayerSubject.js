const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
// const Testimony = require("./Testimony");
const PrayerCrew = require("./PrayerCrew");
const Community = require("./Community");

const PrayerSubject = sequelize.define('PrayerSubject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    state: {
        type: DataTypes.ENUM('active', 'close_exhausted', 'close_expired'),
        allowNull: false,
        defaultValue: 'active',
    },
    // testimonyId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    //     references: {
    //         model: Testimony,
    //         key: 'id',
    //     },
    // },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    prayerCrewId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: PrayerCrew,
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
    tableName: 'prayer_subjects',
    timestamps: true,
    paranoid: true,
});

module.exports = PrayerSubject;