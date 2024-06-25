
const { connection }= require('../../db');



const getAdminOpciones=(req,res)=>{
  req.session.Adminloggedin
  res.render('pages/administrador/ElegirIngreElimiAdmin',{
    adminName:req.session.adminName
  })

}

const getMateriaIngresar=(req,res)=>{
  req.session.Adminloggedin
res.render('pages/administrador/MateriaIngresar',{adminName:req.session.adminName})
}

const postMateriaIngresar=(req,res)=>{
  req.session.Adminloggedin
const CodigoMateria= req.body.CodigoMateria;
const NombreMateria=req.body.Materia;
const unidadCredito=req.body.unidadCredito;
const semestre_id = req.body.semestre;

    const queryValid='SELECT * FROM materias WHERE Materia = ?  AND semestre_id= ?'
  connection.query(queryValid,[NombreMateria,semestre_id],(error, result) => {
  if (error){
    console.log(error);
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
  const query='insert into materias SET ?'
  connection.query(query,{Materia:NombreMateria,unidadCredito:unidadCredito,codigoMateria:CodigoMateria,semestre_id:semestre_id},(error, result) => {
    if (error) {
      console.log(error);
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


const getMateriaEliminar=(req,res)=>{
  req.session.Adminloggedin
res.render('pages/administrador/MateriaEliminar',{adminName:req.session.adminName})
}


const postMateriaEliminar=(req,res)=>{
  req.session.Adminloggedin
  const Materia=req.body.Materia;
  const semestre=req.body.semestre;
  const queryDelete= 'DELETE FROM materias WHERE Materia= ? AND semestre_id = ? ';
  const queryBusqueda='SELECT * FROM materias where Materia=? and semestre_id= ?';
  connection.query(queryBusqueda,[Materia,semestre],(error,result)=>{
    console.log(result)
    if (error){
      console.log(error);
  }else if (result.length > 0) {
    connection.query(queryDelete,[Materia,semestre],(error,result)=>{
      console.log('materia eliminada')
      res.render('pages/administrador/MateriaEliminar', {
        adminName:req.session.adminName,
        alert: true,
        alertTitle: 'hecho!',
        alertMessage: "Materia Borrada con existo",
        alertIcon: "success",
        showConfirmButtom: false,
        timer: 2000,
        ruta: 'administrador/home'
    });
      
  })
  }else{
    res.render('pages/administrador/MateriaEliminar', {
      adminName:req.session.adminName,
      alert: true,
      alertTitle: 'Error',
      alertMessage: "la materia que intenta eliminar no existe",
      alertIcon: "error",
      showConfirmButtom: true,
      timer: 20000,
      ruta: 'administrador/Materia/eliminar'
  });
  }
  })
}

module.exports = {
  getAdminOpciones,
  getMateriaIngresar,
  postMateriaIngresar,
  postMateriaEliminar,
  getMateriaEliminar
}