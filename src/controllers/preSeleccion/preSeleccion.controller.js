const { connection } = require('../../db');

const getPre = (req, res) => {
    if (req.session.loggedin == true) {
        res.render('pages/principalHome/preEleccionMateria', {
          login: true,
          name: req.session.name
        });
    }else{
        res.redirect('/');
    }
}

const getPeriodo = (req, res) => {
    if (req.session.loggedin == true) {
        res.render('pages/principalHome/periodoEstu', {
            proceso: false,
            estatus: 'Elige a tu antojo'
        });
    }else{
        res.redirect('/');
    }
}

const postPeriodo = async (req, res) => {
    const semestre = req.body.select;
    
    connection.query('SELECT nombrePeriodo FROM periodo WHERE estatus = ?', [semestre], async(error, result) => {
        if (error) {
            console.log(error);
        }
        if (result[0].nombrePeriodo === '2025-1') {
            res.render('pages/principalHome/periodoEstu', {
                proceso: false,
                estatus: 'Este semestre por ahora está inactivo'
            });
        }else if(result[0].nombrePeriodo === '2024-2'){
            res.render('pages/principalHome/periodoEstu', {
                proceso: true,
                estatus: 'Procedamos'
            });
        }
    });
}

module.exports = {
    getPre,
    getPeriodo,
    postPeriodo
}