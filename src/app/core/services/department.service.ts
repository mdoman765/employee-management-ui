import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/login.model';
import { CreateDepartment, Department } from '../models/department.model';
 
@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/departments`;
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(this.apiUrl);
  }
  create(dept: CreateDepartment): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(this.apiUrl, dept);
  }
  update(id: number, dept: CreateDepartment): Observable<ApiResponse<Department>> {
    return this.http.put<ApiResponse<Department>>(`${this.apiUrl}/${id}`, dept);
  }
  delete(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${id}`);
  }
}
