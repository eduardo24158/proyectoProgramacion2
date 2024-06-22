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

const getseleccion = (req, res) => {
    connection.query('SELECT * FROM materias',(reject,result)=>{
        console.log(result)
    res.render('pages/principalHome/seleccion',{
        arreglo: result,
        ud:9
    })
    })
}

const postseleccion=(req,res)=>{
    const data=req.body;
    let objeto= {};
    let udc=21;
    const datos = Object.entries(data);
    datos.forEach(([contenido, value]) => {
        udc-=value;
        if(udc>12){ 
            let voto=1;
            connection.query('UPDATE preseleccioncursos.materias SET creditoMateria= ?  WHERE materias.nameMateria= ? ',voto,contenido,async (error,result)=>{ console.log(result)})
                }
            });

    if(udc<12){
                console.log('sobrepaso su limite de unidades de creditos quite alguna materia');
            }else{
                console.log('se ha guardado sus votos');
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
        console.log(result[0].nombrePeriodo)
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

module.exports = {
    getPre,
    getPeriodo,
    postPeriodo,
    getseleccion,
    postseleccion
}