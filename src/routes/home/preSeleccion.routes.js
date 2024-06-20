const { Router } = require('express');
const { getPre, getPeriodo, postPeriodo } = require('../../controllers/preSeleccion/preSeleccion.controller');

const router = Router();

router.get('/estudiante/preEleccion', getPre);

router.get('/estudiante/preEleccion/periodo', getPeriodo);

router.post('/estudiante/preEleccion/periodo', postPeriodo);

module.exports = router;