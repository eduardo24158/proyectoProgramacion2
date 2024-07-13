const { connection }= require('../../db');

const getAdminOpciones = (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
        login: true,
        name: req.session.name
    });
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/ElegirIngreElimiAdmin',{
      adminName: req.session.adminName
    });
  }else{
    res.render('pages/administrador/inicioDeAdmin',)
  }
}


const getMateriaIngresar = (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
        login: true,
        name: req.session.name
    });
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/MateriaIngresar',{
      adminName:req.session.adminName
    });
  }else{
    res.render('pages/administrador/inicioDeAdmin',)
  }
}

const postMateriaIngresar = (req, res) => {
  req.session.Adminloggedin
  const CodigoMateria = req.body.CodigoMateria;
  const NombreMateria = req.body.Materia;
  const unidadCredito = req.body.unidadCredito;
  const semestre_id = req.body.semestre;

  const queryValid = 'SELECT * FROM materias WHERE Materia = ?  AND semestre_id= ?';
  connection.query(queryValid,[NombreMateria,semestre_id], async (error, result) => {
    if (error){
      res.status(404).render('pages/error', {
        message: 'Error en la Base De Datos D:',
        status: 404
      });
    }else if (result.length > 0) {
      console.log('ya esta esa materia ingresada')
      res.render('pages/administrador/MateriaIngresar', {
        adminName:req.session.adminName,
        alert: true,
        alertTitle: 'no se puede',
        alertMessage: "la materia ya esta en la base de datos",
        alertIcon: "error",
        showConfirmButtom: true,
        timer: 20000,
        ruta: 'administrador/Materia/Ingresar'
      });
    }else{
      const query='INSERT INTO materias SET ?'
      connection.query(query, {Materia:NombreMateria,unidadCredito:unidadCredito,codigoMateria:CodigoMateria,semestre_id:semestre_id}, async (error) => {
        if (error) {
          res.status(404).render('pages/error', {
            message: 'Error en la Base De Datos D:',
            status: 404
          });
        }else{
          console.log('se anadio a la base de datos')
          res.render('pages/administrador/MateriaIngresar', {
            adminName:req.session.adminName,
            alert: true,
            alertTitle: 'listo!',
            alertMessage: "Materia añadida",
            alertIcon: "success",
            showConfirmButtom: false,
            timer: 2000,
            ruta: 'administrador/home'
          });
        }
      })
    }
  })
}


const getMateriaEliminar = (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
        login: true,
        name: req.session.name
    });
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/MateriaEliminar',{
      adminName:req.session.adminName
    });
  }else{
    res.render('pages/administrador/inicioDeAdmin',)
  }
}


const postMateriaEliminar = (req, res) => {
  req.session.Adminloggedin
  const Materia=req.body.Materia;
  const semestre=req.body.semestre;
  const queryDelete= 'DELETE FROM materias WHERE Materia= ? AND semestre_id = ? ';
  const queryBusqueda='SELECT * FROM materias where Materia=? and semestre_id= ?';
  connection.query(queryBusqueda, [Materia,semestre], async (error, result) => {
    console.log(result)
    if (error){
      res.status(404).render('pages/error', {
        message: 'Error en la Base De Datos D:',
        status: 404
      });
    }else if (result.length > 0) {
      connection.query(queryDelete,[Materia,semestre], async (error) => {
        if(error){
          res.status(404).render('pages/error', {
            message: 'Error en la Base De Datos D:',
            status: 404
          });
        }
        
        console.log('materia eliminada')
        res.render('pages/administrador/MateriaEliminar', {
          adminName: req.session.adminName,
          alert: true,
          alertTitle: 'Hecho!',
          alertMessage: "Materia Borrada con éxito!",
          alertIcon: "success",
          showConfirmButtom: false,
          timer: 2000,
          ruta: 'administrador/home'
        });
      })
    }else{
      res.render('pages/administrador/MateriaEliminar', {
        adminName: req.session.adminName,
        alert: true,
        alertTitle: 'Error',
        alertMessage: "La Materia que intenta eliminar no existe!",
        alertIcon: "error",
        showConfirmButtom: true,
        timer: 20000,
        ruta: 'administrador/Materia/eliminar'
      });
    }
  });
}

module.exports = {
  getAdminOpciones,
  getMateriaIngresar,
  postMateriaIngresar,
  postMateriaEliminar,
  getMateriaEliminar
}