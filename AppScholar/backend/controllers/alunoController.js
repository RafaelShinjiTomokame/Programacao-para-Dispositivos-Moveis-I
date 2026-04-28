const pool = require('../database/db');

exports.criar = async (req, res) => {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;
  if (!nome || !matricula || !curso || !email) {
    return res.status(400).json({ erro: 'Nome, matrícula, curso e email são obrigatórios' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado]
    );
    return res.status(201).json({ mensagem: 'Aluno cadastrado', aluno: result.rows[0] });
  } catch (err) {
    if (err.constraint === 'alunos_matricula_key') return res.status(400).json({ erro: 'Matrícula já existe' });
    if (err.constraint === 'alunos_email_key') return res.status(400).json({ erro: 'Email já cadastrado' });
    return res.status(500).json({ erro: 'Erro ao cadastrar aluno' });
  }
};

exports.listar = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos');
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar alunos' });
  }
};