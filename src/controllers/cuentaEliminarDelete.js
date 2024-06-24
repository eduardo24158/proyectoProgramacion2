const { connection }= require('../db');

const geteliminarCuenta=(req,res)=>{
  res.render('pages/estudiante/eliminarCuenta')
}

const PostEliminarcuenta=(req,res)=>{
  console.log(req.body)
  const correo= req.body.email;
  const queryDeleteuser ='DELETE FROM estudiantes WHERE email= ?'
  connection.query(queryDeleteuser,[correo],(error,result)=>{
    if (error){
      console.log(error);
  }else{
    res.render('pages/estudiante/eliminarCuenta', {
      alert: true,
      alertTitle: 'cumplido!',
      alertMessage: "cuenta eliminada",
      alertIcon: "success",
      showConfirmButtom: false,
      timer: 2000,
      ruta: ''
  });
  }
})
}

module.exports = {
  geteliminarCuenta,
  PostEliminarcuenta
}