const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PrayerCrewMember = sequelize.define('PrayerCrewMember', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    role: {
        type: DataTypes.ENUM('admin', 'moderator', 'member'),
        allowNull: false,
        defaultValue: 'member',
        validate: { isIn: [['admin', 'moderator', 'member']] },
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'banned', 'left'),
        allowNull: false,
        defaultValue: 'pending',
        validate: { isIn: [['pending', 'accepted', 'banned', 'left']] },
    },
    joinedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'prayer_crew_members',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['prayer_crew_id'] },
        { fields: ['status'] },
        { fields: ['role'] },
        { unique: true, fields: ['user_id', 'prayer_crew_id'] },
    ],
});

PrayerCrewMember.associate = (models) => {
    PrayerCrewMember.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });

    PrayerCrewMember.belongsTo(models.PrayerCrew, {
        foreignKey: 'prayerCrewId',
        as: 'crew',
    });
};

module.exports = PrayerCrewMember;
