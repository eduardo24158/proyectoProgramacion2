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


        connection.query('SELECT p.id, m.id, e.id FROM asig_inscritos a JOIN materias m ON(a.materias_id = m.id) JOIN estudiantes e ON(a.estudiante_id = e.id) JOIN ProcesoInscripcion p ON(a.proceso_id = p.id);', async (error, resu) => {
          if (error) {
            console.log(error);
          }

          if (resu.length > 0) {
            res.send('No papa, ya estás inscrito');
          }else{
            const query='SELECT materias.materia, materias.unidadCredito, semestre.nombreSemestre, materias.codigoMateria, semestre.id,materias.semestre_id FROM materias join semestre on(materias.semestre_id = semestre.id);'
            connection.query(query, async (error,result)=>{
              if(error){
                console.log(error);
              }

              if (result.length > 0) {
                await res.render('pages/principalHome/seleccion',{
                  arreglo: result,
                  ud:9,
                  status: false,
                });
              }else{
                res.send('Error: No se encontraron las materias...');
              }
            });
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
        });
      }else{
        let voto=1;
        for (let i = 0; i < arregloNombre.length; i++) {
          const query = "UPDATE materias SET  votosMateria = votosMateria + ? WHERE materia = ?"
          connection.query(query, [voto, arregloNombre[i]], async (error, result)=>{
            if(error){
              console.error('Error updating the record:', error); 
            }
          });
          console.log('se han guardado los datos');
        }

        connection.query('SELECT id, estudiante_id FROM ProcesoInscripcion', async (error, result) => {
          if (error) {
            console.log(error);
          }

          if (result.length > 0) {
            connection.query('SELECT id FROM materias', async (error, resulta) => {
              if (error) {
                console.log(error);
              }

              if (resulta.length > 0) {
                connection.query('INSERT INTO asig_inscritos(proceso_id, materias_id, estudiante_id) VALUES(?, ?, ?)', [result[0].id, result[0].estudiante_id, resulta[0].id], async (error) => {
                  if (error) {
                    console-log(error);
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

    connection.query('SELECT id FROM estudiantes', async (error, resulta) => {
      if (error) {
        console.log(error);
      }

      if (resulta.length > 0) {
        connection.query('SELECT nombrePeriodo, id FROM periodo WHERE estatus = ?', [semestre], async(error, result) => {
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
            connection.query('INSERT INTO ProcesoInscripcion(estudiante_id, periodo_id) VALUES(?, ?)', [resulta[0].id, result[0].id], async (error) => {
              if (error) {
                console.log(error);
              }
            });

              res.render('pages/principalHome/periodoEstu', {
                  proceso: true,
                  estatus: 'Procedamos'
              });
          }
      });
      }
    });

    
}


const getPreResultados=(req,res)=>{
  res.render('pages/principalHome/PreResultados')
}

const postPreResultados= (req,res)=>{
  console.log(req.body);
  const dato = req.body.semestre;
  const query='SELECT materias.Materia,materias.unidadCredito,VotosMateria FROM materias where semestre_id= ?;';
  connection.query(query,[dato],(error,result)=>{
    const Materias = result;
    console.log(Materias);
    res.render('pages/principalHome/resultadosPreEleccion', {Materias});
  });
}

const getResultados=(req,res)=>{
  const query='SELECT semestre.nombreSemestre,materias.Materia,materias.votosMateria FROM materias join semestre on(materias.semestre_id=semestre.id);';
  connection.query(query,(error,result)=>{
    if (error) {
      console.log(error);
    }

    if (result.length > 0) {
      console.log(result);
      res.render('pages/principalHome/resultadosPreEleccion',{
        arreglo: result
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