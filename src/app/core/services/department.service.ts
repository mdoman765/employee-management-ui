import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/login.model';
import { CreateDepartment, Department } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private url = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.url}/${id}`);
  }

  create(d: CreateDepartment): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(this.url, d);
  }

  update(id: number, d: CreateDepartment): Observable<ApiResponse<Department>> {
    return this.http.put<ApiResponse<Department>>(`${this.url}/${id}`, d);
  }

  delete(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.url}/${id}`);
  }
}
