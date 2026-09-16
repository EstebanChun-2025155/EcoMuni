import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent {
  brandName: string = 'EcoMuni';
  navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Locations', path: '/locations' },
    { name: 'Reports', path: '/reports' },
    { name: 'Help', path: '/help' }
  ];

  categoriesList = [
    { name: 'Contaminación', description: 'Residuos sólidos y descargas ilegales.', count: 42 },
    { name: 'Áreas Verdes', description: 'Protección de bosques urbanos y parques.', count: 18 },
    { name: 'Reciclaje', description: 'Puntos limpios y recolección selectiva.', count: 27 }
  ];

  onNavigate(path: string): void { console.log('Navegando a:', path); }
  onLogout(): void { console.log('Logout'); }
  onScrollDown(): void { window.scrollBy({ top: window.innerHeight, behavior: 'smooth' }); }
}