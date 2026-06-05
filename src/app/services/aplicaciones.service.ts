import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AplicacionesService {
  constructor(private apiService:ApiService) {}
    
  //#region OBTENER
  ObtenerApps(): Observable<any> {
    return this.apiService.get('apps/obtener')
  }
  ObtenerApp(id:number): Observable<any> {
    return this.apiService.get(`apps/obtener/${id}`)
  }
  ObtenerFlota(idApp:number): Observable<any> {
    return this.apiService.get(`appscliente/flota/${idApp}`)
  }
  //#endregion

  //#region ROLLBACK
  OrdenarRollback(terminal:string, idApp:number, versionOrigen:string): Observable<any> {
    return this.apiService.post('appscliente/rollback', { terminal, idApp, versionOrigen })
  }
  CancelarRollback(terminal:string, idApp:number): Observable<any> {
    return this.apiService.delete(`appscliente/rollback/${terminal}/${idApp}`)
  }

  OrdenarRollbackFront(terminal:string, idApp:number, versionDestino:string, zipUrl:string): Observable<any> {
    return this.apiService.post('appscliente/rollback-front', { terminal, idApp, versionDestino, zipUrl })
  }
  CancelarRollbackFront(terminal:string, idApp:number): Observable<any> {
    return this.apiService.delete(`appscliente/rollback-front/${terminal}/${idApp}`)
  }
  //#endregion
}
