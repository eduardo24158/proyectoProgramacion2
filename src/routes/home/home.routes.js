const { Router } = require("express");
const{geteliminarCuenta,PostEliminarcuenta} = require('../../controllers/cuentaEliminarDelete');
const router = Router();

router.get("/estudiante/home", (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
        login: true,
        name: req.session.name
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

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});



router.get('/estudiante/home/eliminarCuenta',geteliminarCuenta);
router.post('/estudiante/home/eliminarCuenta',PostEliminarcuenta)

module.exports = router;
