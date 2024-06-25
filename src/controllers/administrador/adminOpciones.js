const { connection }= require('../../db');

const getAdminOpciones = (req, res) => {
  res.render('pages/administrador/ElegirIngreElimiAdmin');
}

const getMateriaIngresar = (req, res) => {
  res.render('pages/administrador/MateriaIngresar');
}

const postMateriaIngresar = (req,res) => {

  const CodigoMateria = req.body.CodigoMateria;
  const NombreMateria = req.body.Materia;
  const unidadCredito = req.body.unidadCredito;
  const semestre_id = req.body.semestre;

  const queryValid = 'SELECT * FROM materias WHERE materia = ?  AND semestre_id = ?';

  connection.query(queryValid, [NombreMateria, semestre_id], async (error, result) => {
    if (error){
      console.log(error);
    }else if (result.length > 0) {
      console.log('ya esta esa materia ingresada')
      res.render('pages/administrador/MateriaIngresar', {
        alert: true,
        alertTitle: 'Error!',
        alertMessage: "La materia Seleccionada ya se encuentra en la Base de Datos!",
        alertIcon: "error",
        showConfirmButtom: true,
        timer: 20000,
        ruta: 'administrador/Materia/Ingresar'
      });
    }else{
      const query='INSERT INTO materias SET ?'
      connection.query(query, {materia:NombreMateria,unidadCredito:unidadCredito,codigoMateria:CodigoMateria,semestre_id:semestre_id}, async (error) => {
        if (error) {
          console.log(error);
        }else{
          console.log('se añadio a la base de datos')
          res.render('pages/administrador/MateriaIngresar', {
            alert: true,
            alertTitle: 'listo!',
            alertMessage: "Materia añadida",
            alertIcon: "success",
            showConfirmButtom: false,
            timer: 2000,
            ruta: 'administrador/home'
          });
        }
      });
    };
  });
}

const getMateriaEliminar = (req, res) => {
 res.render('pages/administrador/MateriaEliminar')
}

const postMateriaEliminar = (req, res) => {
  const Materia = req.body.Materia;
  const semestre = req.body.semestre;
  const queryDelete = 'DELETE FROM materias WHERE materia= ? AND semestre_id = ? ';
  const queryBusqueda ='SELECT * FROM materias WHERE materia=? AND semestre_id = ?';

  connection.query(queryBusqueda, [Materia, semestre], async (error,result) => {
    console.log(result);
    if (error){
      console.log(error);
    }else if (result.length > 0) {
      connection.query(queryDelete, [Materia, semestre], async (error, result) => {
        if(error){
          console.log(error);
        }

        if(result.length > 0){
          console.log('materia eliminada')
          res.render('pages/administrador/MateriaEliminar', {
            alert: true,
            alertTitle: 'hecho!',
            alertMessage: "Materia Borrada con existo",
            alertIcon: "success",
            showConfirmButtom: false,
            timer: 2000,
            ruta: 'administrador/home'
          });
        }
      });
    }else{
      res.render('pages/administrador/MateriaEliminar', {
        alert: true,
        alertTitle: 'Error',
        alertMessage: "la materia que intenta eliminar no existe",
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