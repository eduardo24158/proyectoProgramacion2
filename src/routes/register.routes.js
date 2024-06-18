const { Router } = require('express');
const { getRegister, postRegisterStudent ,terminosCond } = require('../controllers/register.controller');

const router = Router();

router.get('/estudiante/index', getRegister);

router.post('/estudiante/index', postRegisterStudent);

router.get('/estudiante/index/terminos_Condiciones', terminosCond);

module.exports = router;