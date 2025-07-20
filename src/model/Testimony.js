const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { ValidationError } = require("../utils/errors.classes");

const Testimony = sequelize.define('Testimony', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [0, 255] },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    voiceContent: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isUrl: true }
    },
    attachements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        validate: {
            maxAttachements(value) {
                if (value && value.length > 5) {
                    throw new ValidationError('You can only attach up to 5 files to testimony.');
                };
            }
        },
    },
}, {
    tableName: 'testimonies',
    timestamps: true,
    paranoid: true,
    underscored: true,
    underscoredAll: true,
    validate: {
        contentOrVoice() {
            if (!this.content && !this.voiceContent) {
                throw new ValidationError('Either content or voiceContent must be provided.');
            };
        }
    },
});

Testimony.associate = (models) => {
    Testimony.hasOne(models.PrayerSubject, {
        foreignKey: 'testimony_id',
        as: 'prayerSubject',
    });
};

module.exports = Testimony;
