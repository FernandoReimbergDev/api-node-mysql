const jwt = require('jsonwebtoken');

async function auth(req, reply) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Define `req.user` com o usuário decodificado do token
  } catch (err) {
    return reply.status(401).send({ error: 'Token inválido' });
  }
}

module.exports = auth;
