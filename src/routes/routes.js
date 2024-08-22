const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
// const anotherController = require('../controllers/anotherController');

async function appRoutes(fastify, options) {
  // Rotas de usuários
  fastify.post('/login', usersController.login);
  fastify.post('/refresh', usersController.refreshToken);

  fastify.get('/users', { preHandler: [auth] }, usersController.index);
  fastify.get('/users/:id', { preHandler: [auth] }, usersController.show);
  fastify.post('/users', { preHandler: [auth] }, usersController.create);
  fastify.put('/users/:id', { preHandler: [auth] }, usersController.update);
  fastify.delete('/users/:id', { preHandler: [auth] }, usersController.remove);

  // Rotas para outro controller
  // fastify.get('/anotherRoute', anotherController.someMethod);
}

module.exports = appRoutes;
