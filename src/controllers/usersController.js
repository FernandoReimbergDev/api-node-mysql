const bcrypt = require('bcryptjs');
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
    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Salva o usuário com a senha criptografada
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

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
    let hashedPassword;

    if (password) {
      // Gera o hash da nova senha
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Constrói a query de atualização
    const updateFields = {
      name,
      email,
      ...(password && { password: hashedPassword }), // Atualiza a senha apenas se ela for fornecida
    };

    const query = 'UPDATE users SET ? WHERE id = ?';
    const result = await db.query(query, [updateFields, id]);

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
