import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { RegisterComponent } from './components/register/register';

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
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/guatemala',
    loadComponent: () => import('./components/cdguatemala/cdguatemala').then(m => m.CDGuatemala),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/huehuetenango',
    loadComponent: () => import('./components/huehuetenango/huehuetenango').then(m => m.Huehuetenango),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/izabal',
    loadComponent: () => import('./components/izabal/izabal').then(m => m.Izabal),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/jalapa',
    loadComponent: () => import('./components/jalapa/jalapa').then(m => m.Jalapa),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos/jutiapa',
    loadComponent: () => import('./components/jutiapa/jutiapa').then(m => m.Jutiapa),
    canActivate: [authGuard]
  },
  { path: 'departamentos/:slug', redirectTo: 'home' },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];