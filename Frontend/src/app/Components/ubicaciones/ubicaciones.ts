import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  template: `
    <app-navbar></app-navbar>
    <main class="pagina">
      <p class="eyebrow">EcoMuni</p>
      <h1>Ubicaciones</h1>
      <p>Estamos integrando el mapa de puntos de reciclaje por departamento.</p>
      <p>Por ahora puedes consultar los 22 departamentos y sus puntos de reciclaje
         desde la vista de Reportes, eligiendo el departamento que te interese.</p>
      <a routerLink="/departamentos">← Ir a los departamentos</a>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(#123e3155, #10392ecc), url('/bosque.png') center / cover no-repeat fixed;
    }
    .pagina { max-width: 760px; margin: 0 auto; padding: 130px 24px 60px; }
    .eyebrow { color: #caeb93; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 10px; }
    h1 { font-size: clamp(2.2rem, 5vw, 3.2rem); margin: 0 0 18px; }
    p { line-height: 1.7; opacity: .92; margin: 0 0 14px; }
    a { display: inline-block; margin-top: 10px; color: #caeb93; font-weight: 600; }
  `]
})
export class UbicacionesComponent {}
