const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const disciplinaController = require('../controllers/disciplinaController');

router.post('/disciplinas', auth, disciplinaController.criar);
router.get('/disciplinas', auth, disciplinaController.listar);

module.exports = router;