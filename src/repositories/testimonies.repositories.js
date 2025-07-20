const { Testimony } = require("../model");

async function createTestimony(data, transaction=null) {
    return await Testimony.create(data, { transaction });
}

module.exports = {
    createTestimony,
};