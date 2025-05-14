module.exports = (err, req, res, next) => {
    if (err.statusCode && err.errorCode) {
        return res
            .status(err.statusCode)
            .json({ code: err.errorCode, message: err.message });
    }
    // Erreurs non prévues : 500
    console.error(err);
    res
        .status(500)
        .json({ code: 'SERVER_ERROR', message: err?.message, details: err?.details });
};
