import { Component, signal } from '@angular/core';
import { ReguisterComponent } from './Components/register/Reguister';
import { HomeComponent } from './Components/home/Home';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, ReguisterComponent], // <-- Agrégalo aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Fronted');
}
