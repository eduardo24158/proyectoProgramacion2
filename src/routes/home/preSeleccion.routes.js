const { Router } = require('express');
const { getPre, getPeriodo, postPeriodo,getseleccion,postseleccion,getSemestreEleccion,postSemestreEleccion,getPreResultados,postPreResultados,getResultados} = require('../../controllers/preSeleccion/preSeleccion.controller');

const router = Router();

router.get('/estudiante/preEleccion', getPre);

router.get('/estudiante/preEleccion/periodo', getPeriodo);
router.post('/estudiante/preEleccion/periodo', postPeriodo);

router.get('/estudiante/preEleccion/SemestreEleccion',getSemestreEleccion);
router.post('/estudiante/preEleccion/SemestreEleccion',postSemestreEleccion);

router.get('/estudiante/preEleccion/seleccion',getseleccion);
router.post('/estudiante/preEleccion/seleccion',postseleccion);



router.get('/estudiante/preEleccion/preResultado',getPreResultados);
router.post('/estudiante/preEleccion/preResultado',postPreResultados);


module.exports = router;