import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'departamentos/san-marcos',
    loadComponent: () =>
      import('./Components/san-marcos/san-marcos')
        .then(m => m.SanMarcos)
  },
  {
    path: 'departamentos/santa-rosa',
    loadComponent: () =>
      import('./Components/santa-rosa/santa-rosa')
        .then(m => m.SantaRosa)
  },
  {
    path: 'departamentos/solola',
    loadComponent: () =>
      import('./Components/solola/solola')
        .then(m => m.Solola)
  },
  {
    path: 'departamentos/suchitepequez',
    loadComponent: () =>
      import('./Components/suchitepequez/suchitepequez')
        .then(m => m.Suchitepequez)
  },
  {
    path: 'departamentos/totonicapan',
    loadComponent: () =>
      import('./Components/totonicapan/totonicapan')
        .then(m => m.Totonicapan)
  },
  {
    path: 'departamentos/zacapa',
    loadComponent: () =>
      import('./Components/zacapa/zacapa')
        .then(m => m.Zacapa)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];