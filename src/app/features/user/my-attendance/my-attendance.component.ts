import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../core/services/attendance.service';
import { AuthService } from '../../../core/services/auth.service';
import { Attendance } from '../../../core/models/attendance.model';

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-attendance.component.html',
  styleUrls: ['./my-attendance.component.scss']
})
export class MyAttendanceComponent implements OnInit {
  records: Attendance[] = [];
  loading = true;
  errorMsg = '';
  filterStatus = '';
  filterMonth = '';

  statusOptions = ['Present', 'Absent', 'Late', 'Leave'];

  constructor(private svc: AttendanceService, private auth: AuthService) {}

  ngOnInit(): void {
    const uid = this.auth.getUserId();
    this.svc.getByEmployee(uid).subscribe({
      next: r => { this.records = r.data ?? []; this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load attendance.'; this.loading = false; }
    });
  }

  get filtered(): Attendance[] {
    return this.records.filter(r => {
      const statusOk = this.filterStatus ? r.status === this.filterStatus : true;
      const monthOk  = this.filterMonth  ? r.checkInTime.startsWith(this.filterMonth) : true;
      return statusOk && monthOk;
    });
  }

  getSummary() {
    const total = this.filtered.length;
    return {
      total,
      present: this.filtered.filter(r => r.status === 'Present').length,
      absent:  this.filtered.filter(r => r.status === 'Absent').length,
      late:    this.filtered.filter(r => r.status === 'Late').length,
      leave:   this.filtered.filter(r => r.status === 'Leave').length,
    };
  }

  getStatusClass(s?: string): string {
    const map: any = { Present: 'present', Absent: 'absent', Late: 'late', Leave: 'leave' };
    return map[s ?? ''] ?? '';
  }

  calculateDuration(inTime: string, outTime: string): string {
    const diff = new Date(outTime).getTime() - new Date(inTime).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }
}
