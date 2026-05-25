const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const alunoController = require('../controllers/alunoController');

router.post('/alunos', auth, authorize('admin'), alunoController.criar);
router.get('/alunos', auth, authorize('admin', 'professor'), alunoController.listar);

module.exports = router;