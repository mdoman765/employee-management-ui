import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  loading = true;
  showForm = false;
  editId: number | null = null;
  saving = false;
  deleteId: number | null = null;
  deleting = false;
  successMsg = '';
  errorMsg = '';
  form: FormGroup;

  constructor(private svc: DepartmentService, private fb: FormBuilder) {
    this.form = this.fb.group({ name: ['', [Validators.required, Validators.minLength(2)]] });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: r => { this.departments = r.data ?? []; this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load departments.'; this.loading = false; }
    });
  }

  openAdd(): void { this.editId = null; this.form.reset(); this.showForm = true; }

  openEdit(d: Department): void {
    this.editId = d.id;
    this.form.patchValue({ name: d.name });
    this.showForm = true;
  }

  closeForm(): void { this.showForm = false; this.form.reset(); this.editId = null; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const obs = this.editId
      ? this.svc.update(this.editId, this.form.value)
      : this.svc.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = this.editId ? 'Department updated!' : 'Department added!';
        this.closeForm();
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: err => { this.saving = false; this.errorMsg = err?.error?.message ?? 'Failed to save.'; }
    });
  }

  confirmDelete(id: number): void { this.deleteId = id; }
  cancelDelete(): void { this.deleteId = null; }

  doDelete(): void {
    if (!this.deleteId) return;
    this.deleting = true;
    this.svc.delete(this.deleteId).subscribe({
      next: () => {
        this.successMsg = 'Department deleted.';
        this.deleteId = null; this.deleting = false;
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: err => { this.errorMsg = err?.error?.message ?? 'Failed to delete.'; this.deleting = false; }
    });
  }

  get f() { return this.form.controls; }
}
