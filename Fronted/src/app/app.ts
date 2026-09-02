import { Component, signal } from '@angular/core';
import { ReguisterComponent } from './Components/Reguister';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReguisterComponent], // <-- Agrégalo aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Fronted');
}
