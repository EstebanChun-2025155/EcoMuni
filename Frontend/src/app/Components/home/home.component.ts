import { AfterViewInit, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, finalize } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { ConsultaService } from '../../services/consulta.service';
import { DepartamentoService } from '../../services/departamento.service';
import type { CategoriaConsulta, EvidenciaConsulta } from '../../models/consulta';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  private readonly consulta = inject(ConsultaService);
  private readonly destroyRef = inject(DestroyRef);
  readonly api = inject(DepartamentoService);

  readonly frases: string[] = [
    'Ayudando a mantener <br> el medio ambiente',
    'Cuidando los espacios <br> de nuestra comunidad',
    'Únete al cambio <br> con EcoMuni',
  ];

  readonly categorias = signal<CategoriaConsulta[]>([]);
  readonly evidencias = signal<EvidenciaConsulta[]>([]);
  readonly cargandoCategorias = signal(true);
  readonly cargandoEvidencias = signal(true);

  readonly carruselItems = computed(() => {
    const base = this.categorias();
    const grupos = base.length > 0 && base.length < 6 ? Math.ceil(6 / base.length) : 1;
    const lleno = Array.from({ length: grupos }, () => base).flat();
    return [...lleno, ...lleno];
  });

  constructor() {
    this.consulta
      .listar<CategoriaConsulta>('categorias', 1)
      .pipe(
        catchError(() => EMPTY),
        finalize(() => this.cargandoCategorias.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((pagina) => this.categorias.set(pagina.items));

    this.consulta
      .listar<EvidenciaConsulta>('evidencias', 1)
      .pipe(
        catchError(() => EMPTY),
        finalize(() => this.cargandoEvidencias.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((pagina) => this.evidencias.set(pagina.items));
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((elemento) => elemento.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observer.unobserve(entrada.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((elemento) => observer.observe(elemento));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  onScrollDown(): void {
    document.getElementById('acerca')?.scrollIntoView({ behavior: 'smooth' });
  }

  irA(id: string, evento: Event): void {
    evento.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
