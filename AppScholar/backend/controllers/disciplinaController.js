const pool = require('../database/db');

exports.criar = async (req, res) => {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;
  if (!nome || !carga_horaria || !professor_id || !curso || !semestre) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, carga_horaria, professor_id, curso, semestre]
    );
    return res.status(201).json({ mensagem: 'Disciplina cadastrada', disciplina: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao cadastrar' });
  }
};

exports.listar = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.nome, d.carga_horaria, d.curso, d.semestre, p.nome AS professor
      FROM disciplinas d
      JOIN professores p ON d.professor_id = p.id
      ORDER BY d.nome
    `);
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar' });
  }
};