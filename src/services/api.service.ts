import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '../env/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl:string = environment.apiUrl;
  private http:HttpClient = inject(HttpClient);

  get<T>(endpoint: string): Observable<T | null> {
    return this.http.get<T>(this.apiUrl + endpoint);
  }

  post<T>(endpoint: string, body: any): Observable<T | null> {
    return this.http.post<T>(this.apiUrl + endpoint, body);
  }

  put<T>(endpoint: string, body: any): Observable<T | null> {
    return this.http.put<T>(this.apiUrl + endpoint, body);
  }

  delete<T>(endpoint: string): Observable<T | null> {
    return this.http.delete<T>(this.apiUrl + endpoint);
  }
}
