import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalaryService } from '../../../core/services/salary.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { Salary } from '../../../core/models/salary.model';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-salaries',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.scss']
})
export class SalariesComponent implements OnInit {
  salaries: Salary[] = [];
  employees: Employee[] = [];
  loading = true;
  showForm = false;
  saving = false;
  successMsg = '';
  errorMsg = '';
  filterEmpId = '';
  form: FormGroup;

  constructor(
    private svc: SalaryService,
    private empSvc: EmployeeService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      employeeId:   ['', Validators.required],
      basicSalary:  ['', [Validators.required, Validators.min(0)]],
      bonus:        [0, Validators.min(0)],
      deduction:    [0, Validators.min(0)],
      effectiveFrom:['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
    this.empSvc.getAll().subscribe({ next: r => this.employees = r.data ?? [] });
  }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: r => { this.salaries = r.data ?? []; this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load salaries.'; this.loading = false; }
    });
  }

  get filtered(): Salary[] {
    return this.filterEmpId
      ? this.salaries.filter(s => s.employeeId === +this.filterEmpId)
      : this.salaries;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.svc.create(this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'Salary record added!';
        this.showForm = false;
        this.form.reset({ bonus: 0, deduction: 0 });
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: err => { this.saving = false; this.errorMsg = err?.error?.message ?? 'Failed to save.'; }
    });
  }

  totalNet(s: Salary): number {
    return (s.basicSalary ?? 0) + (s.bonus ?? 0) - (s.deduction ?? 0);
  }

  get f() { return this.form.controls; }
}
