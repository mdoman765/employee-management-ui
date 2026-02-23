import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { Department } from '../../../../core/models/department.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  departments: Department[] = [];
  isEdit = false;
  empId: number | null = null;
  saving = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private empSvc: EmployeeService,
    private deptSvc: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:          ['', [Validators.required, Validators.minLength(2)]],
      email:         ['', [Validators.required, Validators.email]],
      phone:         [''],
      departmentId:  ['', Validators.required],
      accountNumber: ['']
    });

    this.deptSvc.getAll().subscribe({ next: r => this.departments = r.data ?? [] });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.empId = +id;
      this.empSvc.getById(+id).subscribe({
        next: r => this.form.patchValue(r.data),
        error: () => this.errorMsg = 'Failed to load employee data.'
      });
    }
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';

    const obs = this.isEdit
      ? this.empSvc.update(this.empId!, this.form.value)
      : this.empSvc.create(this.form.value);

    obs.subscribe({
      next: () => { this.saving = false; this.router.navigate(['/admin/employees']); },
      error: err => {
        this.saving = false;
        this.errorMsg = err?.error?.message ?? 'Failed to save. Please try again.';
      }
    });
  }
}
