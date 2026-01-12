const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommunityMember = sequelize.define('CommunityMember', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    role: {
        type: DataTypes.ENUM('responsable', 'moderator', 'member'),
        allowNull: false,
        defaultValue: 'member',
        validate: { isIn: [['responsable', 'moderator', 'member']] },
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
    tableName: 'community_members',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['community_id'] },
        { fields: ['status'] },
        { fields: ['role'] },
        { unique: true, fields: ['user_id', 'community_id'] },
    ],
});

CommunityMember.associate = (models) => {
    CommunityMember.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });

    CommunityMember.belongsTo(models.Community, {
        foreignKey: 'communityId',
        as: 'community',
    });
};

module.exports = CommunityMember;
