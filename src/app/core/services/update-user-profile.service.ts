import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/login.model';
import { User } from '../models/user.model';

export interface UpdateProfileDto {
  username: string;
  email: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateUserProfileService {
  private profileUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  updateProfile(dto: UpdateProfileDto): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(this.profileUrl, dto);
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(this.profileUrl);
  }
}