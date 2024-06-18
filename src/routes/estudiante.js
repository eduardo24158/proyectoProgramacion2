const express = require('express');
const router = express.Router();

/* GET home page. */

router.get('/',(req,res)=>{
  res.render('pages/inicio')
})
router.get('/estudiante/registro', (req, res) => {
  if(req.session.loggedin != true){
    res.render('pages/estudiante/index');
  }else{
    res.redirect('/estudiante/home')
  }
});

router.get('/estudiante/inicio', (req, res) => {
  if(req.session.loggedin != true){
    res.render('pages/estudiante/inicioDeSesion');
  }else{
    res.redirect('/estudiante/home')
  }
});

router.get('/estudiante/home', (req, res) => {
  res.render('pages/estudiante/home');
});
router.get('/estudiante/datos',(req,res)=>{
  res.render('pages/estudiante/datos');
})
router.get('/estudiante/preEleccion',(req,res)=>{
  res.render('pages/estudiante/preEleccionMateria');
})

router.get('/estudiante/datos',(req,res)=>{
  res.render('pages/estudiante/datos');
})

router.get('/TerminosCondiciones', (req, res) => {
  res.render('pages/terminos');
});


module.exports = router;