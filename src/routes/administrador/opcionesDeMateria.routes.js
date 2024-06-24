const { Router } = require('express');
const {getAdminOpciones,getMateriaIngresar,postMateriaIngresar,getMateriaEliminar,postMateriaEliminar} =require('../../controllers/administrador/adminOpciones')
const router = Router();

router.get('/administrador/Materia/Opciones',getAdminOpciones)

router.get('/administrador/Materia/Ingresar',getMateriaIngresar)
router.post('/administrador/Materia/Ingresar',postMateriaIngresar)

router.get('/administrador/Materia/eliminar',getMateriaEliminar)
router.post('/administrador/Materia/eliminar',postMateriaEliminar)


module.exports = router;