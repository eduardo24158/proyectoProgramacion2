const { Router } = require('express');

const {getInicioDeSesion,postSession,getHome,getinfoEstudiante,postinfoEstudiante}=require('../../controllers/administrador/administrador')

const router = Router();

router.get('/administrador/InicioDeSesion',getInicioDeSesion);
router.post('/administrador/InicioDeSesion',postSession);

router.get('/administrador/home',getHome);

router.get('/administrador/home/infoEstudiante',getinfoEstudiante)
router.post('/administrador/home/infoEstudiante',postinfoEstudiante)


router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;