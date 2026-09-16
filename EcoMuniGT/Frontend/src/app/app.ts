import { Component } from '@angular/core';
import { SeguimientoComponent } from './Components/seguimiento/seguimiento';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SeguimientoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}