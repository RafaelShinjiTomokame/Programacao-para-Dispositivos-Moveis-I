const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const professorController = require('../controllers/professorController');

router.post('/professores', auth, authorize('admin'), professorController.criar);
router.get('/professores', auth, authorize('admin', 'professor'), professorController.listar);

module.exports = router;