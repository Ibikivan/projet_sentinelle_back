const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    state: {
        type: DataTypes.ENUM('active', 'close_exhausted', 'close_expired'),
        allowNull: false,
        defaultValue: 'active',
        validate: { isIn: [['active', 'close_exhausted', 'close_expired']] },
    },
}, {
    tableName: 'prayer_subjects',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['state'] },
        { fields: ['is_public'] },
        { fields: ['testimony_id'] },
    ],
});

PrayerSubject.associate = (models) => {
    PrayerSubject.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'creator',
    });

    PrayerSubject.belongsTo(models.Testimony, {
        foreignKey: 'testimony_id',
        as: 'testimony',
    });

    PrayerSubject.belongsToMany(models.PrayerCrew, {
        through: 'prayer_subject_crew',
        foreignKey: 'subject_id',
        otherKey: 'crew_id',
        as: 'prayerCrews',
    });

    PrayerSubject.belongsToMany(models.Community, {
        through: 'subject_community',
        foreignKey: 'subject_id',
        otherKey: 'community_id',
        as: 'communities',
    });

    PrayerSubject.hasMany(models.Comment, {
        foreignKey: 'subject_id',
        as: 'comments',
    })
};

module.exports = PrayerSubject;