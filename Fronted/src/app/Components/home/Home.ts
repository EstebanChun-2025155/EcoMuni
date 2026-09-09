import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavLink {
  name: string;
  path: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Home.html',
  styleUrls: ['./Home.css']
})
export class HomeComponent {
  brandName: string = 'EcoMuni';
  
  heroTitle: string = 'Ayudando a mantener <br> el medio ambiente';

  navLinks: NavLink[] = [
    { name: 'About', path: '/about' },
    { name: 'Locations', path: '/locations' },
    { name: 'Reports', path: '/reports' },
    { name: 'Help', path: '/help' }
  ];

  onMenuClick(): void {
    console.log('Menú desplegado');
    // Aquí puedes abrir un drawer o menú móvil
  }

  onNavigate(path: string): void {
    console.log('Navegando a:', path);
    // Aquí puedes usar Router de Angular: this.router.navigate([path]);
  }

  onLogout(): void {
    console.log('Sesión cerrada');
    // Lógica para limpiar tokens y redirigir al login
  }

  onScrollDown(): void {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }
}