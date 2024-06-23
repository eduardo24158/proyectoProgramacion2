create database if not exists preSeleccionCursos;
use preSeleccionCursos;


-- SECCIÓN PARA EL ESTUDIANTE
-- El estudiante podrá registrarse en el sistema con estos datos, siendo importante para detectarlo, su id único y otros datos como lo pueden ser, la cédula o el nombre.
create table estudiantes(
	id int auto_increment not null,
    name varchar(50) not null,
    lastname varchar(50) not null,
    age int not null,
    email varchar(100) not null,
    cedula int not null,
    password varchar(255) not null,
    primary key(id)
);

create table materias(
	id int auto_increment not null,
    unidadCredito int not null,
    materia varchar(100) not null,
    codigoMateria varchar(10) not null,
    votosMateria int default 0 not null,
    carrera_id int not null,
    semestre_id int not null,
    primary key(id)
);

create table ProcesoInscripcion(
	id int auto_increment not null,
    estudiante_id int not null,
    periodo_id int not null,
    primary key(id)
);

-- En este apartado se le mostrará al estudiante todas las materias correspondientes al semestre que haya escojido, normalmente se validaría que semestres se le pueden mostrar si nos pidieran notas para verificar si pasó o no las materias para determinar la prelación.
create table asig_inscritos(
	id int auto_increment not null,
    proceso_id int not null,
    materias_id int not null,
    estudiante_id int not null,
    primary key(id)
);

-- Se usará este apartado para los nombres de los semestres, en este caso le sire al administrador para llenar materias acorde a un semestre, pero al estudiante le serviría más un section, aunque pensando mejor, dependiendo de los que escoja en la section se puede pasar por acá para buscar las materias que coincidan con el semestre que escojió
create table semestre(
	id int auto_increment not null,
    nombreSemestre varchar(50) not null,
    primary key(id)
);

--------------------------------------------------------------------------------------------------------

-- SECCIÓN PARA EL ADMINISTRADOR

-- Esto es para el administrador
-- El administrador tendrá que elegir que materias llenar correspondientes a la carrera
-- Los nombres de la carrera ya tienen que estar, en este caso, el administrador elige alguna de esas carreras para inyectar sus respectivas materias
create table carrera(
	id int auto_increment not null,
    nombreCarrera varchar(100) not null,
    primary key(id)
);

-- Esto es para el administrador
-- El administrador es el que actualiza la fecha de los periodos
-- El administrador es el que le da los nombres a los periodos y determinan si estan activos o inactivos
create table periodo(
	id int auto_increment not null,
    nombrePeriodo varchar(8) not null,
    estatus varchar(20) not null,
    primary key(id)
);
-- Esto lo llena un administrador
-- El administrador es el que llena las materias correspondientes al semestre.
-- Ya habiendo elegido la carrera, el administrador llenará esta tabla correspondiente a la carrera que haya elegido.

/* tabla administrador*/

create table administrador(
	id int auto_increment not null,
    name varchar(50) not null,
    lastname varchar(50) not null,
    age int not null,
    email varchar(100) not null,
    cedula int not null,
    password varchar(255) not null,
    primary key(id)
);
