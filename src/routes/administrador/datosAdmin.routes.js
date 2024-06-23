const { Router } = require('express');

const router = Router();

router.get('/administrador/datos',(req,res)=>{
    if(req.session.Adminloggedin == true) {
        res.render('pages/administrador/DatosAdmin', {
          login: true,
          AdminName: req.session.adminName,
          Adminlastname: req.session.Adminlastname ,
          Adminage: req.session.Adminage,
          Adminemail: req.session.Adminemail,
          Admincedula: req.session.Admincedula,
        });
      }else{
        res.redirect('/');
      }
});

module.exports = router;