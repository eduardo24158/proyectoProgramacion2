const { connection } = require('../../db');


const getInicioDeSesion = (req, res) => {
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

  if (email && password) {
    connection.query('SELECT * FROM administrador WHERE email = ?', [email], async(error, result)=>{
      if(error) {
        res.status(404).render('pages/error', {
          message: 'Error en la Base De Datos D:',
          status: 404
        });
      }else if (result.length == 0 || password !== result[0].password) { 
        res.render('pages/administrador/inicioDeAdmin', {
          alert: true,
          alertTitle: 'Error',
          alertMessage: "Usuario o Contraseña Incorrectos ",
          alertIcon: "error",
          showConfirmButtom: true,
          timer: 2000,
          ruta: 'administrador/InicioDeSesion'
        });
      }else{
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
        });
      };
    });
  }else{
    res.render('pages/estudiante/inicioDeSesion', {
      alert: true,
      alertTitle: 'Advertencia D:',
      alertMessage: "Por Favor, ingrese todos los campos...",
      alertIcon: "warning",
      showConfirmButtom: true,
      timer: 20000,
      ruta: 'administrador/InicioDeSesion'
    });
  };
};
const getHome = (req, res) => {
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
    res.render('pages/administrador/inicioDeAdmin',);
  }
}

const getinfoEstudiante = (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
        login: true,
        name: req.session.name
    });
  }else if (req.session.Adminloggedin == true) {
    res.render('pages/administrador/inforDeEstudiante',{
      AdminName: req.session.adminName,
    })
  }else{
    res.render('pages/administrador/inicioDeAdmin',);
  }
};

const postinfoEstudiante = (req, res) => {
  const cedula =req.body.cedula;
  req.session.Adminloggedin
  const query='select * from estudiantes where cedula= ?'
  connection.query(query,[cedula], async (error, result) => {

    const estudiante= result
    console.log(result)
    console.log(result.length)

    if(error){
      res.status(404).render('pages/error', {
        message: 'Error en la Base De Datos D:',
        status: 404
      });
    }else if(result.length == 0){
      res.render('pages/administrador/inforDeEstudiante', {
        AdminName:req.session.adminName,
        error: false,
        alert: true,
        alertTitle: 'Error!',
        alertMessage: "cedula no existe",
        alertIcon: "error",
        showConfirmButtom: false,
        timer: 2000,
        ruta: 'administrador/home/infoEstudiante'
      });
    }else{
      res.render('pages/administrador/estudianteInfor',{
        AdminName: req.session.adminName,
        estudiante
      })
    }
  })
}


const getMateriasD=(req,res)=>{
  req.session.Adminloggedin
  res.render('pages/administrador/AdminMateria',{
    AdminName: req.session.adminName,
  })
}

const postMaterias=(req,res)=>{
  req.session.Adminloggedin
  const dato = req.body.semestre;
  const query='SELECT materia FROM materias where semestre_id= ?;';
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
      res.render('pages/administrador/AdminResultados', {
        Materias,
        Adminname:req.session.name
      });
    }
  });
}



module.exports = {
  getInicioDeSesion,
  postSession,
  getHome,
  getinfoEstudiante,
  postinfoEstudiante,
  getMateriasD,
  postMaterias
}