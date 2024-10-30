const usersController = require('../controllers/usersController');
const reviewController = require('../controllers/reviewController')
const auth = require('../middleware/auth');

async function appRoutes(fastify, options) {
  // Rotas de autenticação
  fastify.post('/login', usersController.login);
  fastify.post('/refresh', usersController.refreshToken);

  // Rotas de usuários com autenticação
  fastify.get('/users', { preHandler: [auth] }, usersController.index);
  fastify.get('/users/:id', { preHandler: [auth] }, usersController.show);
  fastify.post('/users', { preHandler: [auth] }, usersController.create);
  fastify.put('/users/:id', { preHandler: [auth] }, usersController.update);
  fastify.delete('/users/:id', { preHandler: [auth] }, usersController.remove);

  // Outras rotas (descomente e adicione conforme necessário)
  fastify.post('/reviews/:id', { preHandler: [auth] }, reviewController.create);
}

module.exports = appRoutes;