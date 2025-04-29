const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'Sentinelle Project API',
        version: '1.0.0',
        description: 'API documentation for Sentille Prayer Project',
    },
    servers: [{ url: `http://localhost:${process.env.PORT}/api` }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'session'
        }
      }
    },
    // security: [{ cookieAuth: [] }]
  },
  apis: ['./src/docs/**/*.yaml']  // ← tes fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
