const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const alunoController = require('../controllers/alunoController');

router.post('/alunos', auth, alunoController.criar);
router.get('/alunos', auth, alunoController.listar);

module.exports = router;