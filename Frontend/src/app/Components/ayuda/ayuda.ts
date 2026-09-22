import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  template: `
    <div class="bg-blur"></div>
    <app-navbar></app-navbar>
    <main class="pagina">
      <p class="eyebrow">EcoMuni</p>
      <h1>Ayuda</h1>
      <p><strong>¿Cómo funciona?</strong></p>
      <p>1. Inicia sesión con tu cuenta.<br>
         2. Entra a <em>Reportes</em> y elige tu departamento.<br>
         3. Crea un reporte describiendo el problema y adjunta evidencia.<br>
         4. Sigue el estado de tu reporte en <em>Seguimiento</em>.<br>
         5. Revisa las iniciativas vigentes en <em>Campañas</em>.</p>
      <p>Si tienes dudas, contacta al administrador de tu municipio.</p>
      <a routerLink="/home">← Volver al inicio</a>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      color: #fff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .pagina { max-width: 760px; margin: 0 auto; padding: 130px 24px 60px; }
    .eyebrow { color: #caeb93; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 10px; }
    h1 { font-size: clamp(2.2rem, 5vw, 3.2rem); margin: 0 0 18px; }
    p { line-height: 1.7; opacity: .92; margin: 0 0 14px; }
    a { display: inline-block; margin-top: 10px; color: #caeb93; font-weight: 600; }
  `]
})
export class AyudaComponent {}
