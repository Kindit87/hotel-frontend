import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { AuthService } from './auth.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = environment.apiUrl + '/room';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = AuthService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl + "/all", { headers: this.getAuthHeaders() });
  }

  getAvailableRooms(checkIn: string, checkOut: string): Observable<Room[]> {
    const params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut);

    return this.http.get<Room[]>(`${this.apiUrl}/all/available`, { params });
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  createRoom(room: FormData): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room, { headers: this.getAuthHeaders() });
  }

  updateRoom(id: number, room: FormData): Observable<Room> {
    return this.http.patch<Room>(`${this.apiUrl}/${id}`, room, { headers: this.getAuthHeaders() });
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
