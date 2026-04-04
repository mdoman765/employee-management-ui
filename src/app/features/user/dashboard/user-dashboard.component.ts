import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
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
  user: any;
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
    this.user = this.auth.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Use /attendance/my — backend resolves employee by email
    this.attSvc.getMine()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: r => {
          const data = r.data ?? [];
          this.attendanceCount  = data.length;
          this.recentAttendance = data.slice(0, 5);
        },
        error: () => {}
      });

    // Use /salaries/my — backend resolves employee by email
    this.salSvc.getMine().subscribe({
      next: r => {
        const salaries = r.data ?? [];
        this.currentSalary = salaries.find(s => s.isCurrent) ?? salaries[0] ?? null;
      },
      error: () => {}
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
