require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const userRoutes = require('./routes/usersRoutes');

// Registrar as rotas de usuários
fastify.register(userRoutes);

// Iniciar o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3333 });
    fastify.log.info(`Servidor rodando na porta 3333`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
