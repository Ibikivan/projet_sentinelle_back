const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sentinelle API',
      version: '2.0.0',
      description: `
# API du Réseau Social de Prière Sentinelle

Cette API permet de gérer les sujets de prière, les groupes d'intercession, 
les communautés et les sessions de prière avec géolocalisation.

## Authentification

L'API utilise l'authentification par **JWT stocké en cookie HttpOnly**.
- Connectez-vous via \`POST /auth/login\`
- Le cookie \`session\` est automatiquement géré

## Pagination

Les endpoints de liste supportent la pagination :
- \`page\`: Numéro de page (défaut: 1)
- \`limit\`: Éléments par page (défaut: 20, max: 100)
- \`sortBy\`: Champ de tri
- \`sortOrder\`: \`asc\` ou \`desc\`
      `,
      contact: {
        name: 'Support Sentinelle',
        email: 'support@sentinelle.app',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      { 
        url: `${process.env.BACKEND_ENDPOINT || 'http://localhost:7000'}/api`,
        description: 'Serveur principal'
      }
    ],
    tags: [
      { name: 'Auth', description: 'Authentification et gestion de compte' },
      { name: 'Users', description: 'Gestion des utilisateurs' },
      { name: 'Prayers', description: 'Sujets de prière' },
      { name: 'Sessions', description: 'Sessions de prière' },
      { name: 'Testimonies', description: 'Témoignages' },
      { name: 'Sharings', description: 'Partages et commentaires' },
      { name: 'Cities', description: 'Villes et géolocalisation' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'session',
          description: 'JWT token stocké dans le cookie session'
        }
      },
      schemas: {
        // Common schemas
        UUID: {
          type: 'string',
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440000'
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 100 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            totalPages: { type: 'integer', example: 5 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false }
          }
        },
        Error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'BAD_REQUEST' },
            message: { type: 'string', example: 'Validation failed' },
            details: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        // User schemas
        User: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/schemas/UUID' },
            phoneNumber: { type: 'string', example: '+237600000000' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            firstName: { type: 'string', example: 'Jean' },
            lastName: { type: 'string', example: 'Dupont' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
            profilePicture: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateUser: {
          type: 'object',
          required: ['phoneNumber', 'email', 'password', 'firstName', 'lastName'],
          properties: {
            phoneNumber: { type: 'string', example: '+237600000000' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            cityId: { $ref: '#/components/schemas/UUID' }
          }
        },
        // Prayer Subject schemas
        PrayerSubject: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/schemas/UUID' },
            title: { type: 'string', example: 'Prière pour la guérison' },
            description: { type: 'string' },
            isPublic: { type: 'boolean', default: false },
            state: { type: 'string', enum: ['active', 'close_exhausted', 'close_expired'] },
            userId: { $ref: '#/components/schemas/UUID' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateSubject: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', maxLength: 255 },
            description: { type: 'string', maxLength: 2000 }
          }
        },
        // Session schemas
        PrayerSession: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/schemas/UUID' },
            status: { type: 'string', enum: ['active', 'completed'] },
            latitude: { type: 'number', format: 'float' },
            longitude: { type: 'number', format: 'float' },
            description: { type: 'string' },
            userId: { $ref: '#/components/schemas/UUID' },
            subjectId: { $ref: '#/components/schemas/UUID' },
            cityId: { $ref: '#/components/schemas/UUID' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        // Sharing schemas
        Sharing: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/schemas/UUID' },
            content: { type: 'string' },
            voiceUrl: { type: 'string', nullable: true },
            type: { type: 'string', enum: ['text', 'voice'] },
            userId: { $ref: '#/components/schemas/UUID' },
            subjectId: { $ref: '#/components/schemas/UUID' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        // Testimony schemas
        Testimony: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/schemas/UUID' },
            title: { type: 'string' },
            content: { type: 'string' },
            voiceContent: { type: 'string', nullable: true },
            attachements: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        // City schemas
        City: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/schemas/UUID' },
            name: { type: 'string', example: 'Douala' },
            countryCode: { type: 'string', example: 'CM' },
            countryName: { type: 'string', example: 'Cameroon' },
            continent: { type: 'string', example: 'AF' },
            continentName: { type: 'string', example: 'Africa' },
            lat: { type: 'number', format: 'float' },
            lng: { type: 'number', format: 'float' },
            population: { type: 'integer' }
          }
        },
        // Membership schemas
        CrewMember: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/schemas/UUID' },
            userId: { $ref: '#/components/schemas/UUID' },
            prayerCrewId: { $ref: '#/components/schemas/UUID' },
            role: { type: 'string', enum: ['admin', 'moderator', 'member'] },
            status: { type: 'string', enum: ['pending', 'accepted', 'banned', 'left'] },
            joinedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        CommunityMember: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/schemas/UUID' },
            userId: { $ref: '#/components/schemas/UUID' },
            communityId: { $ref: '#/components/schemas/UUID' },
            role: { type: 'string', enum: ['responsable', 'moderator', 'member'] },
            status: { type: 'string', enum: ['pending', 'accepted', 'banned', 'left'] },
            joinedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Non authentifié',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { code: 'UNAUTHORIZED', message: 'Missing token' }
            }
          }
        },
        Forbidden: {
          description: 'Accès refusé',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { code: 'FORBIDDEN', message: 'Access denied' }
            }
          }
        },
        NotFound: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { code: 'NOT_FOUND', message: 'Resource not found' }
            }
          }
        },
        ValidationError: {
          description: 'Erreur de validation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    security: [{ cookieAuth: [] }]
  },
  apis: ['./src/docs/paths/*.yaml']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
