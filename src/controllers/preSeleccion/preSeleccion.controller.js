const { connection } = require("../../db");

const getPre = (req, res) => {
  if (req.session.loggedin == true) {
    res.render("pages/principalHome/preEleccionMateria", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.redirect("/");
  }
};

const getPeriodo = (req, res) => {
  if (req.session.loggedin == true) {
    res.render("pages/principalHome/periodoEstu", {
      proceso: false,
      estatus: "Elige a tu antojo",
    });
  } else {
    res.redirect("/");
  }
};

const postPeriodo = async (req, res) => {
  const semestre = req.body.select;
  connection.query(
    "SELECT nombrePeriodo FROM periodo WHERE estatus = ?", [semestre],
    async (error, result) => {
      console.log(result[0].nombrePeriodo);
      if (error) {
        console.log(error);
      }

      if (result.length > 0) {
        if (result[0].nombrePeriodo == "2025-1") {
          res.render("pages/principalHome/periodoEstu", {
            proceso: false,
            estatus: "Este semestre por ahora está inactivo",
          });
        } else if (result[0].nombrePeriodo == "2024-2") {
          res.render("pages/principalHome/periodoEstu", {
            proceso: true,
            estatus: "Procedamos",
          });
        }
      } else {
        res.send("No seleccionaste bien, por favor intentelo más tarde");
      }
    }
  );
};

const getseleccion = (req, res) => {
    connection.query("SELECT * FROM materias", async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            res.render("pages/principalHome/seleccion", {
                arreglo: result,
                ud: 9,
            });
        }
    });
  };
  
  const postseleccion = (req, res) => {
    const data = req.body;
    const udc = 21; // Unidades de crédito disponibles del estudiante (ajusta esto según tu lógica)
  
    connection.query('SELECT * FROM materias WHERE id = ?', [data.id], async (error, result) => {
      if (error) {
        console.log(error);
        res.send('Error al consultar la materia');
        return;
      }
  
      if (result.length > 0) {
        const materiaCreditUnits = parseInt(result[0].unidadCredito);
        if (udc >= materiaCreditUnits) {
          console.log('Te estás inscribiendo');
          res.send('si');
        } else {
          console.log('No tienes suficientes unidades de crédito disponibles');
          res.send('no');
        }
      } else {
        res.send('Materia no encontrada');
      }
    });
  };
  

module.exports = {
  getPre,
  getPeriodo,
  postPeriodo,
  getseleccion,
  postseleccion,
};
