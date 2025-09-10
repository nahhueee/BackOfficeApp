import { Component } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-aplicaciones',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule
  ],
  templateUrl: './aplicaciones.html',
  styleUrl: './aplicaciones.scss'
})
export class Aplicaciones {

}
