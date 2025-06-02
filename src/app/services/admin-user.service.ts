import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: "root",
})
export class AdminUserService {
  private apiUrl = "http://server.hotel.kindit.org/api";

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = AuthService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  updateUser(user: User): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/user/${user.id}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}`, { headers: this.getAuthHeaders() });
  }

  changeUserRole(userId: string, newRole: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/user/${userId}/role`, { role: newRole }, { headers: this.getAuthHeaders() });
  }
}
