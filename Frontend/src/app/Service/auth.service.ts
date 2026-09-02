import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() { }

    login(nombre: string, correo: string): boolean {
        console.log('Enviando datos al backend:', { nombre, correo });

        if (nombre.trim() !== '' && correo.includes('@')) {
            localStorage.setItem('user_token', 'fake-jwt-token');
            return true;
        }
        return false;
    }
}
