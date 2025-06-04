import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdditionalService } from '../models/service';
import { AuthService } from './auth.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdditionalServiceService {
  private apiUrl = environment.apiUrl + '/additionalService';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = AuthService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  getServices(): Observable<AdditionalService[]> {
    return this.http.get<AdditionalService[]>(this.apiUrl + "/all", { headers: this.getAuthHeaders() });
  }

  getService(id: number): Observable<AdditionalService> {
    return this.http.get<AdditionalService>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createService(service: AdditionalService): Observable<AdditionalService> {
    return this.http.post<AdditionalService>(this.apiUrl, service, { headers: this.getAuthHeaders() });
  }

  updateService(id: number, service: AdditionalService): Observable<AdditionalService> {
    return this.http.patch<AdditionalService>(`${this.apiUrl}/${id}`, service, { headers: this.getAuthHeaders() });
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
