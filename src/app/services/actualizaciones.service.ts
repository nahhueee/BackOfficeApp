import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FiltroActualizacion } from '../models/Filtros';
import { Observable } from 'rxjs';
import { Actualizacion } from '../models/Actualizacion';

@Injectable({
  providedIn: 'root'
})
export class ActualizacionesService {
  constructor(private apiService:ApiService) {}
      
  //#region OBTENER
  ObtenerActalizaciones(filtro:FiltroActualizacion): Observable<any> {
    return this.apiService.post('actualizaciones/obtener', filtro)
  }
  //#endregion

  //#region ABM
  Agregar(act:Actualizacion): Observable<any>{
    return this.apiService.post('actualizaciones/agregar', act)
  }
  
  Eliminar(id:number): Observable<any>{
    return this.apiService.delete(`actualizaciones/eliminar/${id}`)
  }
  //#endregion
}
