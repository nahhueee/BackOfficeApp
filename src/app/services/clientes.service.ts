import { Injectable } from '@angular/core';
import { FiltroGral } from '../models/Filtros';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cliente } from '../models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(private apiService:ApiService) {}
  
  //#region OBTENER
  ObtenerClientes(filtro:FiltroGral): Observable<any> {
    return this.apiService.post('clientes/obtener', filtro)
  }
  ObtenerCliente(dni:string): Observable<any> {
    return this.apiService.get(`clientes/obtener/${dni}`)
  }
  //#endregion

  //#region ABM
  ActualizarEstadoTerminal(DNI:string, idApp:number, habilitado:boolean): Observable<any>{
    return this.apiService.put('appscliente/actualizar-estado', {DNI, idApp, habilitado})
  }
  EliminarTerminal(terminal:string): Observable<any>{
    return this.apiService.delete('appscliente/eliminar/' + terminal)
  }

  Agregar(cli:Cliente): Observable<any>{
    return this.apiService.post('clientes/agregar', cli)
  }

  Modificar(cli:Cliente): Observable<any>{
    return this.apiService.put('clientes/modificar', cli)
  }

  Eliminar(id:number): Observable<any>{
    return this.apiService.delete(`clientes/eliminar/${id}`)
  }
  //#endregion
}
