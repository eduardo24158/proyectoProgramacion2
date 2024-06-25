const { connection } = require('../../db');

const getPre = (req, res) => {
  req.session.loggedin
  if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
        
    });
}else{
    res.render('pages/principalHome/preEleccionMateria',{name: req.session.name})
}
}

const getPeriodo = (req, res) => {
  
  if (req.session.loggedin == true) {
    connection.query('SELECT * FROM asig_inscritos a JOIN ProcesoInscripcion p ON(a.proceso_id = p.id)', async (error, result) => {
      console.log(result)
      if (error) {
        console.log(error);
      }

      if (result.length > 0) {
        
        res.render('pages/principalHome/yaVoto',{name:req.session.name});
      }else{
        res.render('pages/principalHome/periodoEstu', {
          proceso: false,
          estatus: 'Elige a tu antojo',
          name: req.session.name
        });
      }
    });
  }else{
      res.redirect('/');
  }
}

const postPeriodo = async (req, res) => {
  const semestre = req.body.select;
  req.session.loggedin
    connection.query('SELECT nombrePeriodo, id FROM periodo WHERE estatus = ?', [semestre], async(error, result) => {
      console.log(result[0].nombrePeriodo)
      console.log(result)
      if (error) {
          console.log(error);
      }
      if (result[0].nombrePeriodo === '2025-1') {
        res.render('pages/principalHome/periodoEstu', {
            proceso: false,
            estatus: 'Este semestre por ahora está inactivo',
            name: req.session.name
        });
      }else if(result[0].nombrePeriodo === '2024-2'){
        req.session.periodoID = result[0].id
        res.render('pages/principalHome/periodoEstu', {
            proceso: true,
            estatus: 'Procedamos',
            name: req.session.name
        });
      }
    });
}

const getSemestreEleccion = (req, res) => {
  req.session.loggedin
  if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
}else{
  res.render('pages/principalHome/SemestreSeleccion',{name:req.session.name})
}

}


const postSemestreEleccion = (req, res) => {
  req.session.loggedin
  const DatoSemestre = req.body.semestre;
  const query = 'SELECT m.materia, m.unidadCredito, m.codigoMateria, m.semestre_id FROM materias m WHERE semestre_id = ?;';
  connection.query(query, [DatoSemestre], (error, result)=>{
    console.log(result)
    if (error) {
      console.log(error);
    }

    if(result.length > 0){
      console.log(result);
      const materias = result;
      console.log(materias);
      // const datos = Object.entries(data);
      req.session.semestre = result[0].semestre_id;
      req.session.materias = result;
      connection.query('INSERT INTO ProcesoInscripcion(estudiante_id, periodo_id, semestre_id) VALUES(?, ?, ?);', [req.session.estudianteID, req.session.periodoID, req.session.semestre], async (error) => {
        console.log(result)
        if (error) {
          console.log(error);
        }
      });
      res.render('pages/principalHome/seleccion',{
        materias: req.session.materias,
        ud:9,
        status: false,
        name: req.session.name
      });
    }else{
      res.send('No se encontraron materias correspondientes a ese Semestre');
    }
  
  })
}

const getseleccion = (req, res) => {
  req.session.loggedin
  console.log(req.session.name)
  console.log(req.body);
    if(req.session.loggedin == true){
          const query='SELECT materias.materia, materias.unidadCredito, semestre.nombreSemestre, materias.codigoMateria, semestre.id,materias.semestre_id FROM materias join semestre on(materias.semestre_id = semestre.id);'
          console.log(result)
          connection.query(query, async (error,result)=>{
            if(error){
              console.log(error);
            }
            if (result.length > 0) {
              await res.render('pages/principalHome/seleccion',{
                arreglo: result,
                ud:9,
                status: false,
                materias: req.session.materias,
                
              });
            }else{
              res.send('Error: No se encontraron las materias...');
            }
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

    datos.forEach(([contenido, value]) => {
        udc -= value;

        if(udc >= 12){
          arregloNombre.push(contenido);
        }
    });

      if(udc < 12){
        res.render('pages/principalHome/seleccion', {
          ud: 9,
          status: true,
          men: 'Te estás SobrePasando de Unidades de Crédito',
          arreglo: false,
          materias: req.session.materias
        });
      }else{
        let voto=1;
        for (let i = 0; i < arregloNombre.length; i++) {
          const query = "UPDATE materias SET  votosMateria = votosMateria + ? WHERE materia = ?"
          connection.query(query, [voto, arregloNombre[i]], async (error, result)=>{
            console.log(result)
            if(error){
              console.error('Error updating the record:', error); 
            }
          });
          console.log('se han guardado los datos');
        }

        connection.query('SELECT id, estudiante_id FROM ProcesoInscripcion', async (error, result) => {
          console.log(result)
          if (error) {
            console.log(error);
          }

          if (result.length > 0) {
            connection.query('SELECT id FROM materias', async (error, resulta) => {
              console.log(result)
              if (error) {
                console.log(error);
              }

              if (resulta.length > 0) {
                connection.query('INSERT INTO asig_inscritos(proceso_id, materias_id, estudiante_id) VALUES(?, ?, ?)', [result[0].id, result[0].estudiante_id, resulta[0].id], async (error) => {
                  console.log(result)
                  if (error) {
                    console.log(error);
                  }
                });
              }
            });
          }
        });

        console.log(arregloNombre);
        req.session.close = true;
        res.render('pages/principalHome/ConfirmEleccion',{
          nombre: arregloNombre,
          close: false
        });
      }
}

const getPreResultados = (req, res)=>{
  req.session.loggedin
  if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
}else{
  res.render('pages/principalHome/PreResultados',{name:req.session.name})
}
};

const postPreResultados= (req,res)=>{
  console.log(req.body);
  const dato = req.body.semestre;
  const query='SELECT materias.Materia,materias.unidadCredito,VotosMateria FROM materias where semestre_id= ?;';
  connection.query(query, [dato], async (error, result) => {
    if(error){
      console.log(error);
    }
    if(result.length > 0){
      const Materias = result;
      console.log(Materias);
      res.render('pages/principalHome/resultadosPreEleccion', {Materias,
        name:req.session.name
      });
    }
  });
}

const getResultados = (req, res) => {
  req.session.loggedin
  const query='SELECT semestre.nombreSemestre, materias.materia, materias.votosMateria FROM materias join semestre on(materias.semestre_id = semestre.id);';
  connection.query(query, async (error, result) => {
    if (error) {
      console.log(error);
    }

    if (result.length > 0) {
      console.log(result);
      res.render('pages/principalHome/resultadosPreEleccion',{
        arreglo: result,
        name:req.session.name
      });
    }
  });
}

module.exports = {
    getPre,
    getPeriodo,
    postPeriodo,
    getseleccion,
    postseleccion,
    getSemestreEleccion,
    postSemestreEleccion,
    getResultados,
    getPreResultados,
    postPreResultados
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