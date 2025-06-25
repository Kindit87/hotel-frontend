import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingRequest, BookingResponse } from '../models/booking';
import { AuthService } from './auth.service';
import {environment} from '../../environments/environment';
import {PaginatedResponse} from '../models/paginated-response';

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

  getBookings(page: number = 0, size: number = 10, status?: string): Observable<PaginatedResponse<BookingResponse>> {
    let url = `${this.apiUrl}/all?page=${page}&size=${size}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<PaginatedResponse<BookingResponse>>(url, { headers: this.getAuthHeaders() });
  }

  getMyBookings(page: number = 0, size: number = 10): Observable<PaginatedResponse<BookingResponse>> {
    return this.http.get<PaginatedResponse<BookingResponse>>(
      `${this.apiUrl}/me/all?page=${page}&size=${size}`,
      { headers: this.getAuthHeaders() }
    );
  }


  updateBookingStatus(id: number, status: string): Observable<BookingResponse> {
    return this.http.patch<BookingResponse>(
      `${this.apiUrl}/${id}`,
      { status },
      { headers: this.getAuthHeaders() }
    );
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
