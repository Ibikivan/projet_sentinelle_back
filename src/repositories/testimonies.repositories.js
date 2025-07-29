const { Testimony } = require("../model");

async function createTestimony(data, transaction=null) {
    return await Testimony.create(data, { transaction });
};

async function getTestimonyById(id, transaction = null) {
    return await Testimony.findByPk(id, { transaction });
};

async function updateTestimony(id, data, transaction = null) {
    const [count] = await Testimony.update(data, {
        where: { id },
        transaction,
    });
    if (!count) return null;
    return await getTestimonyById(id, transaction);
};

async function deleteTestimony(id, transaction = null) {
    return await Testimony.destroy({
        where: { id },
        transaction,
    });
};


module.exports = {
    createTestimony,
    getTestimonyById,
    updateTestimony,
    deleteTestimony,
};