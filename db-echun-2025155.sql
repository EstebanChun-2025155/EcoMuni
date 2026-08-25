drop database if exists db_EcoMuni;
create database db_EcoMuni;
use db_EcoMuni;

create table Rol(
	id_rol int auto_increment not null primary key,
    nombre varchar(30) not null,
    descripcion varchar(150)
);

create table Ubicacion(
	id_ubicacion int auto_increment not null primary key,
    departamento varchar(60) not null,
    municipio varchar(80) not null,
    zona varchar(15),
    direccion varchar(200),
    referencia varchar(200)
);

create table Usuario(
	id_usuario int auto_increment not null primary key,
    id_rol int not null,
    nombres varchar(60) not null,
    apellidos varchar(60) not null,
    correo varchar(120) not null,
    contrasena varchar(255) not null,
    telefono varchar(20),
    estado enum("activo", "suspendido") not null,
    fecha_registro date not null,
    constraint fk_usuario_rol foreign key (id_rol) references Rol(id_rol) on delete cascade
);