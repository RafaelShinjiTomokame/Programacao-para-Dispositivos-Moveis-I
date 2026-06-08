const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const disciplinaController = require('../controllers/disciplinaController');

router.post('/disciplinas', auth, authorize('admin'), disciplinaController.criar);
router.get('/disciplinas', auth, authorize('admin', 'professor', 'aluno'), disciplinaController.listar);

module.exports = router;