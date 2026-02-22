import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../../../core/services/employee.service'
import { DepartmentService } from '../../../../../core/services/department.service';
import { Department } from '../../../../../core/models/department.model';
 
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  departments: Department[] = [];
  isEdit = false;
  employeeId: number | null = null;
  loading = false;
 
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private deptService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    }
  }
 
  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      departmentId: ['', [Validators.required]],
      accountNumber: ['']
    });
  }
 
  loadDepartments(): void {
    this.deptService.getAll().subscribe(res => this.departments = res.data);
  }
 
  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe(res => this.form.patchValue(res.data));
  }
 
  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const action = this.isEdit
      ? this.employeeService.update(this.employeeId!, this.form.value)
      : this.employeeService.create(this.form.value);
 
    action.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/admin/employees']); },
      error: () => { this.loading = false; }
    });
  }
 
  get f() { return this.form.controls; }
}
