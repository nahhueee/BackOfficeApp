import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FiltroPagosCli } from '../models/filtros/FiltroPagosCli';
import { Observable } from 'rxjs';
import { PagoCliente } from '../models/PagoCliente';

@Injectable({
  providedIn: 'root'
})
export class PagosClienteService {
  constructor(private apiService:ApiService) {}
    
  //#region OBTENER
  ObtenerPagos(filtro:FiltroPagosCli): Observable<any> {
    return this.apiService.post('pagoscliente/obtener', filtro)
  }
  //#endregion

  //#region ABM
  Agregar(pago:PagoCliente): Observable<any>{
    return this.apiService.post('pagoscliente/agregar', pago)
  }
  
  Eliminar(id:number): Observable<any>{
    return this.apiService.delete(`pagoscliente/eliminar/${id}`)
  }
  //#endregion
}
