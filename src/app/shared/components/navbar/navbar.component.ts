import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/models/login.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  user: LoginResponse | null;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getCurrentUser();
  }

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.auth.logout();
  }

  getInitials(): string {
    return this.user?.username?.charAt(0).toUpperCase() ?? 'U';
  }
}
