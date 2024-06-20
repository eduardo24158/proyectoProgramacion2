const bcrypt = require('bcrypt');
const { connection } = require('../db');

const getRegister = (req, res) => {
    if (req.session.loggedin == true) {
        res.render('pages/estudiante/home', {
          login: true,
          name: req.session.name
        });
    }else{
        res.render('pages/estudiante/register', {
            error: false
        });
    }
};

const postRegisterStudent = async (req, res) => {
    const name = req.body.name;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const email = req.body.email;
    const cedula = req.body.cedula;
    const password = req.body.password;

    if ((parseInt(cedula) < 1000000) || (parseInt(cedula) > 40000000)) {
        return res.render('pages/estudiante/register', {
            error: true,
            mensajeError: 'La cédula no es válida.'
        });
    }

    let encryp = await bcrypt.hash(password, 8);

    connection.query('SELECT * FROM estudiantes WHERE email = ?', [email], async(error, result) => {
        if (error){
            console.log(error);
        }else if (result.length > 0) {
            res.render('pages/estudiante/register', {
                error: false,
                alert: true,
                alertTitle: 'Error!',
                alertMessage: "Ya tiene una cuenta creada!",
                alertIcon: "error",
                showConfirmButtom: false,
                timer: 2000,
                ruta: '/estudiante/session'
            });
        }else{
            connection.query('INSERT INTO estudiantes SET ?', {name:name, lastname:lastname, age:age, email:email, cedula:cedula, password:encryp}, async(error, result) => {
                if (error) {
                    console.log(error);
                }else{
                    res.render('pages/estudiante/register', {
                        error: false,
                        alert: true,
                        alertTitle: 'Registro',
                        alertMessage: "Registro Exitoso :D",
                        alertIcon: "success",
                        showConfirmButtom: false,
                        timer: 1500,
                        ruta: '/estudiante/home'
                    });
                }
            });
        }
    });
}


const terminosCond = (req, res) => {
    res.render('pages/terminos');
}

module.exports = {
    getRegister,
    postRegisterStudent,
    terminosCond
}