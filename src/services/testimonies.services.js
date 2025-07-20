const { sequelize } = require("../model");

async function add(data) {
    return await sequelize.transaction(async (transaction) => {
        return { data: 'all data in' };
    });
};

module.exports = {
    add,
};
