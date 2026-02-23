import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  showForm = false;
  saving = false;
  successMsg = '';
  errorMsg = '';
  form: FormGroup;

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' }
  ];

  constructor(private svc: UserService, private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId:   ['', Validators.required]
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: r => { this.users = r.data ?? []; this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load users.'; this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.svc.create(this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'User created successfully!';
        this.showForm = false;
        this.form.reset();
        this.load();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: err => { this.saving = false; this.errorMsg = err?.error?.message ?? 'Failed to create user.'; }
    });
  }

  toggleStatus(id: number, current: boolean): void {
    this.svc.update(id, { isActive: !current }).subscribe({
      next: () => { this.successMsg = 'User status updated.'; this.load(); setTimeout(() => this.successMsg = '', 3000); },
      error: () => this.errorMsg = 'Failed to update status.'
    });
  }

  get f() { return this.form.controls; }
}
