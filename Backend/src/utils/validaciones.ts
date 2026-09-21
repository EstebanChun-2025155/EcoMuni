function textoValido(valor: unknown, max: number, obligatorio=true): boolean {
 return (valor==null&&!obligatorio)||(typeof valor==='string'&&(!obligatorio||valor.trim().length>0)&&valor.trim().length<=max&&!valor.includes('\0'));
}
function idValido(valor:unknown):boolean{return typeof valor==='number'&&Number.isSafeInteger(valor)&&valor>0&&valor<=2147483647;}
export function validarRol(nombre:unknown,descripcion?:unknown):string[]{
 const errores:string[]=[];
 if(!textoValido(nombre,30))errores.push('El nombre del rol es obligatorio y no puede superar 30 caracteres.');
 if(!textoValido(descripcion,150,false))errores.push('La descripción es inválida; admite hasta 150 caracteres.');
 return errores;
}
export function validarCategoria(nombre?:unknown,descripcion?:unknown,estado?:unknown):string[]{
 const errores:string[]=[];
 if(typeof nombre!=='string'||!['basurero clandestino','acumulacion de basura','quema de residuos','contaminacion de area publica','desechos peligrosos','otro'].includes(nombre.trim()))errores.push('Categoría inválida.');
 if(!textoValido(descripcion,200,false))errores.push('Descripción inválida; admite hasta 200 caracteres.');
 if(estado!=='activa'&&estado!=='inactiva')errores.push('Estado de categoría inválido.');
 return errores;
}
export function validarUbicacion(departamento:unknown,municipio:unknown,zona?:unknown,direccion?:unknown,referencia?:unknown):string[]{
 const errores:string[]=[];
 for(const [nombre,valor,max,obligatorio] of [['Departamento',departamento,60,true],['Municipio',municipio,80,true],['Zona',zona,15,false],['Dirección',direccion,200,false],['Referencia',referencia,200,false]] as const){if(!textoValido(valor,max,obligatorio))errores.push(nombre+' inválido; admite hasta '+max+' caracteres.');}
 return errores;
}
export function validarUsuario(idRol:unknown,nombres:unknown,apellidos:unknown,correo:unknown,contrasena?:unknown,telefono?:unknown,estado?:unknown,validarContrasena=true):string[]{
 const errores:string[]=[];
 if(!idValido(idRol))errores.push('ID del rol inválido.');
 if(!textoValido(nombres,60))errores.push('Los nombres son obligatorios y no pueden superar 60 caracteres.');
 if(!textoValido(apellidos,60))errores.push('Los apellidos son obligatorios y no pueden superar 60 caracteres.');
 if(!textoValido(correo,120)||typeof correo!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()))errores.push('Correo inválido.');
 if(validarContrasena||(contrasena!==undefined&&contrasena!=='')){
  if(typeof contrasena!=='string'||contrasena.length<8||Buffer.byteLength(contrasena,'utf8')>72||!/[A-Z]/.test(contrasena)||!/[a-z]/.test(contrasena)||!/[0-9]/.test(contrasena)||!/[!@#$%^&*(),.?":{}|<>]/.test(contrasena)||contrasena.includes('\0'))errores.push('La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo; máximo 72 bytes.');
 }
 if(!textoValido(telefono,20,false)||(typeof telefono==='string'&&telefono.trim()!==''&&!/^[0-9]+$/.test(telefono.trim())))errores.push('Teléfono inválido; admite hasta 20 dígitos.');
 if(estado!=='activo'&&estado!=='suspendido')errores.push('El estado debe ser activo o suspendido.');
 return errores;
}
export function validarReporte(idUsuario?:unknown,idCategoria?:unknown,idUbicacion?:unknown,idEstado?:unknown,codigo?:unknown,titulo?:unknown,descripcion?:unknown,prioridad?:unknown,motivoRechazo?:unknown,fechaReporte?:unknown,fechaActualizacion?:unknown):string[]{
 const errores:string[]=[];
 if(![idUsuario,idCategoria,idUbicacion,idEstado].every(idValido))errores.push('Los IDs del reporte son inválidos.');
 if(!textoValido(codigo,15)||!textoValido(titulo,100)||!textoValido(descripcion,500)||!textoValido(motivoRechazo,250,false))errores.push('Los textos del reporte son inválidos.');
 if(!['baja','media','alta'].includes(String(prioridad)))errores.push('Prioridad inválida.');
 if(!fechaValida(fechaReporte)||!fechaValida(fechaActualizacion))errores.push('Fecha inválida.');
 return errores;
}
function fechaValida(valor:unknown):boolean{return (typeof valor==='string'||valor instanceof Date)&&!Number.isNaN(new Date(valor).getTime());}
export function validarEvidencia(idReporte?:unknown,urlImagen?:unknown,descripcion?:unknown,fechaSubida?:unknown):string[]{
 const errores:string[]=[];
 if(!idValido(idReporte))errores.push('ID de reporte inválido.');
 if(!textoValido(urlImagen,300)||!textoValido(descripcion,150,false))errores.push('Los datos de evidencia son inválidos.');
 if(!fechaValida(fechaSubida))errores.push('Fecha inválida.');
 return errores;
}
