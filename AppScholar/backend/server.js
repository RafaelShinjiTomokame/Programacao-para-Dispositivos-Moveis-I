const express = require('express');
const cors = require('cors');
const pool = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const professorRoutes = require('./routes/professorRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const boletimRoutes = require('./routes/boletimRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', authRoutes);
app.use('/api', alunoRoutes);
app.use('/api', professorRoutes);
app.use('/api', disciplinaRoutes);
app.use('/api', boletimRoutes);

// Seed do usuário padrão
const bcrypt = require('bcryptjs');
async function seedUser() {
  const senha = await bcrypt.hash('123456', 10);
  try {
    await pool.query(
      `INSERT INTO usuarios (login, senha, nome, perfil) VALUES ($1, $2, $3, $4) ON CONFLICT (login) DO NOTHING`,
      ['admin@scholar.com', senha, 'Administrador', 'admin']
    );
    console.log('Usuário padrão criado: admin@scholar.com / 123456');
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  seedUser();
});