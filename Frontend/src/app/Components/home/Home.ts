import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './Home.html',
  styleUrls: ['./Home.css']
})
export class HomeComponent {
  heroTitle: string = 'Ayudando a mantener <br> el medio ambiente';

  onScrollDown(): void {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }
}
