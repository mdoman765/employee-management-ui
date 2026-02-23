import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/models/login.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: LoginResponse | null;

  constructor(private auth: AuthService) {
    this.user = this.auth.getCurrentUser();
  }

  getInitials(): string {
    return this.user?.username?.slice(0, 2).toUpperCase() ?? 'US';
  }
}
