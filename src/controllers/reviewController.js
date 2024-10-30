const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Criar um novo review 
async function create(req, reply) {
  const { title, text, video_link, ad_link } = req.body;
  const userId = req.user.id; // Pegando o ID do usuário autenticado

  try {
    const result = await db.query(
      'INSERT INTO reviews (user_id, title, text, video_link, ad_link) VALUES (?, ?, ?, ?, ?)',
      [userId, title, text, video_link, ad_link]
    );

    return reply.status(201).send({
      id: result[0].insertId,
      user_id: userId,
      title,
      text,
      video_link,
      ad_link
    });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Erro ao criar Review' });
  }
}


module.exports = {
  create,
};
