drop database if exists db_EcoMuni;
create database db_EcoMuni;
use db_EcoMuni;

create table Rol(
	id_rol int auto_increment not null primary key,
    nombre varchar(30) not null,
    descripcion varchar(150)
);

create table Categoria(
	id_categoria int auto_increment not null primary key,
    categoria enum("basurero clandestino", "acumulacion de basura", "quema de residuos", "contaminacion de area publica", "desechos peligrosos", "otro") not null,
    descripcion varchar(200),
    estado enum("activa", "inactiva") not null
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

create table Reporte(
	id_reporte int auto_increment not null primary key,
    id_usuario int not null,
    id_categoria int not null,
    id_ubicacion int not null,
    id_estado int not null,
    codigo varchar(15) not null,
    titulo varchar(100) not null,
    descripcion varchar(500) not null,
    prioridad enum("baja", "media", "alta") not null,
    motivo_rechazo varchar(250),
    fecha_reporte date not null,
    fecha_actualizacion date not null,
    constraint fk_reporte_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
    constraint fk_reporte_categoria foreign key (id_categoria) references Categoria(id_categoria) on delete cascade,
    constraint fk_reporte_ubicacion foreign key (id_ubicacion) references Ubicacion(id_ubicacion) on delete cascade,
    constraint fk_reporte_estado foreign key (id_estado) references EstadoReporte(id_estado) on delete cascade
);

create table Evidencia(
	id_evidencia int auto_increment not null primary key,
    id_reporte int not null,
    url_imagen varchar(300) not null,
    descripcion varchar(150),
    fecha_subida date not null,
    constraint fk_evidencia_reporte foreign key (id_reporte) references Reporte(id_reporte) on delete cascade
);
