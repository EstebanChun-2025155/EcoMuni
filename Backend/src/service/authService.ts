import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { agregarUsuario } from './usuarioService';

interface UsuarioAutenticacion {
  idUsuario: number;
  idRol: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  estado: 'activo' | 'suspendido';
}

const hashDeRelleno = bcrypt.hash('EcoMuni:comprobacion-interna', 12);

export async function autenticarUsuario(correo: string, contrasena: string) {
  const resultado = await pool.query<UsuarioAutenticacion>(
    `SELECT id_usuario AS "idUsuario", id_rol AS "idRol",
                nombres, apellidos, correo, contrasena, estado
         FROM usuario
         WHERE correo = $1`,
    [correo.trim().toLowerCase()],
  );

  const usuario = resultado.rows[0];
  const hash = usuario?.contrasena ?? (await hashDeRelleno);
  const coincide = await bcrypt.compare(contrasena, hash);

  if (!usuario || !coincide || usuario.estado !== 'activo') {
    return null;
  }

  return {
    idUsuario: usuario.idUsuario,
    idRol: usuario.idRol,
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    estado: usuario.estado,
  };
}

interface DatosRegistro {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  telefono?: string | null;
}

export async function registrarCiudadano(datos: DatosRegistro) {
  const resultado = await pool.query<{ id_rol: number }>(
    'SELECT id_rol FROM rol WHERE nombre = $1',
    ['Ciudadano'],
  );
  const rol = resultado.rows[0];

  if (!rol) {
    throw new Error('Registro no disponible: falta configurar el rol Ciudadano.');
  }

  return agregarUsuario({
    idRol: rol.id_rol,
    nombres: datos.nombres,
    apellidos: datos.apellidos,
    correo: datos.correo,
    contrasena: datos.contrasena,
    telefono: datos.telefono,
    estado: 'activo',
  });
}
