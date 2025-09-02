const { Sharing } = require("../model");

async function createSharing(data, transaction = null) {
    return await Sharing.create(data, { transaction });
};

async function getSharingsBySubject(subjectId, params = {}, transaction = null) {
  const where = { subjectId };
  const include = [];
  const order = [];

  if (params.type) where.type = params.type;
  if (params.userId) where.userId = params.userId;

  if (params.includeUser === 'true')
    include.push({ association: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] });

  const validSortFields = ['createdAt', 'type'];
  if (params.sortBy && validSortFields.includes(params.sortBy)) {
    const sortOrder = params.sortOrder === 'asc' ? 'ASC' : 'DESC';
    order.push([params.sortBy, sortOrder]);
  } else {
    order.push(['createdAt', 'DESC']);
  }

  const limit = params.limit ? parseInt(params.limit, 10) : undefined;
  const page = params.page ? parseInt(params.page, 10) : undefined;
  const offset = limit && page ? (page - 1) * limit : undefined;

  return await Sharing.findAll({ where, include, order, limit, offset, transaction });
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
