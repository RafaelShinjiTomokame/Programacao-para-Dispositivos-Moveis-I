const pool = require('../database/db');

// Método para obter boletim (já existente - mantenha)
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
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao consultar boletim' });
  }
};

// NOVO MÉTODO: Lançar nota por matrícula e nome da disciplina
exports.lancarNota = async (req, res) => {
  const { matricula_aluno, nome_disciplina, nota1, nota2 } = req.body;

  // Validação
  if (!matricula_aluno || !nome_disciplina || nota1 === undefined || nota2 === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios: matricula_aluno, nome_disciplina, nota1, nota2' });
  }

  try {
    // Buscar aluno pela matrícula
    const alunoResult = await pool.query('SELECT * FROM alunos WHERE matricula = $1', [matricula_aluno]);
    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado com essa matrícula' });
    }
    const aluno = alunoResult.rows[0];

    // Buscar disciplina pelo nome
    const disciplinaResult = await pool.query('SELECT * FROM disciplinas WHERE nome ILIKE $1', [nome_disciplina]);
    if (disciplinaResult.rows.length === 0) {
      return res.status(404).json({ erro: 'Disciplina não encontrada com esse nome' });
    }
    const disciplina = disciplinaResult.rows[0];

    // Verificar se já existe nota para este aluno nesta disciplina
    const notaExistente = await pool.query(
      'SELECT * FROM notas WHERE aluno_id = $1 AND disciplina_id = $2',
      [aluno.id, disciplina.id]
    );

    if (notaExistente.rows.length > 0) {
      return res.status(400).json({ erro: 'Já existe nota lançada para este aluno nesta disciplina. Use a atualização.' });
    }

    // Calcular média e situação
    const media = (parseFloat(nota1) + parseFloat(nota2)) / 2;
    const situacao = media >= 6.0 ? 'Aprovado' : 'Reprovado';

    // Inserir nota
    const result = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [aluno.id, disciplina.id, nota1, nota2, media, situacao]
    );

    return res.status(201).json({
      mensagem: 'Nota lançada com sucesso!',
      nota: result.rows[0],
    });
  } catch (err) {
    console.error('Erro ao lançar nota:', err);
    return res.status(500).json({ erro: 'Erro interno ao lançar nota' });
  }
};

// Método para atualizar nota (mantenha como estava)
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