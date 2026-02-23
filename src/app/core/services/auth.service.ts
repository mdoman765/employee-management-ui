import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, LoginRequest, LoginResponse } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(creds: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.url}/login`, creds).pipe(
      tap(r => {
        if (r.success) {
          localStorage.setItem('token', r.data.token);
          localStorage.setItem('user', JSON.stringify(r.data));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): LoginResponse | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'Admin';
  }

  isUser(): boolean {
    return this.getCurrentUser()?.role === 'User';
  }

  getUserId(): number {
    return this.getCurrentUser()?.userId ?? 0;
  }
}
