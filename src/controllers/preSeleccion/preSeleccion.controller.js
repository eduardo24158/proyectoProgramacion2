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
        console.log(result)
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            if (result[0].nombrePeriodo == '2025-1') {
                res.render('pages/principalHome/periodoEstu', {
                    proceso: false,
                    estatus: 'Este semestre por ahora está inactivo'
                });
            }else if(result[0].nombrePeriodo == '2024-2'){
                res.render('pages/principalHome/periodoEstu', {
                    proceso: true,
                    estatus: 'Procedamos'
                });
            }
        }else{
            res.send('No seleccionaste bien, por favor intentelo más tarde');
        }
    });
}

const getseleccion = (req, res) => {
    connection.query('SELECT * FROM materias m JOIN carrera c ON(m.carrera_id = c.id) JOIN semestre s ON(m.semestre_id = s.id)', async (error,result) => {
        console.log(result)

        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            res.render('pages/principalHome/seleccion',{
                arreglo: result
            });
        }
    })
}

module.exports = {
    getPre,
    getPeriodo,
    postPeriodo,
    getseleccion
}