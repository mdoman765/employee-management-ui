import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) {
      const role = this.auth.getCurrentUser()?.role;
      this.router.navigate([role === 'Admin' ? '/admin/dashboard' : '/user/dashboard']);
    }
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.router.navigate([res.data.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard']);
        } else {
          this.error = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid username or password. Please try again.';
      }
    });
  }
}
