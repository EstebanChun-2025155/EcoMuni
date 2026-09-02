import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterData } from '../Service/Reguister';

@Component({
  selector: 'app-reguister',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Reguister.html',
  styleUrls: ['./Reguister.css']
})
export class ReguisterComponent {
  buttonText: string = 'Ingresar';
  placeholders = {
    nombre: 'Nombre:',
    correo: 'Correo:',
    contrasena: 'Contraseña:',
    confirmarContrasena: 'Confirmar Contraseña:'
  };

  formData: RegisterData = {
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  loading: boolean = false;

  constructor(private authService: AuthService) {}

  async onSubmit(): Promise<void> {
    this.loading = true;
    const response = await this.authService.register(this.formData);
    this.loading = false;

    alert(response.message);

    if (response.success) {
      this.formData = { nombre: '', correo: '', contrasena: '', confirmarContrasena: '' };
    }
  }

  onBack(): void {
    window.history.back();
  }
}