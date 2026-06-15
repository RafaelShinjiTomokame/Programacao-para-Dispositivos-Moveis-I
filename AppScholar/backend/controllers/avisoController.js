const pool = require('../database/db');

// Publicar novo aviso (admin e professor)
exports.criar = async (req, res) => {
  const { titulo, mensagem, data_expiracao, prioridade } = req.body;
  const autor_id = req.usuario.id;
  const autor_nome = req.usuario.nome;

  if (!titulo || !mensagem) {
    return res.status(400).json({ erro: 'Título e mensagem são obrigatórios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO avisos (titulo, mensagem, autor_id, autor_nome, data_expiracao, prioridade)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titulo, mensagem, autor_id, autor_nome, data_expiracao || null, prioridade || 'normal']
    );

    return res.status(201).json({
      mensagem: 'Aviso publicado com sucesso!',
      aviso: result.rows[0]
    });
  } catch (err) {
    console.error('Erro ao criar aviso:', err);
    return res.status(500).json({ erro: 'Erro ao publicar aviso' });
  }
};

// Listar avisos ativos (todos os usuários)
exports.listar = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM avisos 
       WHERE ativo = true 
       AND (data_expiracao IS NULL OR data_expiracao > CURRENT_TIMESTAMP)
       ORDER BY 
         CASE prioridade 
           WHEN 'alta' THEN 1 
           WHEN 'normal' THEN 2 
           WHEN 'baixa' THEN 3 
         END,
         data_publicacao DESC`
    );

    // Para cada aviso, verificar se o usuário atual já leu
    const avisosComLeitura = await Promise.all(
      result.rows.map(async (aviso) => {
        if (req.usuario) {
          const leitura = await pool.query(
            'SELECT * FROM avisos_lidos WHERE aviso_id = $1 AND usuario_id = $2',
            [aviso.id, req.usuario.id]
          );
          return { ...aviso, lido: leitura.rows.length > 0 };
        }
        return { ...aviso, lido: false };
      })
    );

    return res.json(avisosComLeitura);
  } catch (err) {
    console.error('Erro ao listar avisos:', err);
    return res.status(500).json({ erro: 'Erro ao listar avisos' });
  }
};

// Marcar aviso como lido
exports.marcarLido = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;

  try {
    await pool.query(
      `INSERT INTO avisos_lidos (aviso_id, usuario_id) 
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [id, usuario_id]
    );

    return res.json({ mensagem: 'Aviso marcado como lido' });
  } catch (err) {
    console.error('Erro ao marcar como lido:', err);
    return res.status(500).json({ erro: 'Erro ao marcar aviso como lido' });
  }
};

// Contar avisos não lidos (para notificação)
exports.contarNaoLidos = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const result = await pool.query(
      `SELECT COUNT(*) as total FROM avisos a
       WHERE a.ativo = true 
       AND (a.data_expiracao IS NULL OR a.data_expiracao > CURRENT_TIMESTAMP)
       AND a.id NOT IN (
         SELECT aviso_id FROM avisos_lidos WHERE usuario_id = $1
       )`,
      [usuario_id]
    );

    return res.json({ nao_lidos: parseInt(result.rows[0].total) });
  } catch (err) {
    console.error('Erro ao contar avisos:', err);
    return res.status(500).json({ erro: 'Erro ao contar avisos' });
  }
};

// Desativar aviso (admin)
exports.desativar = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('UPDATE avisos SET ativo = false WHERE id = $1', [id]);
    return res.json({ mensagem: 'Aviso desativado' });
  } catch (err) {
    console.error('Erro ao desativar aviso:', err);
    return res.status(500).json({ erro: 'Erro ao desativar aviso' });
  }
};