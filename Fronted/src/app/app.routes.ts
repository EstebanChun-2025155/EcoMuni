import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
 {path:'',pathMatch:'full',redirectTo:'home'},
 {path:'login',loadComponent:()=>import('./Components/login/login').then(m=>m.LoginComponent)},
 {path:'register',loadComponent:()=>import('./Components/register/Reguister').then(m=>m.ReguisterComponent)},
 {path:'home',canActivate:[authGuard],loadComponent:()=>import('./Components/home/Home').then(m=>m.HomeComponent)},
 {path:'reports',canActivate:[authGuard],loadComponent:()=>import('./Components/reports/reports').then(m=>m.ReportsComponent)},
 {path:'categories',canActivate:[authGuard],loadComponent:()=>import('./Components/categories/categories').then(m=>m.CategoriesComponent)},
 {path:'evidences',canActivate:[authGuard],loadComponent:()=>import('./Components/evidences/evidences').then(m=>m.EvidencesComponent)},
 {path:'locations',canActivate:[authGuard],loadComponent:()=>import('./Components/Locations/Locations').then(m=>m.LocationsComponent)},
 {path:'departamentos/peten',canActivate:[authGuard],loadComponent:()=>import('./Components/Peten/Peten').then(m=>m.Peten)},
 {path:'departamentos/quetzaltenango',canActivate:[authGuard],loadComponent:()=>import('./Components/Quetzaltenango/quetzaltenango').then(m=>m.Quetzaltenango)},
 {path:'departamentos/quiche',canActivate:[authGuard],loadComponent:()=>import('./Components/quiche/quiche').then(m=>m.Quiche)},
 {path:'departamentos/retalhuleu',canActivate:[authGuard],loadComponent:()=>import('./Components/Retalhuleu/retalhuleu').then(m=>m.Retalhuleu)},
 {path:'departamentos/sacatepequez',canActivate:[authGuard],loadComponent:()=>import('./Components/sacatepequez/sacatepequez').then(m=>m.Sacatepequez)},
 {path:'**',redirectTo:'home'}
];
