const mysql = require('mysql'); //Se indica Promise para que Node tome cada conexión como una promesa

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: 3306,
    database: 'preSeleccionCursos'
});

connection.connect((error) => {
    if (error) {
        console.log(`El error de conexión es: ${error}`);
        return;
    }

    console.log('¡Conectado a la base de datos :D!');
});

module.exports = {
    connection
}