const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');

//Rutas
const estudianteRouter = require('./routes/estudiante');
const sessionRouter = require('./routes/session.routes');
const registerRouter = require('./routes/register.routes');
const homeRouter = require('./routes/home/home.routes');
const datosPersonales = require('./routes/home/datosPersonales.routes');
const DatosAdmin=require('./routes/administrador/datosAdmin.routes')
const preEleccion = require('./routes/home/preSeleccion.routes');
const AdministradorRouter= require('./routes/administrador/administrador.routes');
const MateriasOpciones = require('./routes/administrador/opcionesDeMateria.routes')
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
dotenv.config({path: './env/.env'});

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


//Rutas Principales
app.use(estudianteRouter);
app.use(sessionRouter);
app.use(registerRouter)
app.use(homeRouter)
app.use(datosPersonales);
app.use(DatosAdmin);
app.use(preEleccion);
app.use(AdministradorRouter);
app.use(MateriasOpciones);


app.get('/', (req, res) => {
  if (req.session.loggedin == true) {
    res.render('pages/estudiante/home', {
      login: true,
      name: req.session.name
    });
  }else{
    res.redirect('/');
  }
});

app.use((req,res)=>{
  res.send('pagina no encontrara')
})

// catch 404 and forward to error handler
app.use((req,res,next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;