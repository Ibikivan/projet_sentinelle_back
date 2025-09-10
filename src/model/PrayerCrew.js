const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PrayerCrew = sequelize.define('PrayerCrew', {
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
    tableName: 'prayer_crews',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['community_id'] },
        { fields: ['community_id', 'user_id'] },
    ],
});

PrayerCrew.associate = (models) => {
    PrayerCrew.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'creator',
    });

    PrayerCrew.belongsTo(models.Community, {
        foreignKey: 'communityId',
        as: 'community',
    });

    PrayerCrew.belongsToMany(models.PrayerSubject, {
        through: 'prayer_subject_crew',
        foreignKey: 'crewId',
        otherKey: 'subjectId',
        as: 'prayerSubjects',
    });
};

module.exports = PrayerCrew;
