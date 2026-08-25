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

create table EstadoReporte(
	id_estado int auto_increment not null primary key,
    nombre varchar(30) not null,
    descripcion varchar(150)
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

create table Seguimiento(
	id_seguimiento int auto_increment not null primary key,
    id_reporte int not null,
    id_usuario int not null,
    id_estado int not null,
    observacion varchar(500),
    fecha_cambio date not null,
    constraint fk_seguimiento_reporte foreign key (id_reporte) references Reporte(id_reporte) on delete cascade,
    constraint fk_seguimiento_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
    constraint fk_seguimiento_estado foreign key (id_estado) references EstadoReporte(id_estado) on delete cascade
);

create table ApoyoReporte(
	id_apoyo int auto_increment not null primary key,
    id_reporte int not null,
    id_usuario int not null,
    fecha_apoyo date not null,
    constraint fk_apoyo_reporte foreign key (id_reporte) references Reporte(id_reporte) on delete cascade,
    constraint fk_apoyo_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade
);

create table PuntoReciclaje(
	id_punto int auto_increment not null primary key,
    id_ubicacion int not null,
    nombre varchar(100) not null,
    descripcion varchar(250),
    materiales varchar(200) not null,
    horario varchar(150),
    telefono varchar(20),
    estado enum("activo", "inactivo") not null,
    constraint fk_punto_ubicacion foreign key (id_ubicacion) references Ubicacion(id_ubicacion) on delete cascade
);

create table Campana(
	id_campana int auto_increment not null primary key,
    id_usuario int not null,
    id_ubicacion int,
    titulo varchar(100) not null,
    descripcion varchar(500) not null,
    organizador varchar(100) not null,
    fecha_inicio date not null,
    fecha_fin date not null,
    imagen_url varchar(300),
    estado enum("borrador", "publicada", "finalizada", "cancelada") not null,
    constraint fk_campana_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
    constraint fk_campana_ubicacion foreign key (id_ubicacion) references Ubicacion(id_ubicacion) on delete cascade
);

create table ComentarioReporte(
	id_comentario int auto_increment not null primary key,
    id_reporte int not null,
    id_usuario int not null,
    comentario varchar(500) not null,
    fecha_comentario date not null,
    estado enum("visible", "oculto") not null,
    constraint fk_comentario_reporte foreign key (id_reporte) references Reporte(id_reporte) on delete cascade,
    constraint fk_comentario_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade
);