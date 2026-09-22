import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.css'
})
export class SeguimientoComponent {

  readonly seguimientos = [
    {
      id: 1,
      reporte: 1,
      usuario: 1,
      estado: 2,
      observacion: 'El reporte fue recibido y está siendo revisado.',
      fecha: '16/09/2026'
    },
    {
      id: 2,
      reporte: 2,
      usuario: 1,
      estado: 3,
      observacion: 'Se verificó la situación reportada.',
      fecha: '16/09/2026'
    },
    {
      id: 3,
      reporte: 3,
      usuario: 2,
      estado: 4,
      observacion: 'El problema fue solucionado.',
      fecha: '15/09/2026'
    }
  ];

  onScrollDown(): void {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
}
