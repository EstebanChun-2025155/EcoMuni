import { Component, signal } from '@angular/core';
import { ReguisterComponent } from './Components/register/Reguister';
import { HomeComponent } from './Components/home/Home';
import { LocationsComponent } from './Components/Locations/Locations';
import { Quiche } from './Components/quiche/quiche';
import { Quetzaltenango } from './Components/Quetzaltenango/quetzaltenango';
import { Peten } from './Components/Peten/Peten'; // Fixed typo: Peten (was Petent)
import { Retalhuleu } from './Components/Retalhuleu/retalhuleu';
import { Sacatepequez } from './Components/sacatepequez/sacatepequez';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LocationsComponent,
    HomeComponent,
    ReguisterComponent,
    Quiche,
    Quetzaltenango,
    Peten,
    Retalhuleu,
    Sacatepequez
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Fronted');
}