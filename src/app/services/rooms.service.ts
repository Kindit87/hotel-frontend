import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = 'http://server.hotel.kindit.org/api/room';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = AuthService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getAvailableRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl + "/available", { headers: this.getAuthHeaders() });
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(this.apiUrl, room, { headers: this.getAuthHeaders() });
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.patch<Room>(`${this.apiUrl}/${id}`, room, { headers: this.getAuthHeaders() });
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
