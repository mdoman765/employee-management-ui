import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket, TicketStatus } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-assigned-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assigned-tickets.component.html',
  styleUrls: ['./assigned-tickets.component.scss']
})
export class AssignedTicketsComponent implements OnInit {
  tickets: Ticket[] = []; loading = true;
  successMsg = ''; errorMsg = '';
  filterStatus = '';
  expandedId: number | null = null;
  statuses: TicketStatus[] = ['Open', 'InProgress', 'Closed'];

  constructor(private svc: TicketService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAssigned()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: r => { this.tickets = r.data ?? []; },
        error: () => { this.errorMsg = 'Failed to load tickets.'; }
      });
  }

  get filtered(): Ticket[] {
    return this.filterStatus ? this.tickets.filter(t => t.status === this.filterStatus) : this.tickets;
  }

  changeStatus(id: number, status: TicketStatus): void {
    this.svc.updateStatus(id, { status }).subscribe({
      next: r => {
        const idx = this.tickets.findIndex(t => t.id === id);
        if (idx > -1) this.tickets[idx] = r.data;
        this.successMsg = 'Status updated!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.errorMsg = 'Failed to update.'; }
    });
  }

  toggle(id: number): void { this.expandedId = this.expandedId === id ? null : id; }
  priorityClass(p: string): string { return { High:'high', Medium:'medium', Low:'low' }[p] ?? ''; }
  statusClass(s: string): string   { return { Open:'open', InProgress:'inprogress', Closed:'closed' }[s] ?? ''; }

  get stats() {
    return {
      open:       this.tickets.filter(t => t.status === 'Open').length,
      inProgress: this.tickets.filter(t => t.status === 'InProgress').length,
      closed:     this.tickets.filter(t => t.status === 'Closed').length,
      total:      this.tickets.length
    };
  }
}
