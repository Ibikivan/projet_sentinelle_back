
async function envVarTest() {
    try {
        const env = require('./');
        if (env) {
            console.log(`Environment: ${env.default.NODE_ENV}`);
        };
    } catch (error) {
        console.error('Env configuration error:', error);
        process.exit(1);
    };
};

module.exports = envVarTest;
