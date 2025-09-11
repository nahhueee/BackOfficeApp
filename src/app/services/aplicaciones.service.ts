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
    return this.apiService.get(`apps/obtener-app/${id}`)
  }
  //#endregion
}
