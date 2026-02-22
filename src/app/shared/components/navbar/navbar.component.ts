import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
 
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">EMS</a>
        <div class="navbar-nav ms-auto">
          <span class="nav-link text-light">{{ user?.username }}</span>
          <a class="nav-link" (click)="logout()" style="cursor:pointer">Logout</a>
        </div>
      </div>
    </nav>
  `
})
// export class NavbarComponent {
//     constructor(private authService: AuthService) {}
//   user = this.authService.getCurrentUser();
//   //constructor(private authService: AuthService) {}
//   logout(): void { this.authService.logout(); }
// }
export class NavbarComponent {
  user: any; // or type your user properly

  constructor(private authService: AuthService) {
    this.user = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
