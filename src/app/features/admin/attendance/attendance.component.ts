import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AttendanceService } from '../../../core/services/attendance.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { Attendance } from '../../../core/models/attendance.model';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  records: Attendance[] = [];
  employees: Employee[] = [];
  loading = true;
  showForm = false;
  saving = false;
  successMsg = '';
  errorMsg = '';
  filterDate = '';
  filterStatus = '';
  form: FormGroup;

  statusOptions = ['Present', 'Absent', 'Late', 'Leave'];

  constructor(
    private svc: AttendanceService,
    private empSvc: EmployeeService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      employeeId:   ['', Validators.required],
      checkInTime:  ['', Validators.required],
      checkOutTime: [''],
      status:       ['Present', Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
    this.empSvc.getAll().subscribe({ next: r => this.employees = r.data ?? [] });
  }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: r => { this.records = r.data ?? []; this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load attendance.'; this.loading = false; }
    });
  }

  get filtered(): Attendance[] {
    return this.records.filter(r => {
      const dateMatch = this.filterDate ? r.checkInTime.startsWith(this.filterDate) : true;
      const statusMatch = this.filterStatus ? r.status === this.filterStatus : true;
      return dateMatch && statusMatch;
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.svc.create(this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'Attendance recorded!';
        this.showForm = false;
        this.form.reset({ status: 'Present' });
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: err => { this.saving = false; this.errorMsg = err?.error?.message ?? 'Failed to save.'; }
    });
  }

  getStatusClass(s?: string): string {
    const map: any = { Present: 'present', Absent: 'absent', Late: 'late', Leave: 'leave' };
    return map[s ?? ''] ?? '';
  }

  get f() { return this.form.controls; }
}
