import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Service/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    nombre: string = '';
    correo: string = '';

    constructor(private authService: AuthService) { }

    onLogin(event: Event): void {
        event.preventDefault();

        const exito = this.authService.login(this.nombre, this.correo);
        if (exito) {
            alert('¡Ingreso exitoso!');
        } else {
            alert('Por favor, rellena los campos correctamente.');
        }
    }
}
