const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  
  if (req.session.loggedin) {
      res.render('pages/estudiante/home', {
        login: true,
        name: req.session.name
      });
    }else{
      res.render('pages/estudiante/inicioDeSesion')
    }
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
});

module.exports = router;