import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent {
  brandName: string = 'EcoMuni';
  navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Locations', path: '/locations' },
    { name: 'Reports', path: '/reports' },
    { name: 'Help', path: '/help' }
  ];

  reportsList = [
    { id: 1, title: 'Basurero Clandestino', zone: 'Zona 3', description: 'Acumulación de residuos sólidos en vía pública.', status: 'Activo' },
    { id: 2, title: 'Tala Ilegal de Árboles', zone: 'Zona 7', description: 'Poda clandestina reportada por vecinos.', status: 'En Proceso' },
    { id: 3, title: 'Fuga de Agua Potable', zone: 'Zona 1', description: 'Daño en tubería principal reportado.', status: 'Resuelto' }
  ];

  onNavigate(path: string): void { console.log('Navegando a:', path); }
  onLogout(): void { console.log('Logout'); }
  onScrollDown(): void { window.scrollBy({ top: window.innerHeight, behavior: 'smooth' }); }
  viewDetails(id: number): void { console.log('Ver reporte:', id); }
}