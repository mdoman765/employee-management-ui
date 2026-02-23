import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/login.model';
import { CreateSalary, Salary } from '../models/salary.model';

@Injectable({ providedIn: 'root' })
export class SalaryService {
  private url = `${environment.apiUrl}/salaries`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Salary[]>> {
    return this.http.get<ApiResponse<Salary[]>>(this.url);
  }

  getByEmployee(empId: number): Observable<ApiResponse<Salary[]>> {
    return this.http.get<ApiResponse<Salary[]>>(`${this.url}/employee/${empId}`);
  }

  create(s: CreateSalary): Observable<ApiResponse<Salary>> {
    return this.http.post<ApiResponse<Salary>>(this.url, s);
  }

  update(id: number, s: CreateSalary): Observable<ApiResponse<Salary>> {
    return this.http.put<ApiResponse<Salary>>(`${this.url}/${id}`, s);
  }
}
