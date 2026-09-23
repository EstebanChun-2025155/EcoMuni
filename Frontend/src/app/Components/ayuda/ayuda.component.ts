import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  template: `
    <div class="bg-blur" aria-hidden="true"></div>
    <app-navbar></app-navbar>

    <header class="encabezado">
      <div class="caja-cristal">
        <h1>Ayuda</h1>
        <p>Guía rápida para reportar, seguir y participar en tu comunidad.</p>
      </div>
    </header>

    <main>
      <section class="seccion seccion-blanco">
        <div class="seccion-contenido">
          <p class="kicker">Paso a paso</p>
          <h2>¿Cómo funciona?</h2>
          <p class="seccion-subtitulo">Cinco pasos para resolver tus reportes ambientales.</p>
          <div class="pasos">
            <article class="paso">
              <span class="paso-num">1</span>
              <p>Inicia sesión con tu cuenta de EcoMuni.</p>
            </article>
            <article class="paso">
              <span class="paso-num">2</span>
              <p>Entra a <em>Reportes</em> y elige tu departamento.</p>
            </article>
            <article class="paso">
              <span class="paso-num">3</span>
              <p>Crea un reporte describiendo el problema y adjunta evidencia.</p>
            </article>
            <article class="paso">
              <span class="paso-num">4</span>
              <p>Sigue el estado de tu reporte en <em>Seguimiento</em>.</p>
            </article>
            <article class="paso">
              <span class="paso-num">5</span>
              <p>Revisa las iniciativas vigentes en <em>Campañas</em>.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="seccion seccion-blanco-alterno">
        <div class="dudas-grid">
          <div class="dudas-texto">
            <h2>¿Tienes dudas?</h2>
            <p>
              Si tienes dudas sobre un reporte, una campaña o tu cuenta, contacta al administrador
              de tu municipio y te orientará con gusto.
            </p>
            <a class="btn btn-claro" routerLink="/home">Volver al inicio</a>
          </div>
          <div class="dudas-svg" aria-hidden="true">
            <svg viewBox="0 0 420 300" aria-hidden="true" focusable="false">
              <circle cx="210" cy="150" r="140" fill="#4A3A2A" />
              <ellipse cx="210" cy="243" rx="152" ry="13" fill="#D7D2C7" />
              <rect x="118" y="66" width="184" height="114" rx="26" fill="#D7D2C7" />
              <path d="M166 180 L154 212 L200 180 Z" fill="#D7D2C7" />
              <text
                x="210"
                y="150"
                text-anchor="middle"
                font-family="Poppins, sans-serif"
                font-size="78"
                font-weight="700"
                fill="#1F3B2C"
              >
                ?
              </text>
              <rect x="296" y="200" width="12" height="44" rx="6" fill="#1F3B2C" />
              <ellipse
                cx="282"
                cy="188"
                rx="20"
                ry="10"
                fill="#6B7F3A"
                transform="rotate(-30 282 188)"
              />
              <ellipse
                cx="322"
                cy="182"
                rx="20"
                ry="10"
                fill="#6B7F3A"
                transform="rotate(28 322 182)"
              />
              <path
                d="M298 172 Q304 160 316 158"
                stroke="#1F3B2C"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
              <circle cx="122" cy="212" r="16" fill="#D7D2C7" />
              <rect x="104" y="228" width="36" height="30" rx="14" fill="#1F3B2C" />
              <circle cx="326" cy="226" r="12" fill="#D7D2C7" />
              <rect x="312" y="238" width="28" height="20" rx="11" fill="#4A3A2A" />
            </svg>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        overflow-x: hidden;
        color: #4a3a2a;
      }

      .encabezado {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 135px 8% 65px;
      }

      .caja-cristal {
        max-width: 760px;
        padding: 40px 48px;
        border-radius: 28px;
        background: rgba(215, 210, 199, 0.1);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
        animation: pop-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes pop-in {
        from {
          opacity: 0;
          transform: scale(0.72);
          filter: blur(12px);
        }
        to {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }
      }

      .caja-cristal h1 {
        margin: 0 0 4px;
        color: #ffffff;
        font-size: clamp(2rem, 5vw, 3.2rem);
        line-height: 1.15;
        text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      }

      .caja-cristal h1::after {
        content: '';
        display: block;
        width: 64px;
        height: 4px;
        margin: 14px auto 0;
        border-radius: 999px;
        background: #6b7f3a;
      }

      .caja-cristal p {
        margin: 0;
        color: #d7d2c7;
        font-size: 1.05rem;
        line-height: 1.6;
      }

      .seccion {
        padding: 80px 8%;
      }

      .seccion-blanco {
        background: #d7d2c7;
      }

      .seccion-blanco-alterno {
        background: #1f3b2c;
      }

      .seccion-contenido {
        max-width: 1150px;
        margin: 0 auto;
      }

      .seccion-contenido > h2 {
        text-align: center;
        font-size: clamp(1.7rem, 3vw, 2.4rem);
        color: #1f3b2c;
        margin: 0 0 4px;
      }

      .seccion-contenido > h2::after {
        content: '';
        display: block;
        width: 64px;
        height: 4px;
        margin: 14px auto 0;
        border-radius: 999px;
        background: #6b7f3a;
      }

      .seccion-subtitulo {
        text-align: center;
        color: #4a3a2a;
        font-size: 1.05rem;
        max-width: 640px;
        margin: 16px auto 44px;
      }

      .kicker {
        margin: 0 0 10px;
        text-align: center;
        color: #6b7f3a;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .btn {
        display: inline-block;
        padding: 11px 24px;
        border: none;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.95rem;
        text-decoration: none;
        text-align: center;
        cursor: pointer;
      }

      .btn-claro {
        background: #6b7f3a;
        color: #ffffff;
      }

      .btn-claro:hover {
        background: #d7d2c7;
        color: #1f3b2c;
      }

      .pasos {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
        gap: 24px;
      }

      .paso {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 30px 24px 26px;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 6px 18px rgba(31, 59, 44, 0.1);
        transition:
          transform 0.4s,
          box-shadow 0.4s;
      }

      .paso::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: #6b7f3a;
      }

      .paso:hover {
        transform: translateY(-6px);
        box-shadow: 0 14px 30px rgba(31, 59, 44, 0.16);
      }

      .paso-num {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #6b7f3a;
        color: #ffffff;
        font-weight: 800;
        font-size: 1.1rem;
      }

      .paso p {
        margin: 0;
        color: #4a3a2a;
        line-height: 1.6;
      }

      .paso strong,
      .paso em {
        color: #1f3b2c;
        font-weight: 700;
        font-style: normal;
      }

      .dudas-grid {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        gap: 48px;
        align-items: center;
      }

      .dudas-texto h2 {
        font-size: clamp(1.7rem, 3vw, 2.4rem);
        color: #ffffff;
        margin: 0 0 16px;
      }

      .dudas-texto h2::after {
        content: '';
        display: block;
        width: 64px;
        height: 4px;
        margin-top: 14px;
        border-radius: 999px;
        background: #6b7f3a;
      }

      .dudas-texto p {
        margin: 0 0 18px;
        color: #d7d2c7;
        line-height: 1.7;
      }

      .dudas-svg svg {
        width: 100%;
        height: auto;
        display: block;
      }

      a:focus-visible,
      button:focus-visible {
        outline: 3px solid #6b7f3a;
        outline-offset: 3px;
      }

      @media (max-width: 900px) {
        .dudas-grid {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .dudas-texto h2::after {
          margin-left: auto;
          margin-right: auto;
        }
      }

      @media (max-width: 760px) {
        .caja-cristal {
          padding: 32px 26px;
        }

        .seccion {
          padding: 64px 6%;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .caja-cristal {
          animation: none;
        }
      }
    `,
  ],
})
export class AyudaComponent {}
