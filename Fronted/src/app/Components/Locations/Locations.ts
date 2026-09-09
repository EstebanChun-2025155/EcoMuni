import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavLink {
  name: string;
  path: string;
}

interface LocationItem {
  name: string;
  image: string;
}

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Locations.html',
  styleUrls: ['./Locations.css']
})
export class LocationsComponent {
  brandName: string = 'EcoMuni';

  navLinks: NavLink[] = [
    { name: 'About', path: '/about' },
    { name: 'Locations', path: '/locations' },
    { name: 'Reports', path: '/reports' },
    { name: 'Help', path: '/help' }
  ];

  locationsList: LocationItem[] = [
    { name: 'clandestino', image: '/ubicacion1.png' },
    { name: 'zona 3', image: '/ubicacion2.png' },
    { name: 'zona 7', image: '/ubicacion3.png' }
  ];

  onMenuClick(): void {
    console.log('Menú desplegado');
  }

  onNavigate(path: string): void {
    console.log('Navegando a:', path);
  }

  onLogout(): void {
    console.log('Sesión cerrada');
  }

  onScrollDown(): void {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }
}