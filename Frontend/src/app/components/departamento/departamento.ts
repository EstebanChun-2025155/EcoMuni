import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

type EstadoReporte = 'Pendiente' | 'En proceso' | 'Resuelto';
type PrioridadReporte = 'baja' | 'media' | 'alta';

interface ComentarioVisual {
  autor: string;
  fecha: string;
  texto: string;
}

interface ReporteVisual {
  id: number;
  estado: EstadoReporte;
  categoria: string;
  titulo: string;
  ubicacion: string;
  descripcion: string;
  prioridad: PrioridadReporte;
  fecha: string;
  apoyos: number;
  evidencias: string[];
  comentarios: ComentarioVisual[];
}

interface PuntoReciclajeVisual {
  nombre: string;
  ubicacion: string;
  materiales: string;
}

interface DepartamentoVisual {
  slug: string;
  nombre: string;
  cabecera: string;
  municipios: number;
  frase: string;
  imagen: string;
  lugares: string[];
  puntos: PuntoReciclajeVisual[];
}

const DEPARTAMENTOS: Record<string, DepartamentoVisual> = {
  guatemala: {
    slug: 'guatemala',
    nombre: 'Guatemala',
    cabecera: 'Ciudad de Guatemala',
    municipios: 17,
    frase: 'Una ciudad que avanza hacia comunidades más limpias y sostenibles.',
    imagen: '/Capital.jpg',
    lugares: [
      'Zona 1',
      'Zona 7',
      'Zona 12',
      'Mixco'
    ],
    puntos: [
      {
        nombre: 'Centro de acopio Zona 1',
        ubicacion: 'Ciudad de Guatemala',
        materiales: 'Plástico, papel y cartón'
      },
      {
        nombre: 'Punto Verde Zona 10',
        ubicacion: 'Ciudad de Guatemala',
        materiales: 'Vidrio, latas y plástico'
      },
      {
        nombre: 'Centro de reciclaje Mixco',
        ubicacion: 'Mixco',
        materiales: 'Papel, cartón y electrónicos'
      }
    ]
  },

  huehuetenango: {
    slug: 'huehuetenango',
    nombre: 'Huehuetenango',
    cabecera: 'Huehuetenango',
    municipios: 33,
    frase: 'Comunidades de montaña comprometidas con el cuidado de sus recursos naturales.',
    imagen: '/Huehuetenango.png',
    lugares: [
      'Zona 1',
      'Zona 4',
      'Chiantla',
      'Aguacatán'
    ],
    puntos: [
      {
        nombre: 'Punto Verde Central',
        ubicacion: 'Huehuetenango, Zona 1',
        materiales: 'Plástico y papel'
      },
      {
        nombre: 'Centro de acopio municipal',
        ubicacion: 'Huehuetenango, Zona 4',
        materiales: 'Cartón, vidrio y latas'
      },
      {
        nombre: 'Punto comunitario Chiantla',
        ubicacion: 'Chiantla',
        materiales: 'Plástico y envases'
      }
    ]
  },

  izabal: {
    slug: 'izabal',
    nombre: 'Izabal',
    cabecera: 'Puerto Barrios',
    municipios: 5,
    frase: 'Entre el lago, el mar y la selva, cada acción ayuda a proteger un ecosistema único.',
    imagen: '/Izabal.png',
    lugares: [
      'Puerto Barrios',
      'Livingston',
      'Morales',
      'Los Amates'
    ],
    puntos: [
      {
        nombre: 'Centro de acopio Puerto Barrios',
        ubicacion: 'Puerto Barrios',
        materiales: 'Plástico, vidrio y latas'
      },
      {
        nombre: 'Punto limpio Livingston',
        ubicacion: 'Livingston',
        materiales: 'Plástico y papel'
      },
      {
        nombre: 'Punto comunitario Morales',
        ubicacion: 'Morales',
        materiales: 'Cartón y envases'
      }
    ]
  },

  jalapa: {
    slug: 'jalapa',
    nombre: 'Jalapa',
    cabecera: 'Jalapa',
    municipios: 7,
    frase: 'Tradición, naturaleza y comunidades comprometidas con un futuro más verde.',
    imagen: '/Jalapa.png',
    lugares: [
      'Jalapa, Zona 1',
      'Jalapa, Zona 3',
      'Monjas',
      'San Pedro Pinula'
    ],
    puntos: [
      {
        nombre: 'Parque Central de Jalapa',
        ubicacion: 'Jalapa, Zona 1',
        materiales: 'Plástico y latas'
      },
      {
        nombre: 'Centro de acopio municipal',
        ubicacion: 'Jalapa, Zona 2',
        materiales: 'Papel, cartón y plástico'
      },
      {
        nombre: 'Punto de reciclaje Monjas',
        ubicacion: 'Monjas',
        materiales: 'Vidrio, plástico y cartón'
      }
    ]
  },

  jutiapa: {
    slug: 'jutiapa',
    nombre: 'Jutiapa',
    cabecera: 'Jutiapa',
    municipios: 17,
    frase: 'Participación ciudadana para mantener espacios públicos más limpios y responsables.',
    imagen: '/Jutiapa.png',
    lugares: [
      'Jutiapa, Zona 1',
      'El Progreso',
      'Asunción Mita',
      'Jalpatagua'
    ],
    puntos: [
      {
        nombre: 'Punto Verde Parque Central',
        ubicacion: 'Jutiapa, Zona 1',
        materiales: 'Plástico y papel'
      },
      {
        nombre: 'Centro de acopio Jutiapa',
        ubicacion: 'Jutiapa',
        materiales: 'Cartón, vidrio y latas'
      },
      {
        nombre: 'Punto comunitario Asunción Mita',
        ubicacion: 'Asunción Mita',
        materiales: 'Plástico y envases'
      }
    ]
  }
};

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './departamento.html',
  styleUrl: './departamento.css'
})
export class DepartamentoComponent {
  readonly auth = inject(AuthService);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly cerrando = signal(false);
  readonly error = signal('');
  readonly menuAbierto = signal(true);
  readonly mostrarNuevoReporte = signal(false);

  departamento!: DepartamentoVisual;

  reportes: ReporteVisual[] = [];
  reporteSeleccionado: ReporteVisual | null = null;

  filtroEstado = 'Todos';
  filtroCategoria = 'Todas';
  filtroPrioridad = 'Todas';

  comentarioNuevo = '';

  nuevoReporte = {
    titulo: '',
    categoria: 'Acumulación de basura',
    ubicacion: '',
    descripcion: '',
    prioridad: 'media' as PrioridadReporte
  };

  constructor() {
    this.route.paramMap.subscribe(parametros => {
      const slug = parametros.get('slug') ?? '';
      const departamento = DEPARTAMENTOS[slug];

      if (!departamento) {
        void this.router.navigateByUrl('/home');
        return;
      }

      this.departamento = departamento;
      this.reportes = this.crearReportes(departamento);
      this.reporteSeleccionado = null;
    });
  }

  get reportesFiltrados(): ReporteVisual[] {
    return this.reportes.filter(reporte => {
      const estado =
        this.filtroEstado === 'Todos' ||
        reporte.estado === this.filtroEstado;

      const categoria =
        this.filtroCategoria === 'Todas' ||
        reporte.categoria === this.filtroCategoria;

      const prioridad =
        this.filtroPrioridad === 'Todas' ||
        reporte.prioridad === this.filtroPrioridad;

      return estado && categoria && prioridad;
    });
  }

  get categorias(): string[] {
    return [...new Set(
      this.reportes.map(reporte => reporte.categoria)
    )];
  }

  alternarMenu(): void {
    this.menuAbierto.update(abierto => !abierto);
  }

  volverHome(): void {
    void this.router.navigateByUrl('/home');
  }

  abrirDetalle(reporte: ReporteVisual): void {
    this.reporteSeleccionado = reporte;

    setTimeout(() => {
      document.querySelector('.reporte-detalle')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  cerrarDetalle(): void {
    this.reporteSeleccionado = null;
  }

  agregarComentario(): void {
    const texto = this.comentarioNuevo.trim();

    if (!texto || !this.reporteSeleccionado) {
      return;
    }

    this.reporteSeleccionado.comentarios.push({
      autor: this.auth.usuario()?.nombres ?? 'Usuario',
      fecha: 'Ahora',
      texto
    });

    this.comentarioNuevo = '';
  }

  registrarReporteVisual(): void {
    const titulo = this.nuevoReporte.titulo.trim();
    const ubicacion = this.nuevoReporte.ubicacion.trim();
    const descripcion = this.nuevoReporte.descripcion.trim();

    if (!titulo || !ubicacion || !descripcion) {
      return;
    }

    const reporte: ReporteVisual = {
      id: Date.now(),
      estado: 'Pendiente',
      categoria: this.nuevoReporte.categoria,
      titulo,
      ubicacion,
      descripcion,
      prioridad: this.nuevoReporte.prioridad,
      fecha: 'Hoy',
      apoyos: 0,
      evidencias: [],
      comentarios: []
    };

    this.reportes = [reporte, ...this.reportes];
    this.reporteSeleccionado = reporte;
    this.mostrarNuevoReporte.set(false);

    this.nuevoReporte = {
      titulo: '',
      categoria: 'Acumulación de basura',
      ubicacion: '',
      descripcion: '',
      prioridad: 'media'
    };
  }

  cerrarSesion(): void {
    if (this.cerrando()) return;

    this.cerrando.set(true);
    this.error.set('');

    this.auth.logout()
      .pipe(finalize(() => this.cerrando.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/login', {
            replaceUrl: true
          });
        },
        error: () => {
          this.error.set('No se pudo cerrar la sesión.');
        }
      });
  }

  private crearReportes(departamento: DepartamentoVisual): ReporteVisual[] {
    const [lugar1, lugar2, lugar3, lugar4] = departamento.lugares;

    return [
      {
        id: 1,
        estado: 'Resuelto',
        categoria: 'Residuos sólidos',
        titulo: 'Basurero clandestino en vía pública',
        ubicacion: lugar1,
        descripcion:
          'Se reportó acumulación constante de desechos en un área de paso. La zona requiere limpieza y seguimiento para evitar que vuelva a utilizarse como basurero.',
        prioridad: 'alta',
        fecha: '12 abr. 2026',
        apoyos: 24,
        evidencias: [
          departamento.imagen,
          '/bosque.png'
        ],
        comentarios: [
          {
            autor: 'María López',
            fecha: '13 abr.',
            texto: 'Gracias por atender el reporte. La zona ya se ve más limpia.'
          },
          {
            autor: 'Carlos Méndez',
            fecha: '15 abr.',
            texto: 'Sería útil colocar depósitos para evitar que vuelva a ocurrir.'
          }
        ]
      },
      {
        id: 2,
        estado: 'En proceso',
        categoria: 'Reciclaje',
        titulo: 'Faltan contenedores de reciclaje',
        ubicacion: lugar2,
        descripcion:
          'Vecinos solicitan contenedores separados para plástico, papel y latas en un punto de alta circulación.',
        prioridad: 'media',
        fecha: '10 abr. 2026',
        apoyos: 18,
        evidencias: [
          '/image.png'
        ],
        comentarios: [
          {
            autor: 'Andrea Ruiz',
            fecha: '11 abr.',
            texto: 'Este punto recibe bastante tránsito y hace falta separar los residuos.'
          }
        ]
      },
      {
        id: 3,
        estado: 'Pendiente',
        categoria: 'Contaminación',
        titulo: 'Desechos acumulados cerca de drenaje',
        ubicacion: lugar3,
        descripcion:
          'Se observan bolsas y residuos alrededor de un drenaje. En época de lluvia podrían obstruir el paso del agua.',
        prioridad: 'alta',
        fecha: '8 abr. 2026',
        apoyos: 12,
        evidencias: [],
        comentarios: []
      },
      {
        id: 4,
        estado: 'En proceso',
        categoria: 'Residuos sólidos',
        titulo: 'Acumulación de basura en parque',
        ubicacion: lugar4,
        descripcion:
          'Se solicita una jornada de limpieza y mayor disponibilidad de depósitos para residuos alrededor del parque.',
        prioridad: 'media',
        fecha: '5 abr. 2026',
        apoyos: 31,
        evidencias: [
          '/bosque.png'
        ],
        comentarios: [
          {
            autor: 'Ana Rodríguez',
            fecha: '6 abr.',
            texto: 'Podríamos apoyar con una jornada comunitaria de limpieza.'
          }
        ]
      }
    ];
  }
}