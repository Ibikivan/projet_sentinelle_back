const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const PrayerSubject = require("./PrayerSubject");

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    voiceUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('text', 'voice'),
        allowNull: false,
        defaultValue: 'text'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
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
    tableName: 'comments',
    timestamps: true,
    paranoid: true,
});

module.exports = Comment;
