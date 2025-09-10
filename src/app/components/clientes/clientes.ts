import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Cliente } from '../../models/Cliente';
import { MatIconModule } from '@angular/material/icon';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    MatIconModule,
    Button
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes {
  clientes: Cliente[] = [];

  ngOnInit() {
    this.clientes.push(new Cliente({id:1,DNI:43797231,nombre:'Nahuel Aquino',descripcion:"Despensa alma"}))
  }
}
