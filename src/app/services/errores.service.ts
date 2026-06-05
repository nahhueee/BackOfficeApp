import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { ErrorAgregado, ErrorDetalle } from '../models/ErrorAgregado';

@Injectable({ providedIn: 'root' })
export class ErroresService {
  constructor(private apiService: ApiService) {}

  ObtenerErroresAgregados(idApp: number): Observable<ErrorAgregado[]> {
    return (this.apiService.get(`errores/agregado/${idApp}`) as Observable<any[]>).pipe(
      map(rows => rows.map(r => new ErrorAgregado(r)))
    );
  }

  ObtenerDetalleError(idApp: number, codigo: string): Observable<ErrorDetalle[]> {
    return (this.apiService.get(`errores/codigo/${idApp}/${codigo}`) as Observable<any[]>).pipe(
      map(rows => rows.map(r => new ErrorDetalle(r)))
    );
  }
}
