import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface NavLink {
  name: string;
  path: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './Home.html',
  styleUrls: ['./Home.css']
})
export class HomeComponent {
  brandName: string = 'EcoMuni';
  
  heroTitle: string = 'Ayudando a mantener <br> el medio ambiente';

  navLinks: NavLink[] = [
    { name: 'About', path: '/about' },
    { name: 'Locations', path: '/locations' },
    { name: 'Reportes', path: '/reports' },
    { name: 'Help', path: '/help' }
  ];

  onMenuClick(): void {
    console.log('Menú desplegado');
    // Aquí puedes abrir un drawer o menú móvil
  }

  constructor(private router: Router) {}

  onNavigate(path: string): void {
    void this.router.navigateByUrl(path);
  }

  onLogout(): void {
    console.log('Sesión cerrada');
    // Lógica para limpiar tokens y redirigir al login
  }

  onScrollDown(): void {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }
}