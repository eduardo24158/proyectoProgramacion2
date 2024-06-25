const { connection }= require('../../db');


const getInicioDeSesion= (req,res)=>{
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
        login: true,
        name: req.session.name
    });
}else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/administradorHome', {
        login: true,
        AdminName: req.session.adminName
    });
}else{
    res.render('pages/administrador/inicioDeAdmin',)
}
}

const postSession = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email&& password) {
    connection.query('SELECT * FROM administrador WHERE email = ?', [email], async(error, result)=>{
      if (result.length == 0 || password !== result[0].password) { 
        res.render('pages/administrador/inicioDeAdmin', {
          alert: true,
          alertTitle: 'Error',
          alertMessage: "Usuario o Contraseña Incorrectos ",
          alertIcon: "error",
          showConfirmButtom: true,
          timer: 2000,
          ruta: 'administrador/InicioDeSesion'
        });}else{
        req.session.adminName = result[0].name;
        req.session.Adminlastname =result[0].lastname;
        req.session.Adminage=result[0].age;
        req.session.Adminemail= result[0].email;
        req.session.Admincedula= result[0].cedula;
        req.session.Adminloggedin = true;
        res.render('pages/administrador/inicioDeAdmin', {
          alert: true,
          alertTitle: 'Conexión Buenísima :D',
          alertMessage: "¡LOGIN EXITOSO!",
          alertIcon: "success",
          showConfirmButtom: false,
          timer: 2000,
          ruta: 'administrador/home'
        })}
      })}else{
  res.render('pages/estudiante/inicioDeSesion', {
    alert: true,
    alertTitle: 'Advertencia D:',
    alertMessage: "Por Favor, ingresa el Correo y la Contraseña :)",
    alertIcon: "warning",
    showConfirmButtom: true,
    timer: 20000,
    ruta: 'administrador/InicioDeSesion'
  })
}
}
const getHome= (req,res)=>{
  req.session.Adminloggedin
     if (req.session.loggedin == true) {
      res.render('pages/estudiante/home', {
          login: true,
          name: req.session.name
      });
  }else if (req.session.Adminloggedin == true) {
      res.render('pages/administrador/administradorHome', {
          login: true,
          AdminName: req.session.adminName
      });
  }
  }



module.exports = {
  getInicioDeSesion,
  postSession,
  getHome
}