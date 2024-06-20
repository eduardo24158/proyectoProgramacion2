const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
      login: true,
      name: req.session.name
    });
  }else{
    res.render('pages/inicio');
  }
});

router.get('/TerminosCondiciones', (req, res) => {
  res.render('pages/terminos');
});

module.exports = router;