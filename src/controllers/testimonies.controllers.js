const { asyncHandler } = require("../middlewares/async-handler.middleware");
const testimoniesServices = require("../services/testimonies.services");

const add = asyncHandler(async (req, res) => {
    const testimony = await testimoniesServices.add(req.params.prayerId, req.user.id, req.body);
    res.status(200).json({ message: 'Testimony added successfully', testimony });
});

module.exports = {
    add,
};
