const db = require('../database/db');

// Listar todos os usuários
async function index(req, reply) {
  try {
    const [rows] = await db.query('SELECT id, name, email FROM users');
    return reply.send(rows);
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Erro ao buscar usuários' });
  }
}

// Mostrar um usuário específico
async function show(req, reply) {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
    return reply.send(rows[0]);
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Erro ao buscar o usuário' });
  }
}

// Criar um novo usuário
async function create(req, reply) {
  const { name, email, password } = req.body;
  try {
    const result = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    return reply.status(201).send({ id: result[0].insertId, name, email });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Erro ao criar usuário' });
  }
}

// Atualizar um usuário existente
async function update(req, reply) {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const result = await db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id]);
    if (result[0].affectedRows === 0) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
    return reply.send({ message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Erro ao atualizar usuário' });
  }
}

// Deletar um usuário
async function remove(req, reply) {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result[0].affectedRows === 0) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }
    return reply.send({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Erro ao deletar usuário' });
  }
}

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
