import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConsultaPagina } from '../Departamentos-shared/consulta-pagina';
import type { CategoriaConsulta } from '../../models/consulta';
@Component({selector:'app-categories',standalone:true,imports:[RouterLink,RouterLinkActive],templateUrl:'./categories.html',styleUrls:['./categories.css','../Departamentos-shared/consulta-pagina.css']})
export class CategoriesComponent extends ConsultaPagina<CategoriaConsulta> {constructor(){super('categorias');}}
