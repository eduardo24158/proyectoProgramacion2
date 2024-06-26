const { Router } = require('express');

const router = Router();

router.get('/estudiante/datos', (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/principalHome/datos', {
      login: true,
      name: req.session.name,
      lastname: req.session.lastname,
      age: req.session.age,
      email: req.session.email,
      cedula: req.session.cedula,
    });
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
  }else{
    res.redirect('/');
  }
});

module.exports = router;