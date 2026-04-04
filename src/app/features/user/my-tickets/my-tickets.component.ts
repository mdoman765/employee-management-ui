import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-my-tickets', standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss']
})
export class MyTicketsComponent implements OnInit {
  tickets: Ticket[] = []; loading = true; errorMsg = '';
  filterStatus = ''; expandedId: number | null = null;
  statuses = ['Open', 'InProgress', 'Closed'];

  constructor(private svc: TicketService) {}

  ngOnInit(): void {
    this.svc.getMine()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: r => { this.tickets = r.data ?? []; },
        error: () => { this.errorMsg = 'Failed to load tickets.'; }
      });
  }

  get filtered(): Ticket[] {
    return this.filterStatus ? this.tickets.filter(t => t.status === this.filterStatus) : this.tickets;
  }

  countByStatus(status: string): number {
    return this.tickets.filter(t => t.status === status).length;
  }

  toggle(id: number): void { this.expandedId = this.expandedId === id ? null : id; }
  priorityClass(p: string): string { return { High:'high', Medium:'medium', Low:'low' }[p] ?? ''; }
  statusClass(s: string): string   { return { Open:'open', InProgress:'inprogress', Closed:'closed' }[s] ?? ''; }
}
