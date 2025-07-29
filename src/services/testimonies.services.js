const { sequelize } = require("../model");
const { ValidationError, NotFoundError } = require("../utils/errors.classes");
const prayersRepository = require("../repositories/prayers.repositories");
const testimoniesRepository = require("../repositories/testimonies.repositories");

async function add(prayerId, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        if (!data.title && !data.content && !data.voiceContent) {
            throw new ValidationError("Either title, content or voiceContent must be provided.");
        };

        const prayer = await prayersRepository.getOneCurrentUserSubject(prayerId, userId);
        if (!prayer) throw new NotFoundError('Failed to find the prayer subject.');

        if (prayer.state !== 'close_exhausted') {
            prayer.state = 'close_exhausted';
            await prayer.save({ transaction });
        };

        // await prayer.createTestimony(data, { transaction });
        // return { testimonyId: prayer.testimonyId };

        const testimony = await testimoniesRepository.createTestimony(data, transaction);
        if (!testimony) throw new NotFoundError("Testimony not founded");
        
        prayer.setTestimony(testimony, { transaction });
        return testimony;
    });
};

module.exports = {
    add,
};
