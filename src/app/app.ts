import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegacion } from './components/navegacion/navegacion';
import { Toast } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navegacion, Toast, ConfirmPopupModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('BackOfficeApp');
}
