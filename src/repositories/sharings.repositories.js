const { Sharing } = require("../model");

async function createSharing(data, transaction = null) {
    return await Sharing.create(data, { transaction });
};

async function getSharingsBySubject(subjectId, transaction = null) {
  return await Sharing.findAll({
    where: { subject_id: subjectId },
    transaction,
  });
};

async function getSharingById(id, transaction = null) {
    return await Sharing.findByPk(id, { transaction });
};

async function updateSharing(id, data, transaction = null) {
    const [count] = await Sharing.update(data, {
        where: { id },
        transaction,
    });
    if (count === 0) return null;
    return await getSharingById(id, transaction);
};

async function deleteSharing(id, transaction = null) {
    return await Sharing.destroy({
        where: { id },
        transaction,
    });
};

module.exports = {
    createSharing,
    getSharingsBySubject,
    getSharingById,
    updateSharing,
    deleteSharing,
};
