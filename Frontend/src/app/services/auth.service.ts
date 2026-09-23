import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

export interface UsuarioSesion {
  idUsuario: number;
  idRol: number;
  nombres: string;
  apellidos: string;
  correo: string;
  estado: 'activo' | 'suspendido';
}

interface RespuestaSesion {
  usuario: UsuarioSesion;
}

export interface DatosRegistro {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
  telefono?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api/auth';

  private readonly usuarioActual = signal<UsuarioSesion | null>(null);
  readonly usuario = this.usuarioActual.asReadonly();

  login(correo: string, contrasena: string) {
    return this.http
      .post<RespuestaSesion>(`${this.api}/login`, { correo, contrasena }, { withCredentials: true })
      .pipe(tap((respuesta) => this.usuarioActual.set(respuesta.usuario)));
  }

  obtenerSesion() {
    return this.http.get<RespuestaSesion>(`${this.api}/me`, { withCredentials: true }).pipe(
      tap((respuesta) => this.usuarioActual.set(respuesta.usuario)),
      catchError((error) => {
        this.usuarioActual.set(null);
        return throwError(() => error);
      }),
    );
  }

  logout() {
    return this.http
      .post<void>(`${this.api}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.usuarioActual.set(null)));
  }

  register(datos: DatosRegistro) {
    return this.http.post<{ mensaje: string }>(`${this.api}/register`, datos, {
      withCredentials: true,
    });
  }
}
