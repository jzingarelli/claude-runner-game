import type { OpenAPIV3 } from 'openapi-types';

export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.1',
  info: { title: 'Analytics API', version: '1.0.0' },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/auth/register': { post: { summary: 'Register', responses: { '201': { description: 'Created' } } } },
    '/auth/login': { post: { summary: 'Login', responses: { '200': { description: 'OK' } } } },
    '/users': { get: { summary: 'List users', responses: { '200': { description: 'OK' } } } }
  },
  components: {},
};
