import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingRequest, BookingResponse } from '../models/booking';
import { AuthService } from './auth.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl + '/booking';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = AuthService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  createBooking(request: BookingRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/me`, request, { headers: this.getAuthHeaders() });
  }

  getBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }

  getMyBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/me/all`, { headers: this.getAuthHeaders() });
  }

  payBooking(bookingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/me/${bookingId}/pay`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${bookingId}/cancel`, {}, { headers: this.getAuthHeaders() });
  }

  cancelMyBooking(bookingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/me/${bookingId}/cancel`, {}, { headers: this.getAuthHeaders() });
  }
}
