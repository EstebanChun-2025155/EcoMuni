import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evidences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evidences.html',
  styleUrls: ['./evidences.css']
})
export class EvidencesComponent {
  brandName: string = 'EcoMuni';
  navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Locations', path: '/locations' },
    { name: 'Reports', path: '/reports' },
    { name: 'Help', path: '/help' }
  ];

  evidencesList = [
    { title: 'Inspección Zona 3', image: '/ubicacion2.png', date: '15/09/2026' },
    { title: 'Verificación Zona 7', image: '/ubicacion3.png', date: '14/09/2026' },
    { title: 'Evidencia Clandestino', image: '/ubicacion1.png', date: '12/09/2026' }
  ];

  onNavigate(path: string): void { console.log('Navegando a:', path); }
  onLogout(): void { console.log('Logout'); }
  onScrollDown(): void { window.scrollBy({ top: window.innerHeight, behavior: 'smooth' }); }
}