const bcrypt = require('bcrypt');
const { connection }= require('../db');

const getSession = (req, res) => {
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
        res.render('pages/estudiante/inicioDeSesion');
    }
};


const postSession = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        connection.query('SELECT * FROM estudiantes WHERE email = ?', [email], async(error, result) => {
            if(error){
                res.status(404).render('pages/error', {
                    message: 'Error en la Base De Datos D:',
                    status: 404
                });
            }else if (result.length == 0 || !(await bcrypt.compare(password, result[0].password))) {
                res.render('pages/estudiante/inicioDeSesion', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: "Usuario o Contraseña Incorrectos :(",
                    alertIcon: "error",
                    showConfirmButtom: true,
                    timer: 20000,
                    ruta: 'estudiante/session'
                });
            }else{
                req.session.estudianteID = parseInt(result[0].id);
                req.session.name = result[0].name;
                req.session.lastname =result[0].lastname;
                req.session.age=result[0].age;
                req.session.email= result[0].email;
                req.session.cedula= result[0].cedula;
                req.session.loggedin = true;
                res.render('pages/estudiante/inicioDeSesion', {
                    alert: true,
                    alertTitle: 'Conexión Buenísima :D',
                    alertMessage: "¡LOGIN EXITOSO!",
                    alertIcon: "success",
                    showConfirmButtom: false,
                    timer: 2000,
                    ruta: 'estudiante/home'
                });
            }
        });
    }else{
        res.render('pages/estudiante/inicioDeSesion', {
            alert: true,
            alertTitle: 'Advertencia D:',
            alertMessage: "Por Favor, ingresa el Correo y la Contraseña :)",
            alertIcon: "warning",
            showConfirmButtom: true,
            timer: 20000,
            ruta: 'estudiante/session'
        });
    }
}


module.exports = {
    getSession,
    postSession
}