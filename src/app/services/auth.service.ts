import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://server.hotel.kindit.org/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.userSubject.next(JSON.parse(userData));
      } catch (error) {
        console.log('userData');
        console.error('Ошибка при разборе данных пользователя:', error);
        localStorage.removeItem('user');
        this.fetchUser();
      }
    } else {
      this.fetchUser();
    }
  }

  fetchUser() {
    const token = AuthService.getToken();
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<User>(`${this.apiUrl}/me`, { headers }).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      },
      error: (err) => {
        console.error('Ошибка получения данных пользователя:', err);
        this.logout();
      }
    });
  }

  login(credentials: { email: string; password: string }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.handleAuth(response);
        this.fetchUser();
      })
    );
  }

  private handleAuth(response: { token: string; user: User }) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    console.log(localStorage.getItem('user'))
    this.userSubject.next(response.user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!AuthService.getToken();
  }
}
