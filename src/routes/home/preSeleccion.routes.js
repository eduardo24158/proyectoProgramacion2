const { Router } = require('express');
const { getPre, getPeriodo, postPeriodo,getseleccion,postseleccion,getPreResultados,postPreResultados,getResultados} = require('../../controllers/preSeleccion/preSeleccion.controller');

const router = Router();

router.get('/estudiante/preEleccion', getPre);

router.get('/estudiante/preEleccion/periodo', getPeriodo);
router.post('/estudiante/preEleccion/periodo', postPeriodo);

router.get('/estudiante/preEleccion/seleccion',getseleccion);
router.post('/estudiante/preEleccion/seleccion',postseleccion);

router.get('/estudiante/preEleccion/preResultado',getPreResultados);
router.post('/estudiante/preEleccion/preResultado',postPreResultados);

router.get('/estudiante/preEleccion/resultados',getResultados);

module.exports = router;