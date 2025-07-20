const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Community = sequelize.define('Community', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [3, 100] },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: { len: [0, 500] },
    },
}, {
    tableName: 'communities',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
    ]
});

Community.associate = (models) => {
    Community.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'creator',
    });

    Community.hasMany(models.PrayerCrew, {
        foreignKey: 'community_id',
        as: 'prayerCrews',
    });

    Community.belongsToMany(models.PrayerSubject, {
        through: 'subject_community',
        foreignKey: 'community_id',
        otherKey: 'subject_id',
        as: 'prayerSubjects',
    });
};

module.exports = Community;
