const { Router } = require('express');

const router = Router();

router.get('/estudiante/datos',(req,res)=>{

    console.log(req.session.name);
    console.log(req.session.lastname);
    if(req.session.loggedin == true) {
        res.render('pages/estudiante/datos', {
          login: true,
          name: req.session.name,
          lastname: req.session.lastname,
          age: req.session.age,
          email: req.session.email,
          cedula: req.session.cedula,
        });
      }else{
        res.redirect('/');
      }
});

module.exports = router;