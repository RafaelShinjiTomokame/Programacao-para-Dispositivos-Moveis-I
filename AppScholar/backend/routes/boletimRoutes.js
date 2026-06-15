const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const boletimController = require('../controllers/boletimController');

router.get('/boletim/:matricula', auth, boletimController.obterBoletim);
router.post('/notas', auth, authorize('admin', 'professor'), boletimController.lancarNota);
router.put('/notas/:id', auth, authorize('admin', 'professor'), boletimController.atualizarNota);

module.exports = router;