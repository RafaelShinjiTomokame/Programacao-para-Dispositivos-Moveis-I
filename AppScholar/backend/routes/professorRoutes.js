const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const professorController = require('../controllers/professorController');

// Protegido por autenticação
router.post('/professores', auth, professorController.criar);
router.get('/professores', auth, professorController.listar);

module.exports = router;