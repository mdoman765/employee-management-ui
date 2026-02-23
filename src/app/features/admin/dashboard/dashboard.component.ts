import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { AttendanceService } from '../../../core/services/attendance.service';
import { SalaryService } from '../../../core/services/salary.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = { employees: 0, departments: 0, attendance: 0, salaries: 0 };
  recentEmployees: any[] = [];
  loading = true;
  username = '';

  constructor(
    private empSvc: EmployeeService,
    private deptSvc: DepartmentService,
    private attSvc: AttendanceService,
    private salSvc: SalaryService,
    private auth: AuthService
  ) {
    this.username = auth.getCurrentUser()?.username ?? '';
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.empSvc.getAll().subscribe({
      next: r => {
        this.stats.employees = r.data?.length ?? 0;
        this.recentEmployees = (r.data ?? []).slice(0, 5);
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.deptSvc.getAll().subscribe({
      next: r => this.stats.departments = r.data?.length ?? 0
    });

    this.attSvc.getAll().subscribe({
      next: r => this.stats.attendance = r.data?.length ?? 0
    });

    this.salSvc.getAll().subscribe({
      next: r => this.stats.salaries = r.data?.length ?? 0
    });
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
}
