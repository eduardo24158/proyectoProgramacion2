const { Router } = require('express');

const router = Router();

router.get('/administrador/nuevaMaterias/carrera',(req,res)=>{
  res.render('pages/administrador/carrera')
})


module.exports = router;