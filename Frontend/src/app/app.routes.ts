import { Routes } from '@angular/router';

import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { DepartamentosComponent } from './Components/departamentos/departamentos.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    loadComponent: () => import('./Components/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos',
    component: DepartamentosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'campana',
    loadComponent: () => import('./Components/campana/campana.component').then((m) => m.Campana),
    canActivate: [authGuard],
  },
  {
    path: 'seguimiento',
    loadComponent: () =>
      import('./Components/seguimiento/seguimiento.component').then((m) => m.SeguimientoComponent),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/alta-verapaz',
    loadComponent: () =>
      import('./Components/alta-verapaz/alta-verapaz.component').then(
        (m) => m.AltaVerapazComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/baja-verapaz',
    loadComponent: () =>
      import('./Components/baja-verapaz/baja-verapaz.component').then(
        (m) => m.BajaVerapazComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/chimaltenango',
    loadComponent: () =>
      import('./Components/chimaltenango/chimaltenango.component').then(
        (m) => m.ChimaltenangoComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/chiquimula',
    loadComponent: () =>
      import('./Components/chiquimula/chiquimula.component').then((m) => m.ChiquimulaComponent),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/el-progreso',
    loadComponent: () =>
      import('./Components/el-progreso/el-progreso.component').then((m) => m.ElProgresoComponent),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/escuintla',
    loadComponent: () =>
      import('./Components/escuintla/escuintla.component').then((m) => m.EscuintlaComponent),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/guatemala',
    loadComponent: () =>
      import('./Components/cdguatemala/cdguatemala.component').then((m) => m.CDGuatemala),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/huehuetenango',
    loadComponent: () =>
      import('./Components/huehuetenango/huehuetenango.component').then((m) => m.Huehuetenango),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/izabal',
    loadComponent: () => import('./Components/izabal/izabal.component').then((m) => m.Izabal),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/jalapa',
    loadComponent: () => import('./Components/jalapa/jalapa.component').then((m) => m.Jalapa),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/jutiapa',
    loadComponent: () => import('./Components/jutiapa/jutiapa.component').then((m) => m.Jutiapa),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/san-marcos',
    loadComponent: () =>
      import('./Components/san-marcos/san-marcos.component').then((m) => m.SanMarcos),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/santa-rosa',
    loadComponent: () =>
      import('./Components/santa-rosa/santa-rosa.component').then((m) => m.SantaRosa),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/solola',
    loadComponent: () => import('./Components/solola/solola.component').then((m) => m.Solola),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/suchitepequez',
    loadComponent: () =>
      import('./Components/suchitepequez/suchitepequez.component').then((m) => m.Suchitepequez),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/totonicapan',
    loadComponent: () =>
      import('./Components/totonicapan/totonicapan.component').then((m) => m.Totonicapan),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/zacapa',
    loadComponent: () => import('./Components/zacapa/zacapa.component').then((m) => m.Zacapa),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/peten',
    loadComponent: () => import('./Components/peten/peten.component').then((m) => m.Peten),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/quetzaltenango',
    loadComponent: () =>
      import('./Components/quetzaltenango/quetzaltenango.component').then((m) => m.Quetzaltenango),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/quiche',
    loadComponent: () => import('./Components/quiche/quiche.component').then((m) => m.Quiche),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/retalhuleu',
    loadComponent: () =>
      import('./Components/retalhuleu/retalhuleu.component').then((m) => m.Retalhuleu),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/sacatepequez',
    loadComponent: () =>
      import('./Components/sacatepequez/sacatepequez.component').then((m) => m.Sacatepequez),
    canActivate: [authGuard],
  },
  {
    path: 'acerca-de',
    loadComponent: () =>
      import('./Components/acerca-de/acerca-de.component').then((m) => m.AcercaDeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'ubicaciones',
    loadComponent: () =>
      import('./Components/ubicaciones/ubicaciones.component').then((m) => m.UbicacionesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'ayuda',
    loadComponent: () => import('./Components/ayuda/ayuda.component').then((m) => m.AyudaComponent),
    canActivate: [authGuard],
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./Components/categories/categories.component').then((m) => m.CategoriesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'evidencias',
    loadComponent: () =>
      import('./Components/evidences/evidences.component').then((m) => m.EvidencesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'departamentos/:slug',
    redirectTo: '/departamentos',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
