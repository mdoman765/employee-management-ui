import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../../core/services/ticket.service';
import { UserService } from '../../../core/services/user.service';
import { Ticket, TicketStatus } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-tickets', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = []; agents: User[] = [];
  loading = true; successMsg = ''; errorMsg = '';
  filterStatus = ''; filterPriority = '';
  assignModalTicketId: number | null = null;
  selectedAgentId = '';
  assigning = false;

  statuses: TicketStatus[] = ['Open', 'InProgress', 'Closed'];
  priorities = ['Low', 'Medium', 'High'];

  constructor(private ticketSvc: TicketService, private userSvc: UserService) {}

  ngOnInit(): void {
    this.load();
    this.userSvc.getAgents().subscribe({ next: r => this.agents = r.data ?? [], error: () => {} });
  }

  load(): void {
    this.loading = true;
    this.ticketSvc.getAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: r => { this.tickets = r.data ?? []; },
        error: () => { this.errorMsg = 'Failed to load tickets.'; }
      });
  }

  get filtered(): Ticket[] {
    return this.tickets.filter(t =>
      (this.filterStatus   ? t.status   === this.filterStatus   : true) &&
      (this.filterPriority ? t.priority === this.filterPriority : true)
    );
  }

  countByStatus(status: string): number {
    return this.tickets.filter(t => t.status === status).length;
  }

  openAssign(id: number): void { this.assignModalTicketId = id; this.selectedAgentId = ''; }
  cancelAssign(): void         { this.assignModalTicketId = null; }

  doAssign(): void {
    if (!this.assignModalTicketId || !this.selectedAgentId) return;
    this.assigning = true;
    this.ticketSvc.assign(this.assignModalTicketId, { agentId: +this.selectedAgentId })
      .pipe(finalize(() => this.assigning = false))
      .subscribe({
        next: () => {
          this.successMsg = 'Ticket assigned successfully!';
          this.assignModalTicketId = null;
          this.load();
          setTimeout(() => this.successMsg = '', 3000);
        },
        error: () => { this.errorMsg = 'Failed to assign.'; }
      });
  }

  changeStatus(id: number, status: TicketStatus): void {
    this.ticketSvc.updateStatus(id, { status }).subscribe({
      next: () => {
        const idx = this.tickets.findIndex(t => t.id === id);
        if (idx > -1) this.tickets[idx] = { ...this.tickets[idx], status };
        this.successMsg = 'Status updated!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.errorMsg = 'Failed to update status.'; }
    });
  }

  deleteTicket(id: number): void {
    this.ticketSvc.delete(id).subscribe({
      next: () => { this.tickets = this.tickets.filter(t => t.id !== id); },
      error: () => { this.errorMsg = 'Failed to delete.'; }
    });
  }

  priorityClass(p: string): string { return { High: 'high', Medium: 'medium', Low: 'low' }[p] ?? ''; }
  statusClass(s: string): string   { return { Open: 'open', InProgress: 'inprogress', Closed: 'closed' }[s] ?? ''; }
}
