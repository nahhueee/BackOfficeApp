import { Component, inject, OnInit } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Cliente } from '../../models/Cliente';
import { MatIconModule } from '@angular/material/icon';
import { Button } from 'primeng/button';
import { ClientesService } from '../../../services/clientes.service';
import { FiltroGral } from '../../../models/FiltroGral';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    MatIconModule,
    Button,
    DatePipe
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes {
  clientes: Cliente[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  filtroActual!: FiltroGral;
  
  private clientesService:ClientesService = inject(ClientesService)
  
  Buscar(event: TableLazyLoadEvent, busqueda?: string, recargaConFiltro: boolean = false) {
    this.loading = true;

    const pageIndex = (event.first ?? 0) / (event.rows ?? 10); // página actual
    const pageSize = event.rows ?? 10;

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
}
