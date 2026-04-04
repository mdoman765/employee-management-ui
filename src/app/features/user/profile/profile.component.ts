import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/models/login.model';
import { UpdateUserProfileService, UpdateProfileDto } from '../../../core/services/update-user-profile.service';

interface ProfileForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;        // ✅ new
  phone: string;       // ✅ new
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: LoginResponse | null;
  editMode = false;
  saving = false;
  showPassword = false;
  successMsg = '';
  errorMsg = '';

  form: ProfileForm = { 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '', 
    phone: ''

   };
  formErrors: Partial<ProfileForm> = {};

  constructor(private auth: AuthService, private profileSvc: UpdateUserProfileService) {
    this.user = this.auth.getCurrentUser();
  }

  getInitials(): string {
    return this.user?.username?.slice(0, 2).toUpperCase() ?? 'US';
  }

  enableEdit(): void {
    this.form = {
      username: this.user?.username ?? '',
      email: this.user?.email ?? '',
      password: '',
      confirmPassword: '',
      fullName: this.user?.fullName ?? '', 
      phone: this.user?.phone ?? ''       // ✅ new
    
    };
    this.formErrors = {};
    this.successMsg = '';
    this.errorMsg = '';
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.formErrors = {};
  }

  private validate(): boolean {
    this.formErrors = {};
    let valid = true;

    if (!this.form.username.trim()) {
      this.formErrors.username = 'Username is required.';
      valid = false;
    } else if (this.form.username.trim().length < 3) {
      this.formErrors.username = 'Username must be at least 3 characters.';
      valid = false;
    }

    if (!this.form.email.trim()) {
      this.formErrors.email = 'Email is required.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.formErrors.email = 'Enter a valid email address.';
      valid = false;
    }

    if (this.form.password) {
      if (this.form.password.length < 6) {
        this.formErrors.password = 'Password must be at least 6 characters.';
        valid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        this.formErrors.confirmPassword = 'Passwords do not match.';
        valid = false;
      }
    }

    return valid;
  }

  saveChanges(): void {
    if (!this.validate() || !this.user) return;

    this.saving = true;
    this.errorMsg = '';
    this.successMsg = '';
    const payload: UpdateProfileDto = {
      username: this.form.username.trim(),
      email: this.form.email.trim(),
      name:     this.form.fullName.trim(),           // ✅ new
      phone:    this.form.phone.trim() || undefined,  // ✅ new
      ...(this.form.password && { password: this.form.password })
    };

    // ✅ Uses UpdateUserProfileService — calls PUT api/profile
    this.profileSvc.updateProfile(payload).subscribe({
      next: () => {
        const updated: LoginResponse = {
          ...this.user!,
          username: payload.username,
          email: payload.email
        };
        localStorage.setItem('user', JSON.stringify(updated));
        this.user = updated;

        this.successMsg = 'Profile updated successfully!';
        this.editMode = false;
        this.saving = false;
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to update profile. Please try again.';
        this.saving = false;
      }
    });
  }
}