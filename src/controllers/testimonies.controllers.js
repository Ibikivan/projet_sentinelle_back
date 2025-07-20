const { asyncHandler } = require("../middlewares/async-handler.middleware");

const add = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Testimony added successfully', testimony: req.body });
});

module.exports = {
    add,
};
