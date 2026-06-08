const pool = require('../database/db');

exports.criar = async (req, res) => {
  // Agora recebe professor_responsavel como string
  const { nome, carga_horaria, professor_responsavel, curso, semestre } = req.body;
  
  if (!nome || !carga_horaria || !professor_responsavel || !curso || !semestre) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    // Como professor_responsavel é uma string, salvamos diretamente
    // Se a tabela ainda tem professor_id, você precisa adaptar:
    // Opção 1: Alterar a tabela para aceitar string
    // Opção 2: Buscar/criar professor pelo nome
    
    // Vou mostrar a Opção 1 (mais simples): 
    // Execute este SQL no banco antes:
    // ALTER TABLE disciplinas DROP COLUMN professor_id;
    // ALTER TABLE disciplinas ADD COLUMN professor_responsavel VARCHAR(100);

    const result = await pool.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_responsavel, curso, semestre) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, carga_horaria, professor_responsavel, curso, semestre]
    );
    
    return res.status(201).json({ 
      mensagem: 'Disciplina cadastrada com sucesso!', 
      disciplina: result.rows[0] 
    });
  } catch (err) {
    console.error('Erro ao cadastrar disciplina:', err);
    return res.status(500).json({ erro: 'Erro ao cadastrar disciplina' });
  }
};

exports.listar = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nome, carga_horaria, professor_responsavel, curso, semestre
      FROM disciplinas 
      ORDER BY nome
    `);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao listar disciplinas' });
  }
};