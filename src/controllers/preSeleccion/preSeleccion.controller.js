const { connection } = require('../../db');

const getPre = (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/principalHome/preEleccionMateria',{
      name: req.session.name
    });
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
  }else{
    res.redirect('/');
  }
}


const getPeriodo = (req, res) => {
  console.log(req.session.estudianteID)
  if (req.session.loggedin == true) {
    connection.query('select p.id, e.id, pe.id, s.id from ProcesoInscripcion p join estudiantes e on(p.estudiante_id = e.id) join periodo pe on(p.periodo_id = pe.id) join semestre s on(p.semestre_id = s.id) where estudiante_id = ?', [req.session.estudianteID], async (error, result) => {
      console.log(result)
      if (error) {
        res.status(404).render('pages/error', {
          message: 'Error en la Base De Datos D:',
          status: 404
        });
      }else if (result.length > 0) {
        res.render('pages/principalHome/yaVoto',{
          name: req.session.name
        });
      }else{
        res.render('pages/principalHome/periodoEstu', {
          proceso: false,
          estatus: 'Elige',
          name: req.session.name
        });
      }
    });
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
  }else{
    res.redirect('/');
  }
}

const postPeriodo = async (req, res) => {
  const semestre = req.body.select;

    connection.query('SELECT nombrePeriodo, id FROM periodo WHERE estatus = ?', [semestre], async(error, result) => {
      console.log(result[0].nombrePeriodo)
      console.log(result)
      if (error) {
        res.status(404).render('pages/error', {
          message: 'Error en la Base De Datos D:',
          status: 404
        });
      }else if (result[0].nombrePeriodo === '2025-1') {
        res.render('pages/principalHome/periodoEstu', {
            proceso: false,
            estatus: 'Este semestre por ahora está inactivo',
            name: req.session.name
        });
      }else if(result[0].nombrePeriodo === '2024-2'){
        req.session.periodoID = result[0].id
        res.render('pages/principalHome/periodoEstu', {
            proceso: true,
            estatus: 'Excelente!',
            name: req.session.name
        });
      }
    });
}

const getSemestreEleccion = (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/principalHome/SemestreSeleccion',{
      name:req.session.name
    });
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
      login: true,
      AdminName: req.session.adminName
    });
  }else{
    res.redirect('/');
  }
}

const postSemestreEleccion = (req, res) => {
  const DatoSemestre = req.body.semestre;
  const query = 'SELECT m.materia, m.unidadCredito, m.codigoMateria, m.semestre_id FROM materias m WHERE semestre_id = ?;';
  connection.query(query, [DatoSemestre], async (error, result) => {
    console.log(result)
    if (error) {
      res.status(404).render('pages/error', {
        message: 'Error en la Base De Datos D:',
        status: 404
      });
    }else if(result.length > 0){
      console.log(result);
      const materias = result;
      console.log(materias);

      req.session.semestre = result[0].semestre_id;
      req.session.materias = result;

      console.log(req.session.estudianteID)
      connection.query('INSERT INTO ProcesoInscripcion(estudiante_id, periodo_id, semestre_id) VALUES(?, ?, ?);', [req.session.estudianteID, req.session.periodoID, req.session.semestre], async (error) => {
        console.log(result)
        if (error) {
          return res.status(404).render('pages/error', {
            message: 'Error en la Base De Datos D:',
            status: 404
          });
        }
      });
      res.render('pages/principalHome/seleccion',{
        materias: req.session.materias,
        ud:9,
        status: false,
        name: req.session.name
      });
    }else{
      res.render('pages/administrador/sinMaterias',{
        AdminName: req.session.adminName
      })
    }
  
  })
}

const getseleccion = (req, res) => {
  req.session.loggedin
  console.log(req.session.name)
  console.log(req.body);

  if (req.session.loggedin == true) {
    const query='SELECT materias.materia, materias.unidadCredito, semestre.nombreSemestre, materias.codigoMateria, semestre.id,materias.semestre_id FROM materias join semestre on(materias.semestre_id = semestre.id);'
    console.log(result)
    connection.query(query, async (error, result) => {
      if(error){
        res.status(404).render('pages/error', {
          message: 'Error en la Base De Datos D:',
          status: 404
        });
      }else if (result.length > 0) {
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
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
  }else{
    res.redirect('/');
  }
};

const postseleccion = (req, res) => {
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
      connection.query(query, [voto, arregloNombre[i]], async (error) => {
        if(error){
          res.status(404).render('pages/error', {
            message: 'Error en la Base De Datos D:',
            status: 404
          });
        }
      });
      console.log('se han guardado los datos');
    }
    connection.query('SELECT id, estudiante_id FROM ProcesoInscripcion', async (error, result) => {
      console.log(result)
      if (error) {
        res.status(404).render('pages/error', {
          message: 'Error en la Base De Datos D:',
          status: 404
        });
      }
      if (result.length > 0) {
        connection.query('SELECT id FROM materias', async (error, resulta) => {
          console.log(result)
          if (error) {
            res.status(404).render('pages/error', {
              message: 'Error en la Base De Datos D:',
              status: 404
            });
          }else if (resulta.length > 0) {
            connection.query('INSERT INTO asig_inscritos(proceso_id, materias_id) VALUES(?, ?)', [result[0].id, resulta[0].id], async (error) => {
              console.log(result)
              if (error) {
                res.status(404).render('pages/error', {
                  message: 'Error en la Base De Datos D:',
                  status: 404
                });
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

  if (req.session.loggedin == true) {
    res.render('pages/principalHome/PreResultados',{
      name:req.session.name
    })
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
  }else{
    res.redirect('/');
  }
};

const postPreResultados= (req,res)=>{
  console.log(req.body);
  const dato = req.body.semestre;
  const query='SELECT materia, unidadCredito, VotosMateria FROM materias where semestre_id= ?;';
  connection.query(query, [dato], async (error, result) => {
    console.log(result)
    if(error){
      res.status(404).render('pages/error', {
        message: 'Error en la Base De Datos D:',
        status: 404
      });
    }else if(result.length > 0){
      const Materias = result;
      console.log(Materias);
      res.render('pages/principalHome/resultadosPreEleccion', {
        Materias,
        name:req.session.name
      });
    }else(
      res.render('pages/administrador/sinMaterias',{
        Name:req.session.name
      })
    )
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
    getPreResultados,
    postPreResultados
}
