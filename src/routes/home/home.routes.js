const { Router } = require("express");

const router = Router();

router.get("/estudiante/home", (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
      login: true,
      name: req.session.name
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

module.exports = router;
