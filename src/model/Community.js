const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Community = sequelize.define('Community', {
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
}, {
    tableName: 'community',
    timestamps: true,
    paranoid: true,
});

module.exports = Community;
