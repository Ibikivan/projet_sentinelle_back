const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { ValidationError } = require("../utils/errors.classes");

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    voiceUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isUrl: true },
    },
    type: {
        type: DataTypes.ENUM('text', 'voice'),
        allowNull: false,
        defaultValue: 'text',
        validate: { isIn: [['text', 'voice']] },
    },
}, {
    tableName: 'comments',
    timestamps: true,
    paranoid: true,
    underscored: true,
    underscoredAll: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['subject_id'] },
        { fields: ['created_at'] },
        { fields: ['created_at', 'subject_id'] }
    ],
    validate: {
        contentOrVoice() {
            if (this.type === 'text' && !this.content) {
                throw new ValidationError('Content is required for text comments');
            };

            if (this.type === 'voice' && !this.voiceUrl) {
                throw new ValidationError('Voice URL is required for voice comments');
            };
        }
    },
});

Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'creator',
    });

    Comment.belongsTo(models.PrayerSubject, {
        foreignKey: 'subject_id',
        as: 'subject',
    });
};

module.exports = Comment;
