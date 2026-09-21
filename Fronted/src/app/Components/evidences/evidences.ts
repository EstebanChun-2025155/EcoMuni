import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConsultaPagina } from '../Departamentos-shared/consulta-pagina';
import type { EvidenciaConsulta } from '../../models/consulta';
@Component({selector:'app-evidences',standalone:true,imports:[RouterLink,RouterLinkActive],templateUrl:'./evidences.html',styleUrls:['./evidences.css','../Departamentos-shared/consulta-pagina.css']})
export class EvidencesComponent extends ConsultaPagina<EvidenciaConsulta> {constructor(){super('evidencias');}}
