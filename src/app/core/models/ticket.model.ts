export type TicketStatus   = 'Open' | 'InProgress' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High';

export interface Ticket {
  id: number; title: string; description: string;
  category?: string; priority: TicketPriority; status: TicketStatus;
  createdBy: number; createdByName: string;
  assignedTo?: number; assignedToName?: string;
  createdAt: string; updatedAt?: string;
}
export interface CreateTicket { title: string; description: string; }
export interface UpdateTicketStatus { status: TicketStatus; }
export interface AssignTicket { agentId: number; }
