const pool = require('../database/db');

exports.obterBoletim = async (req, res) => {
  const { matricula } = req.params;
  try {
    const alunoResult = await pool.query('SELECT * FROM alunos WHERE matricula = $1', [matricula]);
    if (alunoResult.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado' });
    const aluno = alunoResult.rows[0];

    const notasResult = await pool.query(
      `SELECT d.nome AS disciplina, n.nota1, n.nota2, n.media, n.situacao
       FROM notas n
       JOIN disciplinas d ON n.disciplina_id = d.id
       WHERE n.aluno_id = $1`,
      [aluno.id]
    );

    return res.json({
      aluno: aluno.nome,
      matricula: aluno.matricula,
      disciplinas: notasResult.rows
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao consultar boletim' });
  }
};

exports.lancarNota = async (req, res) => {
  const { aluno_id, disciplina_id, nota1, nota2 } = req.body;
  if (!aluno_id || !disciplina_id || nota1 === undefined || nota2 === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios' });
  }
  const media = (parseFloat(nota1) + parseFloat(nota2)) / 2;
  const situacao = media >= 6.0 ? 'Aprovado' : 'Reprovado';

  try {
    const result = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [aluno_id, disciplina_id, nota1, nota2, media, situacao]
    );
    return res.status(201).json({ mensagem: 'Nota lançada', nota: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao lançar nota' });
  }
};

exports.atualizarNota = async (req, res) => {
  const { id } = req.params;
  const { nota1, nota2 } = req.body;
  const media = (parseFloat(nota1) + parseFloat(nota2)) / 2;
  const situacao = media >= 6.0 ? 'Aprovado' : 'Reprovado';

  try {
    const result = await pool.query(
      `UPDATE notas SET nota1 = $1, nota2 = $2, media = $3, situacao = $4 WHERE id = $5 RETURNING *`,
      [nota1, nota2, media, situacao, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Nota não encontrada' });
    return res.json({ mensagem: 'Nota atualizada', nota: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar nota' });
  }
};