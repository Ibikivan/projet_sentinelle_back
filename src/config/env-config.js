const logger = require('../utils/logger');

async function envVarTest() {
    try {
        const env = require('./');
        if (env) {
            logger.info(`Environment: ${env.default.NODE_ENV}`);
        };
    } catch (error) {
        logger.fatal({ err: error }, 'Env configuration error');
        process.exit(1);
    };
};

module.exports = envVarTest;
