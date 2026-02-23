import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/login.model';
import { CreateEmployee, Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private url = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.url}/${id}`);
  }

  create(e: CreateEmployee): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.url, e);
  }

  update(id: number, e: CreateEmployee): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.url}/${id}`, e);
  }

  delete(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.url}/${id}`);
  }
}
