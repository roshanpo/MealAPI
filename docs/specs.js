const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Meal API',
      version: '1.0.0',
      description: '',
    },
  },
  apis: ['./*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
