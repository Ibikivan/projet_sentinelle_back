const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Community = sequelize.define('Community', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
        foreignKey: 'userId',
        as: 'creator',
    });

    Community.hasMany(models.PrayerCrew, {
        foreignKey: 'communityId',
        as: 'prayerCrews',
    });

    Community.belongsToMany(models.PrayerSubject, {
        through: 'subject_community',
        foreignKey: 'communityId',
        otherKey: 'subjectId',
        as: 'prayerSubjects',
    });

    // Membership relation (N:M via pivot table)
    Community.belongsToMany(models.User, {
        through: models.CommunityMember,
        foreignKey: 'communityId',
        otherKey: 'userId',
        as: 'members',
    });
};

module.exports = Community;
