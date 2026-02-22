import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
 
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
 
  constructor(private employeeService: EmployeeService) {}
 
  ngOnInit(): void { this.loadEmployees(); }
 
  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (res) => { this.employees = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
 
  deleteEmployee(id: number): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.employeeService.delete(id).subscribe({
      next: () => this.loadEmployees()
    });
  }
}
