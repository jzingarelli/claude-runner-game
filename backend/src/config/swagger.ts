import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Enterprise Social Media Analytics API',
      version: '1.0.0',
      description: 'REST API for analytics platform with auth, RBAC, and integrations',
    },
    servers: [
      { url: '/api/v1', description: 'v1' },
      { url: '/api/v2', description: 'v2' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts', 'src/models/**/*.ts'],
});
