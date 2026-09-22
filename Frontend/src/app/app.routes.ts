import { Routes } from '@angular/router';

import { LoginComponent } from './Components/login/login';
import { RegisterComponent } from './Components/register/register';
import { DepartamentosComponent } from './Components/departamentos/departamentos';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: DepartamentosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'departamentos',
    component: DepartamentosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'campana',
    loadComponent: () => import('./Components/campana/campana').then(m => m.Campana),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/alta-verapaz',
    loadComponent: () => import('./Components/alta-verapaz/alta-verapaz.component').then(m => m.AltaVerapazComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/baja-verapaz',
    loadComponent: () => import('./Components/baja-verapaz/baja-verapaz.component').then(m => m.BajaVerapazComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/chimaltenango',
    loadComponent: () => import('./Components/chimaltenango/chimaltenango.component').then(m => m.ChimaltenangoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/chiquimula',
    loadComponent: () => import('./Components/chiquimula/chiquimula.component').then(m => m.ChiquimulaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/el-progreso',
    loadComponent: () => import('./Components/el-progreso/el-progreso.component').then(m => m.ElProgresoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/escuintla',
    loadComponent: () => import('./Components/escuintla/escuintla.component').then(m => m.EscuintlaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/guatemala',
    loadComponent: () => import('./Components/cdguatemala/cdguatemala').then(m => m.CDGuatemala),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/huehuetenango',
    loadComponent: () => import('./Components/huehuetenango/huehuetenango').then(m => m.Huehuetenango),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/izabal',
    loadComponent: () => import('./Components/izabal/izabal').then(m => m.Izabal),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/jalapa',
    loadComponent: () => import('./Components/jalapa/jalapa').then(m => m.Jalapa),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/jutiapa',
    loadComponent: () => import('./Components/jutiapa/jutiapa').then(m => m.Jutiapa),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/:slug',
    redirectTo: '/departamentos',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
