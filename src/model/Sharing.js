const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { ValidationError } = require("../utils/errors.classes");

const Sharing = sequelize.define('Sharing', {
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
    tableName: 'sharings',
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
                throw new ValidationError('Content is required for text sharings');
            };

            if (this.type === 'voice' && !this.voiceUrl) {
                throw new ValidationError('Voice URL is required for voice sharings');
            };
        }
    },
});

Sharing.associate = (models) => {
    Sharing.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'creator',
    });

    Sharing.belongsTo(models.PrayerSubject, {
        foreignKey: 'subjectId',
        as: 'subject',
    });
};

module.exports = Sharing;
