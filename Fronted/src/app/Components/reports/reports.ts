import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConsultaPagina } from '../Departamentos-shared/consulta-pagina';
import type { ReporteConsulta } from '../../models/consulta';
@Component({selector:'app-reports',standalone:true,imports:[RouterLink,RouterLinkActive],templateUrl:'./reports.html',styleUrls:['./reports.css','../Departamentos-shared/consulta-pagina.css']})
export class ReportsComponent extends ConsultaPagina<ReporteConsulta> {constructor(){super('reportes');}}
