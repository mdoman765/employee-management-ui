import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/login.model';
import { Attendance, CreateAttendance } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private url = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Attendance[]>> {
    return this.http.get<ApiResponse<Attendance[]>>(this.url);
  }

  getByEmployee(empId: number): Observable<ApiResponse<Attendance[]>> {
    return this.http.get<ApiResponse<Attendance[]>>(`${this.url}/employee/${empId}`);
  }

  create(a: CreateAttendance): Observable<ApiResponse<Attendance>> {
    return this.http.post<ApiResponse<Attendance>>(this.url, a);
  }

  update(id: number, a: CreateAttendance): Observable<ApiResponse<Attendance>> {
    return this.http.put<ApiResponse<Attendance>>(`${this.url}/${id}`, a);
  }

  delete(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.url}/${id}`);
  }
}
