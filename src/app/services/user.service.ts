import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import {AuthService, User} from "./auth.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.apiUrl + '/user';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = AuthService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, user: FormData): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, user, { headers: this.getAuthHeaders() });
  }

  updateMe(user: FormData): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/me`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }
}
