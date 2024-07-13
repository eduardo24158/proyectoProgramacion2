const { Router } = require('express');
const { getRegister, postRegisterStudent ,terminosCond } = require('../controllers/register.controller');

const router = Router();

router.get('/estudiante/register', getRegister);

router.post('/estudiante/register', postRegisterStudent);


router.get('/estudiante/register/terminos_Condiciones', terminosCond);

module.exports = router;