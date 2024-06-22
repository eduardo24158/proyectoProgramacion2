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
    let arregloNombre= [];
    let udc=21;
    const datos = Object.entries(data);

    datos.forEach(([contenido, value]) => {
        udc-=value;
        if(udc>12){
        arregloNombre.push(contenido)
        }
        });

        if(udc<12){
        console.log('sobrepaso su limite de unidades de creditos quite alguna materia');
        } else{
        let voto=1;
        for (let i = 0; i < arregloNombre.length; i++) {
        const query= "UPDATE materias SET  creditoMateria =creditoMateria+ ? WHERE nameMateria = ?"
        connection.query(query,[voto,arregloNombre[i]],async (error,result)=>{if(error){  console.error('Error updating the record:', error); }})
        console.log('se a guardados los votos')
        }
        console.log(arregloNombre)
        res.render('pages/principalHome/ConfirmEleccion',{nombre:arregloNombre});
    }
}





const getPeriodo = (req, res) => {
    if (req.session.loggedin == true) {
        res.render('pages/principalHome/periodo', {
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
        if (result[0].nombrePeriodo === '2025-1') {
            res.render('pages/principalHome/periodo', {
                proceso: false,
                estatus: 'Este semestre por ahora está inactivo'
            });
        }else if(result[0].nombrePeriodo === '2024-2'){
            res.render('pages/principalHome/periodo', {
                proceso: true,
                estatus: 'Procedamos'
            });
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