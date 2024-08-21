const usersController = require('../controllers/usersController');

async function userRoutes(fastify, options) {
  fastify.get('/users', usersController.index);
  fastify.get('/users/:id', usersController.show);
  fastify.post('/users', usersController.create);
  fastify.put('/users/:id', usersController.update);
  fastify.delete('/users/:id', usersController.remove);
}

module.exports = userRoutes;
