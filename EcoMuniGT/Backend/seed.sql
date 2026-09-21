-- ============================================
-- SEED DE PRUEBA - EcoMuniGT
-- ============================================

-- ============================================
-- ROLES
-- ============================================

INSERT INTO Rol (nombre, descripcion)
VALUES
    ('Administrador', 'Acceso completo al sistema.'),
    ('Gestor', 'Gestiona reportes y puntos de reciclaje.'),
    ('Ciudadano', 'Puede crear reportes y participar en ellos.');


-- ============================================
-- CATEGORÍAS
-- ============================================

INSERT INTO Categoria (categoria, descripcion, estado)
VALUES
    ('basurero clandestino', 'Acumulación ilegal de residuos en un área.', 'activa'),
    ('acumulacion de basura', 'Acumulación de basura en espacios públicos.', 'activa'),
    ('quema de residuos', 'Quema de basura o residuos contaminantes.', 'activa'),
    ('contaminacion de area publica', 'Contaminación de parques, calles u otros espacios públicos.', 'activa'),
    ('desechos peligrosos', 'Presencia de materiales o residuos potencialmente peligrosos.', 'activa'),
    ('otro', 'Situaciones ambientales que no pertenecen a otra categoría.', 'activa');


-- ============================================
-- ESTADOS DE REPORTE
-- ============================================

INSERT INTO EstadoReporte (nombre, descripcion)
VALUES
    ('Pendiente', 'El reporte fue recibido y está pendiente de revisión.'),
    ('En revisión', 'El reporte está siendo revisado por un gestor.'),
    ('En proceso', 'Se están realizando acciones para solucionar el problema.'),
    ('Resuelto', 'El problema reportado fue solucionado.'),
    ('Rechazado', 'El reporte no cumple con los criterios necesarios.');


-- ============================================
-- UBICACIONES
-- ============================================

INSERT INTO Ubicacion
    (departamento, municipio, zona, direccion, referencia)
VALUES
    ('San Marcos', 'San Marcos', '1', 'Zona 1, San Marcos', 'Cerca del parque central'),
    ('San Marcos', 'Malacatán', '2', 'Zona 2, Malacatán', 'Frente al mercado municipal'),
    ('San Marcos', 'San Pedro Sacatepéquez', '1', 'Zona 1, San Pedro Sacatepéquez', 'Cerca de la terminal'),

    ('Santa Rosa', 'Cuilapa', '1', 'Zona 1, Cuilapa', 'Cerca del parque central'),
    ('Santa Rosa', 'Barberena', '2', 'Zona 2, Barberena', 'Cerca del mercado'),
    ('Santa Rosa', 'Chiquimulilla', '1', 'Zona 1, Chiquimulilla', 'A un costado del parque'),

    ('Sololá', 'Sololá', '1', 'Zona 1, Sololá', 'Cerca del mercado municipal'),
    ('Sololá', 'Panajachel', '2', 'Zona 2, Panajachel', 'Cerca de la zona turística'),
    ('Sololá', 'San Lucas Tolimán', '1', 'Zona 1, San Lucas Tolimán', 'Cerca del muelle'),

    ('Suchitepéquez', 'Mazatenango', '1', 'Zona 1, Mazatenango', 'Cerca del parque central'),
    ('Suchitepéquez', 'Cuyotenango', '2', 'Zona 2, Cuyotenango', 'Cerca del mercado'),
    ('Suchitepéquez', 'San Antonio Suchitepéquez', '1', 'Zona 1, San Antonio', 'Cerca de la municipalidad'),

    ('Totonicapán', 'Totonicapán', '1', 'Zona 1, Totonicapán', 'Cerca del parque central'),
    ('Totonicapán', 'San Cristóbal Totonicapán', '2', 'Zona 2, San Cristóbal', 'Cerca del mercado'),
    ('Totonicapán', 'Momostenango', '1', 'Zona 1, Momostenango', 'Cerca de la plaza'),

    ('Zacapa', 'Zacapa', '1', 'Zona 1, Zacapa', 'Cerca del parque central'),
    ('Zacapa', 'Gualán', '2', 'Zona 2, Gualán', 'Cerca del mercado'),
    ('Zacapa', 'Teculután', '1', 'Zona 1, Teculután', 'Cerca de la municipalidad');


-- ============================================
-- USUARIOS
-- ============================================

-- Contraseña de prueba:
-- Ciudadano: EcoMuni123!
-- Gestor: Gestor123!
-- Administrador: Admin123!

INSERT INTO Usuario
    (id_rol, nombres, apellidos, correo, contrasena, telefono, estado)
VALUES
    (
        (SELECT id_rol FROM Rol WHERE nombre = 'Administrador'),
        'Administrador',
        'EcoMuni',
        'admin@ecomuni.gt',
        '$2b$12$LQv3c1yqBW8E8y8y8y8y8eVj8m5W7jK2K3l4m5n6o7p8q9r0s1t2u',
        '55550001',
        'activo'
    ),
    (
        (SELECT id_rol FROM Rol WHERE nombre = 'Gestor'),
        'Carlos',
        'Gestor',
        'gestor@ecomuni.gt',
        '$2b$12$LQv3c1yqBW8E8y8y8y8y8eVj8m5W7jK2K3l4m5n6o7p8q9r0s1t2u',
        '55550002',
        'activo'
    ),
    (
        (SELECT id_rol FROM Rol WHERE nombre = 'Ciudadano'),
        'Juan',
        'Pérez',
        'juan@ecomuni.gt',
        '$2b$12$LQv3c1yqBW8E8y8y8y8y8eVj8m5W7jK2K3l4m5n6o7p8q9r0s1t2u',
        '55550003',
        'activo'
    ),
    (
        (SELECT id_rol FROM Rol WHERE nombre = 'Ciudadano'),
        'María',
        'López',
        'maria@ecomuni.gt',
        '$2b$12$LQv3c1yqBW8E8y8y8y8y8eVj8m5W7jK2K3l4m5n6o7p8q9r0s1t2u',
        '55550004',
        'activo'
    );


-- ============================================
-- REPORTES
-- ============================================

INSERT INTO Reporte
    (
        id_usuario,
        id_categoria,
        id_ubicacion,
        id_estado,
        codigo,
        titulo,
        descripcion,
        prioridad
    )
VALUES
    (
        (SELECT id_usuario FROM Usuario WHERE correo = 'juan@ecomuni.gt'),
        (SELECT id_categoria FROM Categoria WHERE categoria = 'basurero clandestino'),
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'San Marcos'
            AND municipio = 'San Marcos'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'Pendiente'),
        'SM-00001',
        'Basurero clandestino cerca del parque',
        'Se ha detectado una acumulación constante de basura en un terreno cercano al parque central.',
        'alta'
    ),

    (
        (SELECT id_usuario FROM Usuario WHERE correo = 'maria@ecomuni.gt'),
        (SELECT id_categoria FROM Categoria WHERE categoria = 'acumulacion de basura'),
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Santa Rosa'
            AND municipio = 'Cuilapa'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'En revisión'),
        'SR-00001',
        'Acumulación de basura en la vía pública',
        'La basura permanece acumulada durante varios días en una zona de paso frecuente.',
        'media'
    ),

    (
        (SELECT id_usuario FROM Usuario WHERE correo = 'juan@ecomuni.gt'),
        (SELECT id_categoria FROM Categoria WHERE categoria = 'contaminacion de area publica'),
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Sololá'
            AND municipio = 'Panajachel'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'En proceso'),
        'SO-00001',
        'Contaminación en área pública',
        'Se encontraron residuos acumulados en un área pública cercana a una zona turística.',
        'alta'
    ),

    (
        (SELECT id_usuario FROM Usuario WHERE correo = 'maria@ecomuni.gt'),
        (SELECT id_categoria FROM Categoria WHERE categoria = 'quema de residuos'),
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Suchitepéquez'
            AND municipio = 'Mazatenango'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'Resuelto'),
        'SU-00001',
        'Quema de residuos en zona residencial',
        'Se reportó la quema frecuente de residuos en un área cercana a viviendas.',
        'alta'
    ),

    (
        (SELECT id_usuario FROM Usuario WHERE correo = 'juan@ecomuni.gt'),
        (SELECT id_categoria FROM Categoria WHERE categoria = 'desechos peligrosos'),
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Totonicapán'
            AND municipio = 'Totonicapán'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'Pendiente'),
        'TO-00001',
        'Desechos peligrosos abandonados',
        'Se encontraron recipientes y materiales que podrían representar un riesgo para los vecinos.',
        'alta'
    ),

    (
        (SELECT id_usuario FROM Usuario WHERE correo = 'maria@ecomuni.gt'),
        (SELECT id_categoria FROM Categoria WHERE categoria = 'basurero clandestino'),
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Zacapa'
            AND municipio = 'Zacapa'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'En revisión'),
        'ZA-00001',
        'Basurero clandestino en zona urbana',
        'Se observa acumulación de residuos en un terreno utilizado constantemente como basurero.',
        'media'
    );


-- ============================================
-- APOYOS
-- ============================================

INSERT INTO ApoyoReporte
    (id_reporte, id_usuario)
VALUES
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SM-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'maria@ecomuni.gt')
    ),
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SM-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'juan@ecomuni.gt')
    ),
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SR-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'juan@ecomuni.gt')
    ),
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SO-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'maria@ecomuni.gt')
    );


-- ============================================
-- COMENTARIOS
-- ============================================

INSERT INTO ComentarioReporte
    (id_reporte, id_usuario, comentario, estado)
VALUES
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SM-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'maria@ecomuni.gt'),
        'También he observado acumulación de residuos en este lugar.',
        'visible'
    ),
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SM-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'juan@ecomuni.gt'),
        'Sería importante revisar el área durante esta semana.',
        'visible'
    ),
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SR-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'juan@ecomuni.gt'),
        'La acumulación lleva varios días.',
        'visible'
    ),
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SO-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'maria@ecomuni.gt'),
        'La zona recibe muchas visitas y sería bueno mantenerla limpia.',
        'visible'
    );


-- ============================================
-- SEGUIMIENTOS
-- ============================================

INSERT INTO Seguimiento
    (id_reporte, id_usuario, id_estado, observacion)
VALUES
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SR-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'gestor@ecomuni.gt'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'En revisión'),
        'El reporte fue recibido y se encuentra en proceso de revisión.'
    ),
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SO-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'gestor@ecomuni.gt'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'En proceso'),
        'Se coordinó una jornada de limpieza en el sector.'
    ),
    (
        (SELECT id_reporte FROM Reporte WHERE codigo = 'SU-00001'),
        (SELECT id_usuario FROM Usuario WHERE correo = 'gestor@ecomuni.gt'),
        (SELECT id_estado FROM EstadoReporte WHERE nombre = 'Resuelto'),
        'La situación fue atendida y ya no se observa la quema de residuos.'
    );


-- ============================================
-- PUNTOS DE RECICLAJE
-- ============================================

INSERT INTO PuntoReciclaje
    (
        id_ubicacion,
        nombre,
        descripcion,
        materiales,
        horario,
        telefono,
        estado
    )
VALUES
    (
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'San Marcos'
            AND municipio = 'San Marcos'),
        'Centro de Reciclaje San Marcos',
        'Punto de recepción de materiales reciclables.',
        'Papel, cartón, plástico y vidrio',
        'Lunes a viernes de 08:00 a 17:00',
        '55551001',
        'activo'
    ),
    (
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Santa Rosa'
            AND municipio = 'Cuilapa'),
        'Punto Verde Cuilapa',
        'Centro comunitario para la recepción de materiales reciclables.',
        'Papel, plástico, vidrio y aluminio',
        'Lunes a sábado de 08:00 a 16:00',
        '55551002',
        'activo'
    ),
    (
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Sololá'
            AND municipio = 'Panajachel'),
        'Recicla Panajachel',
        'Punto de reciclaje para vecinos y visitantes.',
        'Plástico, vidrio y aluminio',
        'Lunes a domingo de 09:00 a 17:00',
        '55551003',
        'activo'
    ),
    (
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Suchitepéquez'
            AND municipio = 'Mazatenango'),
        'Centro Verde Mazatenango',
        'Centro de recepción de residuos reciclables.',
        'Papel, cartón, plástico y vidrio',
        'Lunes a viernes de 08:00 a 17:00',
        '55551004',
        'activo'
    ),
    (
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Totonicapán'
            AND municipio = 'Totonicapán'),
        'Reciclaje Totonicapán',
        'Punto local para clasificación de materiales.',
        'Papel, cartón, plástico y aluminio',
        'Lunes a viernes de 08:00 a 16:00',
        '55551005',
        'activo'
    ),
    (
        (SELECT id_ubicacion FROM Ubicacion
            WHERE departamento = 'Zacapa'
            AND municipio = 'Zacapa'),
        'Punto Verde Zacapa',
        'Centro de recepción de materiales reciclables.',
        'Plástico, vidrio, aluminio y cartón',
        'Lunes a sábado de 08:00 a 17:00',
        '55551006',
        'activo'
    );


-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT 'Roles' AS tabla, COUNT(*) AS registros FROM Rol
UNION ALL
SELECT 'Categorias', COUNT(*) FROM Categoria
UNION ALL
SELECT 'Estados', COUNT(*) FROM EstadoReporte
UNION ALL
SELECT 'Ubicaciones', COUNT(*) FROM Ubicacion
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM Usuario
UNION ALL
SELECT 'Reportes', COUNT(*) FROM Reporte
UNION ALL
SELECT 'Apoyos', COUNT(*) FROM ApoyoReporte
UNION ALL
SELECT 'Comentarios', COUNT(*) FROM ComentarioReporte
UNION ALL
SELECT 'Seguimientos', COUNT(*) FROM Seguimiento
UNION ALL
SELECT 'Puntos reciclaje', COUNT(*) FROM PuntoReciclaje;