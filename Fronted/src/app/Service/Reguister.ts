import { Injectable } from '@angular/core';

export interface RegisterData {
  nombre: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async register(data: RegisterData): Promise<ApiResponse> {
    if (data.contrasena !== data.confirmarContrasena) {
      return { success: false, message: 'Las contraseñas no coinciden.' };
    }

    // Simulación de petición HTTP
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: '¡Registro realizado con éxito!' });
      }, 800);
    });
  }
}