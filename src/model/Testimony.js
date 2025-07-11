const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const PrayerSubject = require("./PrayerSubject");

const Testimony = sequelize.define('Testimony', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    voiceContent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    attachements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PrayerSubject,
            key: 'id',
        },
    },
}, {
    tableName: 'testimonies',
    timestamps: true,
    paranoid: true,
});

module.exports = Testimony;
