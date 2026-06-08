const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./database/db');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const professorRoutes = require('./routes/professorRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const boletimRoutes = require('./routes/boletimRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', authRoutes);
app.use('/api', alunoRoutes);
app.use('/api', professorRoutes);
app.use('/api', disciplinaRoutes);
app.use('/api', boletimRoutes);

// Seed de usuários
async function seedUsers() {
  const senha = await bcrypt.hash('123456', 10);
  const usuarios = [
    { login: 'admin@scholar.com', nome: 'Administrador', role: 'admin' },
    { login: 'professor@scholar.com', nome: 'Carlos Silva', role: 'professor' },
    { login: 'aluno@scholar.com', nome: 'Maria Santos', role: 'aluno' },
  ];

  for (const user of usuarios) {
    try {
      await pool.query(
        `INSERT INTO usuarios (login, senha, nome, perfil, role) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (login) DO UPDATE SET role = $5, nome = $3`,
        [user.login, senha, user.nome, user.role, user.role]
      );
    } catch (err) {
      console.error(`Erro ao criar ${user.login}:`, err);
    }
  }
  console.log('✅ Usuários criados:');
  console.log('   admin@scholar.com / 123456 (admin)');
  console.log('   professor@scholar.com / 123456 (professor)');
  console.log('   aluno@scholar.com / 123456 (aluno)');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  seedUsers();
});