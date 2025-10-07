import { Component, inject, OnInit } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Cliente } from '../../../models/Cliente';
import { MatIconModule } from '@angular/material/icon';
import { Button } from 'primeng/button';
import { ClientesService } from '../../../services/clientes.service';
import { FiltroGral } from '../../../models/Filtros';
import { DatePipe } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { AddmodClientes } from "../addmod-clientes/addmod-clientes";
import { TooltipModule } from "primeng/tooltip";
import { Router } from '@angular/router';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    MatIconModule,
    Button,
    DatePipe,
    Dialog,
    AddmodClientes,
    TooltipModule,
    PopoverModule
],
  templateUrl: './main-clientes.html',
  styleUrl: './main-clientes.scss'
})
export class Clientes {
  clientes: Cliente[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  filtroActual!: FiltroGral;
  
  clienteSeleccionado!: Cliente | undefined;
  mostrarmodalAddMod: boolean = false;

  constructor(
    private router:Router,
    private clientesService:ClientesService
  ){}

  Buscar(event?: TableLazyLoadEvent, busqueda?: string, recargaConFiltro: boolean = false) {
    this.loading = true;

    const pageIndex = (event?.first ?? 0) / (event?.rows ?? 10); // página actual
    const pageSize = event?.rows ?? 10;

    if (!recargaConFiltro) {
      this.filtroActual = new FiltroGral({
        pagina: pageIndex + 1,   // tu backend usa base 1
        tamanioPagina: pageSize,
        busqueda: busqueda
      });
    }

    this.clientesService.ObtenerClientes(this.filtroActual).subscribe(response => {
      this.clientes = response.registros;
      this.totalRecords = response.total;
      this.loading = false;
    });
  }

  Actualizar(valor:boolean){
    if(valor)
      this.Buscar(undefined, undefined, true);

    this.mostrarmodalAddMod = false;
  }

  Agregar(){
    this.clienteSeleccionado = undefined;
    this.mostrarmodalAddMod = true;
  }

  Editar(DNI:string){
    this.clienteSeleccionado = this.clientes.find(c => c.DNI == DNI);
    this.mostrarmodalAddMod = true;
  }

  VerAppsCliente(DNI:string){
    this.clienteSeleccionado = this.clientes.find(c => c.DNI == DNI);
  }

  Navegar(DNI:string){
    this.router.navigateByUrl(`clientes/detalles/${DNI}`);
  }
}
