import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-acerca-de',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  template: `
    <div class="bg-blur"></div>
    <app-navbar></app-navbar>
    <main class="pagina">
      <p class="eyebrow">EcoMuni</p>
      <h1>Acerca de</h1>
      <p>
        EcoMuni es la plataforma ciudadana para reportar, dar seguimiento y resolver problemas
        ambientales en los 22 departamentos de Guatemala.
      </p>
      <p>
        Registra un reporte desde la vista de tu departamento, adjunta evidencia y sigue su estado
        hasta la solución. También puedes apoyar y comentar los reportes de tu comunidad.
      </p>
      <a routerLink="/home">← Volver al inicio</a>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        position: relative;
        color: #fff;
      }
      .pagina {
        max-width: 760px;
        margin: 0 auto;
        padding: 130px 24px 60px;
      }
      .eyebrow {
        color: #caeb93;
        font-size: 0.8rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin: 0 0 10px;
      }
      h1 {
        font-size: clamp(2.2rem, 5vw, 3.2rem);
        margin: 0 0 18px;
      }
      p {
        line-height: 1.7;
        opacity: 0.92;
        margin: 0 0 14px;
      }
      a {
        display: inline-block;
        margin-top: 10px;
        color: #caeb93;
        font-weight: 600;
      }
    `,
  ],
})
export class AcercaDeComponent {}
