import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filtered: Employee[] = [];
  loading = true;
  search = '';
  deleteId: number | null = null;
  deleting = false;
  successMsg = '';
  errorMsg = '';

  constructor(private svc: EmployeeService) {}

  ngOnInit(): void { this.load(); }

  // load(): void {
  //   this.loading = true;
  //   this.svc.getAll().subscribe({
  //     next: r => { this.employees = r.data ?? []; this.applyFilter(); this.loading = false; },
  //     error: () => { this.errorMsg = 'Failed to load employees.'; this.loading = false; }
  //   });
  // }

  load(): void {
  this.loading = true;
  console.log('Loading started...');           // ← add this
  
  this.svc.getAll().subscribe({
    next: r => {
      console.log('Response received:', r);    // ← add this
      this.employees = r.data ?? [];
      this.applyFilter();
      this.loading = false;
      console.log('Loading stopped.');         // ← add this
    },
    error: (err) => {
      console.error('Error:', err);            // ← add this
      this.errorMsg = 'Failed to load employees.';
      this.loading = false;
    }
  });
}

  applyFilter(): void {
    const s = this.search.toLowerCase();
    this.filtered = s
      ? this.employees.filter(e => e.name.toLowerCase().includes(s) || e.email.toLowerCase().includes(s) || e.departmentName?.toLowerCase().includes(s))
      : [...this.employees];
  }

  confirmDelete(id: number): void { this.deleteId = id; }

  doDelete(): void {
    if (!this.deleteId) return;
    this.deleting = true;
    this.svc.delete(this.deleteId).subscribe({
      next: () => {
        this.successMsg = 'Employee deleted successfully.';
        this.deleteId = null;
        this.deleting = false;
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.errorMsg = 'Failed to delete.'; this.deleting = false; }
    });
  }

  cancelDelete(): void { this.deleteId = null; }
}
