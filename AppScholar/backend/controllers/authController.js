const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = async (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) return res.status(400).json({ erro: 'Campos obrigatórios' });

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE login = $1', [login]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: user.id, login: user.login, nome: user.nome, perfil: user.perfil, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      usuario: { nome: user.nome, perfil: user.perfil, role: user.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno' });
  }
};