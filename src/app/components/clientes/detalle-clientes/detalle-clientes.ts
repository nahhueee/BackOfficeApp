import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { ClientesService } from '../../../services/clientes.service';
import { Cliente } from '../../../models/Cliente';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-detalle-clientes',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Tooltip
  ],
  templateUrl: './detalle-clientes.html',
  styleUrl: './detalle-clientes.scss'
})
export class DetalleClientes {
  cliente:Cliente = new Cliente();

  constructor(
    private rutaActiva: ActivatedRoute,
    private Notificaciones: NotificacionesService,
    private clientesService: ClientesService
  ){}

  ngAfterViewInit(){
    setTimeout(() => {
      //Obtenemos el id de la caja desde la url
      let idCliente = this.rutaActiva.snapshot.params['idCliente'];
      if(idCliente != 0){
        this.ObtenerCliente(idCliente);
      }
    });
  }

  ObtenerCliente(idCliente:number){
    this.clientesService.ObtenerCliente(idCliente)
    .subscribe(response => {
      this.cliente = response;
    });
  }

  EditarDatos(){

  }
}
