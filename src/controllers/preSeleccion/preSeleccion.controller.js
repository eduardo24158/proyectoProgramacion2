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
    if(req.session.loggedin == true){
      connection.query('SELECT * FROM materias',(error,result)=>{
        if(error){
          console.log(error);
        }
        
        res.render('pages/principalHome/seleccion',{
          arreglo: result,
          ud:9,
          status: false,
          close: false
        });
      });
    }else{
      res.redirect('/');
    }
  };

const postseleccion=(req,res)=>{
    const data = req.body;
    let arregloNombre = [];
    let udc = 21;
    const datos = Object.entries(data);
    req.session.close = false;

    datos.forEach(([contenido, value]) => {
        udc -= value;

        if(udc > 12){
          arregloNombre.push(contenido);
        }
    });

      if(udc < 12){
        res.render('pages/principalHome/seleccion', {
          ud: 9,
          status: true,
          men: 'Te estás SobrePasando de Unidades de Crédito',
          arreglo: false,
          close: false
        });
      }else{
        let voto=1;
        for (let i = 0; i < arregloNombre.length; i++) {
          const query = "UPDATE materias SET unidadCredito = unidadCredito + ? WHERE materia = ?"
          connection.query(query, [voto, arregloNombre[i]], async (error, result)=>{
            if(error){
              console.error('Error updating the record:', error); 
            }
          });
          console.log('se han guardado los datos');
        }
        console.log(arregloNombre);
        req.session.close = true;
        res.render('pages/principalHome/ConfirmEleccion',{
          nombre: arregloNombre,
          close: req.session.close
        });
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
    postPeriodo,
    getseleccion,
    postseleccion
}