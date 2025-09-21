import { Component } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AplicacionesService } from '../../../services/aplicaciones.service';
import { CommonModule } from '@angular/common';
import { App } from '../../../models/App';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aplicaciones',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './main-aplicaciones.html',
  styleUrl: './main-aplicaciones.scss'
})
export class Aplicaciones {
  apps:App[] = [];

  constructor(
    private router:Router,
    private aplicacionesService:AplicacionesService
  ){}

  ngOnInit(){
    this.ObtenerApps();
  }

  ObtenerApps(){
    this.aplicacionesService.ObtenerApps().subscribe(response => {
      this.apps = response;
    });
  }

  Navegar(idApp:number){
    this.router.navigateByUrl(`apps/detalles/${idApp}`);
  }
}
