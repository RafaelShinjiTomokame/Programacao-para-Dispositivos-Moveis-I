const pool = require('../database/db');

exports.criar = async (req, res) => {
  const { nome, titulacao, area, tempo_docencia, email } = req.body;
  if (!nome || !titulacao || !area || !tempo_docencia || !email) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email]
    );
    return res.status(201).json({ mensagem: 'Professor cadastrado', professor: result.rows[0] });
  } catch (err) {
    if (err.constraint === 'professores_email_key') return res.status(400).json({ erro: 'Email já cadastrado' });
    return res.status(500).json({ erro: 'Erro ao cadastrar professor' });
  }
};

exports.listar = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM professores ORDER BY nome');
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar professores' });
  }
};