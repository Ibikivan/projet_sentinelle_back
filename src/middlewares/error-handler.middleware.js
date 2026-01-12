const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    if (err.statusCode && err.errorCode) {
        return res
            .status(err.statusCode)
            .json({ code: err.errorCode, message: err.message });
    }
    // Erreurs non prévues : 500
    logger.error({ err, req: { method: req.method, url: req.url } }, 'Unhandled error');
    res
        .status(500)
        .json({ code: 'SERVER_ERROR', message: err?.message, details: err?.details });
};
