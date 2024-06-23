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
      const query='SELECT materias.nameMateria,materias.creditoMateria,semestre.nombreSemestre,semestre.id,materias.semestre_id  FROM materias join semestre on(materias.semestre_id=semestre.id) ;'
      connection.query(query,(error,result)=>{
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
          const query = "UPDATE materias SET  votosMaterias =votosMaterias+ ? WHERE nameMateria = ?"
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

/*
const postseleccion = (req, res) => {
  const data = req.body;
  let arregloNombre = [];
  let udc = 21;
  const datos = Object.entries(data);
  req.session.close = false;

  datos.forEach(([contenido, value]) => {
    udc -= value;

    if (udc > 12) {
      arregloNombre.push(contenido);
    }
  });

  if (udc < 12) {
    res.render('pages/principalHome/seleccion', {
      ud: 9,
      status: true,
      men: 'Te estás sobrepasando de Unidades de Crédito',
      arreglo: false,
      close: false,
    });
  } else {
    // Verificar si ya existe una inscripción
    const usuario_id = req.session.usuario_id; // Obtén el ID del usuario desde la sesión
    const promises = arregloNombre.map((materia) => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM inscripciones WHERE usuario_id = ? AND materia = ?';
        connection.query(query, [usuario_id, materia], (error, result) => {
          if (error) {
            console.error('Error al verificar inscripción:', error);
            reject(error);
          } else {
            if (result.length > 0) {
              // El usuario ya está inscrito en esta materia
              resolve({ materia, inscrito: true });
            } else {
              // El usuario no está inscrito en esta materia
              resolve({ materia, inscrito: false });
            }
          }
        });
      });
    });

    Promise.all(promises)
      .then((results) => {
        const materiasInscritas = results.filter((r) => r.inscrito).map((r) => r.materia);
        if (materiasInscritas.length > 0) {
          // El usuario ya está inscrito en algunas materias
          req.session.close = true;
          res.render('pages/principalHome/ConfirmEleccion', {
            nombre: materiasInscritas,
            close: req.session.close,
          });
        } else {
          // Insertar la nueva inscripción
          const voto = 1;
          for (let i = 0; i < arregloNombre.length; i++) {
            const query = 'UPDATE materias SET unidadCredito = unidadCredito + ? WHERE materia = ?';
            connection.query(query, [voto, arregloNombre[i]], (error, result) => {
              if (error) {
                console.error('Error al actualizar el registro:', error);
              }
            });
          }
          console.log('Se han guardado los datos');
          req.session.close = true;
          res.render('pages/principalHome/ConfirmEleccion', {
            nombre: arregloNombre,
            close: req.session.close,
          });
        }
      })
      .catch((error) => {
        console.error('Error al verificar inscripciones:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
      });
  }
};


*/