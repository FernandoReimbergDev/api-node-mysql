const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Função de login para autenticar o usuário e gerar um token
async function login(req, reply) {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const [rows] = await db.query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return reply.status(401).send({ error: 'Credenciais inválidas' });
    }

    // Verificar se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(401).send({ error: 'Credenciais inválidas' });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    return reply.send({ token });
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Erro ao fazer login' });
  }
}
// Função para renovar o token
async function refreshToken(req, reply) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar o token, ignorando a expiração
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    // Verificar se o usuário ainda existe (opcional, mas recomendado)
    const [rows] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.id]);
    const user = rows[0];

    if (!user) {
      return reply.status(401).send({ error: 'Usuário não encontrado' });
    }

    // Gerar um novo token
    const newToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    return reply.send({ token: newToken });
  } catch (err) {
    return reply.status(401).send({ error: 'Token inválido' });
  }
}

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
  login,
  refreshToken,
  index,
  show,
  create,
  update,
  remove,
};
