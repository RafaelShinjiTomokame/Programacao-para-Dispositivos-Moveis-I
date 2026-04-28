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