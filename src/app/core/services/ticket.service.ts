import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/login.model';
import { AssignTicket, CreateTicket, Ticket, UpdateTicketStatus } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private url = `${environment.apiUrl}/tickets`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<ApiResponse<Ticket[]>>         { return this.http.get<ApiResponse<Ticket[]>>(this.url); }
  getMine(): Observable<ApiResponse<Ticket[]>>        { return this.http.get<ApiResponse<Ticket[]>>(`${this.url}/my`); }
  getAssigned(): Observable<ApiResponse<Ticket[]>>    { return this.http.get<ApiResponse<Ticket[]>>(`${this.url}/assigned`); }
  getById(id: number): Observable<ApiResponse<Ticket>> { return this.http.get<ApiResponse<Ticket>>(`${this.url}/${id}`); }
  create(t: CreateTicket): Observable<ApiResponse<Ticket>> { return this.http.post<ApiResponse<Ticket>>(this.url, t); }
  updateStatus(id: number, s: UpdateTicketStatus): Observable<ApiResponse<Ticket>> { return this.http.put<ApiResponse<Ticket>>(`${this.url}/${id}/status`, s); }
  assign(id: number, a: AssignTicket): Observable<ApiResponse<Ticket>> { return this.http.put<ApiResponse<Ticket>>(`${this.url}/${id}/assign`, a); }
  delete(id: number): Observable<ApiResponse<string>> { return this.http.delete<ApiResponse<string>>(`${this.url}/${id}`); }
}
