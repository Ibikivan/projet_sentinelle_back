const { sequelize } = require("../model");
const { ValidationError, NotFoundError } = require("../utils/errors.classes");
const prayersRepository = require("../repositories/prayers.repositories");
const testimoniesRepository = require("../repositories/testimonies.repositories");
const { getUserAndSubject } = require("../utils/functions");

async function addTestimony(prayerId, userId, data, file) {
    return await sequelize.transaction(async (transaction) => {
        if (!data.title && !data.content && !file)
            throw new ValidationError("Either title, content or voiceContent must be provided.");
        if (file)
            data.voiceContent = `/uploads/${file.fieldname}/${file.filename}`;

        const prayer = await prayersRepository.getOneCurrentUserSubject(prayerId, userId);
        if (!prayer) throw new NotFoundError('Failed to find the prayer subject.');

        if (prayer.state !== 'close_exhausted') {
            prayer.state = 'close_exhausted';
            await prayer.save({ transaction });
        };

        const testimony = await testimoniesRepository.createTestimony(data, transaction);
        if (!testimony) throw new NotFoundError("Testimony not founded");
        
        await prayer.setTestimony(testimony, { transaction });
        return testimony;
    });
};

async function getTestimonyBySubject(subjectId, userId) {
    const { subject } = await getUserAndSubject(subjectId, userId);
    const testimony = await subject.getTestimony();
    if (!testimony) throw new NotFoundError("No testimony found for this subject");
    return testimony;
};

async function updateTestimony(subjectId, userId, data, file) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(subjectId, userId);

        const testimony = await subject.getTestimony();
        if (!testimony) throw new NotFoundError("Testimony not found");
        
        if (file)
            data.voiceContent = `/uploads/${file.fieldname}/${file.filename}`;
        await testimony.update(data, { transaction });
        return await testimoniesRepository.getTestimonyById(testimony.id);
    });
};

async function deleteTestimony(subjectId, userId) {
    return await sequelize.transaction(async (transaction) => {
        const { subject } = await getUserAndSubject(subjectId, userId);
        
        const testimony = await subject.getTestimony();
        if (!testimony) throw new NotFoundError("Testimony not found");
        
        await subject.setTestimony(null, { transaction });
        await testimony.destroy({ transaction });
    });
};

module.exports = {
    addTestimony,
    getTestimonyBySubject,
    updateTestimony,
    deleteTestimony,
};
