const { connection } = require('../db');

const geteliminarCuenta = (req, res) => {
  if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
}else{
    res.render('pages/estudiante/eliminarCuenta')
}
}


const PostEliminarcuenta = (req, res) => {
  console.log(req.body)
  const correo= req.body.email;
  const queryDeleteuser = 'DELETE FROM estudiantes WHERE email = ?'
  connection.query(queryDeleteuser, [correo], async (error, result) => {
    console.log(result)
    if (error){
      res.status(404).render('pages/error', {
        message: 'Error en la Base De Datos D:',
        status: 404
      });
    }else if(result.length>0){
      res.render('pages/estudiante/eliminarCuenta', {
        alert: true,
        alertTitle: 'cumplido!',
        alertMessage: "cuenta eliminada",
        alertIcon: "success",
        showConfirmButtom: false,
        timer: 2000,
        ruta: ''
      });
    }else{    res.render('pages/estudiante/eliminarCuenta', {
      alert: true,
      alertTitle: 'Error',
      alertMessage: "ingreso mal el correo vuelva a intentarlo",
      alertIcon: "error",
      showConfirmButtom: true,
      timer: 20000,
      ruta: 'estudiante/home/eliminarCuenta'
  });}
  })

}

module.exports = {
  geteliminarCuenta,
  PostEliminarcuenta
}