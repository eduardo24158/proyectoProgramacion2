const { Router } = require('express');

const router = Router();

router.get('/estudiante/preEleccion',(req,res)=>{
    if (req.session.loggedin == true) {
        res.render('pages/estudiante/preEleccionMateria', {
          login: true,
          name: req.session.name
        });
    }else{
        res.redirect('/');
    }
});

module.exports = router;