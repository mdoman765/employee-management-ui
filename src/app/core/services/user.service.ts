import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/login.model';
import { CreateUser, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.url}/${id}`);
  }

  create(u: CreateUser): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.url, u);
  }

  update(id: number, u: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.url}/${id}`, u);
  }

  delete(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.url}/${id}`);
  }
}
