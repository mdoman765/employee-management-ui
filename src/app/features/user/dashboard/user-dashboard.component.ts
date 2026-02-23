import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AttendanceService } from '../../../core/services/attendance.service';
import { SalaryService } from '../../../core/services/salary.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  user: any; // declared without initialization
  attendanceCount = 0;
  currentSalary: any = null;
  recentAttendance: any[] = [];
  loading = true;

  constructor(
    private auth: AuthService,
    private attSvc: AttendanceService,
    private salSvc: SalaryService
  ) {}

  ngOnInit(): void {
    // Initialize user safely after constructor
    this.user = this.auth.getCurrentUser();

    const uid = this.auth.getUserId();

    this.attSvc.getByEmployee(uid).subscribe({
      next: r => {
        const data = r.data ?? [];
        this.attendanceCount = data.length;
        this.recentAttendance = data.slice(0, 5);
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.salSvc.getByEmployee(uid).subscribe({
      next: r => {
        const salaries = r.data ?? [];
        this.currentSalary = salaries.find(s => s.isCurrent) ?? salaries[0] ?? null;
      }
    });
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  getStatusClass(s?: string): string {
    const map: any = { Present: 'present', Absent: 'absent', Late: 'late', Leave: 'leave' };
    return map[s ?? ''] ?? '';
  }
}