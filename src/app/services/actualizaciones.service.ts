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

  ObtenerVersionesBackend(idApp: number): Observable<any> {
    return this.apiService.get(`actualizaciones/versiones-backend/${idApp}`)
  }

  ObtenerCompatibilidades(idApp: number, versionFrontend: string): Observable<string[] | any> {
    return this.apiService.get(`actualizaciones/compatibilidades/${idApp}/${versionFrontend}`)
  }
  //#endregion

  //#region ABM
  Agregar(act:Actualizacion): Observable<any>{
    return this.apiService.post('actualizaciones/agregar', act)
  }

  Modificar(act:Actualizacion): Observable<any>{
    return this.apiService.put('actualizaciones/modificar', act)
  }
  
  Eliminar(id:number): Observable<any>{
    return this.apiService.delete(`actualizaciones/eliminar/${id}`)
  }
  //#endregion
}
