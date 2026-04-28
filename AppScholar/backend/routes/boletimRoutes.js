const express = require('express');
const router = express.Router();
const boletimController = require('../controllers/boletimController');

router.get('/boletim/:matricula', boletimController.obterBoletim);

module.exports = router;