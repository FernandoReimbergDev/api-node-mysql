require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const appRoutes = require('./routes/routes');

// Registrar as rotas da aplicação
fastify.register(appRoutes);

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
