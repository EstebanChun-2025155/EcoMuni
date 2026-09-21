import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConsultaPagina } from '../Departamentos-shared/consulta-pagina';
import type { UbicacionConsulta } from '../../models/consulta';
@Component({selector:'app-locations',standalone:true,imports:[RouterLink,RouterLinkActive],templateUrl:'./Locations.html',styleUrls:['./Locations.css','../Departamentos-shared/consulta-pagina.css']})
export class LocationsComponent extends ConsultaPagina<UbicacionConsulta> {constructor(){super('ubicaciones');}}
