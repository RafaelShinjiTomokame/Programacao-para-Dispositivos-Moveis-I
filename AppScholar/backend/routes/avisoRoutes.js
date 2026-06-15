const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const avisoController = require('../controllers/avisoController');

// Criar aviso (admin e professor)
router.post('/avisos', auth, authorize('admin', 'professor'), avisoController.criar);

// Listar avisos (todos os autenticados)
router.get('/avisos', auth, avisoController.listar);

// Contar não lidos (todos os autenticados)
router.get('/avisos/nao-lidos', auth, avisoController.contarNaoLidos);

// Marcar como lido (todos os autenticados)
router.post('/avisos/:id/ler', auth, avisoController.marcarLido);

// Desativar aviso (admin)
router.put('/avisos/:id/desativar', auth, authorize('admin'), avisoController.desativar);

module.exports = router;