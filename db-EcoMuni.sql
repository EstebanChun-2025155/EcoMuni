drop table if exists ComentarioReporte cascade;
drop table if exists Campana cascade;
drop table if exists PuntoReciclaje cascade;
drop table if exists ApoyoReporte cascade;
drop table if exists Seguimiento cascade;
drop table if exists Evidencia cascade;
drop table if exists Reporte cascade;
drop table if exists Usuario cascade;
drop table if exists EstadoReporte cascade;
drop table if exists Ubicacion cascade;
drop table if exists Categoria cascade;
drop table if exists Rol cascade;
drop type if exists estado_comentario;
drop type if exists estado_campana;
drop type if exists estado_punto;
drop type if exists prioridad_reporte;
drop type if exists estado_usuario;
drop type if exists estado_categoria;
drop type if exists categoria_reporte;

create type categoria_reporte as enum(
    'basurero clandestino',
    'acumulacion de basura',
    'quema de residuos',
    'contaminacion de area publica',
    'desechos peligrosos',
    'otro'
);

create type estado_categoria as enum('activa', 'inactiva');
create type estado_usuario as enum('activo', 'suspendido');
create type prioridad_reporte as enum('baja', 'media', 'alta');
create type estado_punto as enum('activo', 'inactivo');
create type estado_campana as enum('borrador', 'publicada', 'finalizada', 'cancelada');
create type estado_comentario as enum('visible', 'oculto');

create table Rol(
    id_rol integer generated always as identity primary key,
    nombre varchar(30) not null unique,
    descripcion varchar(150)
);

create table Categoria(
    id_categoria integer generated always as identity primary key,
    categoria categoria_reporte not null unique,
    descripcion varchar(200),
    estado estado_categoria not null default 'activa'
);

create table Ubicacion(
    id_ubicacion integer generated always as identity primary key,
    departamento varchar(60) not null,
    municipio varchar(80) not null,
    zona varchar(15),
    direccion varchar(200),
    referencia varchar(200)
);

create table EstadoReporte(
    id_estado integer generated always as identity primary key,
    nombre varchar(30) not null unique,
    descripcion varchar(150)
);

create table Usuario(
    id_usuario integer generated always as identity primary key,
    id_rol integer not null,
    nombres varchar(60) not null,
    apellidos varchar(60) not null,
    correo varchar(120) not null unique,
    contrasena varchar(255) not null,
    telefono varchar(20),
    estado estado_usuario not null default 'activo',
    fecha_registro date not null default current_date,
    constraint fk_usuario_rol foreign key (id_rol) references Rol(id_rol) on delete cascade
);

create table Reporte(
    id_reporte integer generated always as identity primary key,
    id_usuario integer not null,
    id_categoria integer not null,
    id_ubicacion integer not null,
    id_estado integer not null,
    codigo varchar(15) not null unique,
    titulo varchar(100) not null,
    descripcion varchar(500) not null,
    prioridad prioridad_reporte not null default 'media',
    motivo_rechazo varchar(250),
    fecha_reporte date not null default current_date,
    fecha_actualizacion date not null default current_date,
    constraint fk_reporte_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
    constraint fk_reporte_categoria foreign key (id_categoria) references Categoria(id_categoria) on delete cascade,
    constraint fk_reporte_ubicacion foreign key (id_ubicacion) references Ubicacion(id_ubicacion) on delete cascade,
    constraint fk_reporte_estado foreign key (id_estado) references EstadoReporte(id_estado) on delete cascade
);

create table Evidencia(
    id_evidencia integer generated always as identity primary key,
    id_reporte integer not null,
    url_imagen varchar(300) not null,
    descripcion varchar(150),
    fecha_subida date not null default current_date,
    constraint fk_evidencia_reporte foreign key (id_reporte) references Reporte(id_reporte) on delete cascade
);

create table Seguimiento(
    id_seguimiento integer generated always as identity primary key,
    id_reporte integer not null,
    id_usuario integer not null,
    id_estado integer not null,
    observacion varchar(500),
    fecha_cambio date not null default current_date,
    constraint fk_seguimiento_reporte foreign key (id_reporte) references Reporte(id_reporte) on delete cascade,
    constraint fk_seguimiento_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
    constraint fk_seguimiento_estado foreign key (id_estado) references EstadoReporte(id_estado) on delete cascade
);

create table ApoyoReporte(
    id_apoyo integer generated always as identity primary key,
    id_reporte integer not null,
    id_usuario integer not null,
    fecha_apoyo date not null default current_date,
    constraint uq_apoyo_reporte_usuario unique (id_reporte, id_usuario),
    constraint fk_apoyo_reporte foreign key (id_reporte) references Reporte(id_reporte) on delete cascade,
    constraint fk_apoyo_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade
);

create table PuntoReciclaje(
    id_punto integer generated always as identity primary key,
    id_ubicacion integer not null,
    nombre varchar(100) not null,
    descripcion varchar(250),
    materiales varchar(200) not null,
    horario varchar(150),
    telefono varchar(20),
    estado estado_punto not null default 'activo',
    constraint fk_punto_ubicacion foreign key (id_ubicacion) references Ubicacion(id_ubicacion) on delete cascade
);

create table Campana(
    id_campana integer generated always as identity primary key,
    id_usuario integer not null,
    id_ubicacion integer,
    titulo varchar(100) not null,
    descripcion varchar(500) not null,
    organizador varchar(100) not null,
    fecha_inicio date not null,
    fecha_fin date not null,
    imagen_url varchar(300),
    estado estado_campana not null default 'borrador',
    constraint fk_campana_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
    constraint fk_campana_ubicacion foreign key (id_ubicacion) references Ubicacion(id_ubicacion) on delete cascade,
    constraint ck_campana_fechas check (fecha_fin >= fecha_inicio)
);

create table ComentarioReporte(
    id_comentario integer generated always as identity primary key,
    id_reporte integer not null,
    id_usuario integer not null,
    comentario varchar(500) not null,
    fecha_comentario date not null default current_date,
    estado estado_comentario not null default 'visible',
    constraint fk_comentario_reporte foreign key (id_reporte) references Reporte(id_reporte) on delete cascade,
    constraint fk_comentario_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade
);