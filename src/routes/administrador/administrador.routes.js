const { Router } = require('express');

const {getInicioDeSesion,postSession,getHome}=require('../../controllers/administrador/administrador')

const router = Router();

router.get('/administrador/InicioDeSesion',getInicioDeSesion);
router.post('/administrador/InicioDeSesion',postSession);

router.get('/administrador/home',getHome);




router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;