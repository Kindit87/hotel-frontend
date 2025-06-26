import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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

  getBookings(filters: any): Observable<any> {
    let httpParams = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));  // 👈 Приводим к строке
      }
    });

    return this.http.get(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    });
  }

  getMyBookings(
    page: number,
    size: number,
    status?: string,
    checkInFrom?: string,
    checkInTo?: string
  ): Observable<PaginatedResponse<BookingResponse>> {
    let params: any = { page, size };

    if (status) params.status = status;
    if (checkInFrom) params.checkInFrom = checkInFrom;
    if (checkInTo) params.checkInTo = checkInTo;

    return this.http.get<PaginatedResponse<BookingResponse>>(`${this.apiUrl}/me/all`, {
      headers: this.getAuthHeaders(),
      params,
    });
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
