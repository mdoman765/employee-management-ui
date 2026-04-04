import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AttendanceService } from '../../../core/services/attendance.service';
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

  constructor(private svc: AttendanceService) {}

  ngOnInit(): void {
    // Use /attendance/my — backend resolves employee by logged-in user's email
    this.svc.getMine()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: r => { this.records = r.data ?? []; },
        error: () => { this.errorMsg = 'Failed to load attendance.'; }
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
    return {
      total:   this.filtered.length,
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
