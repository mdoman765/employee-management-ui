import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-sidebar', standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  role = '';

  adminNav: NavItem[] = [
    { label: 'Dashboard',   icon: '📊', route: '/admin/dashboard' },
    { label: 'Employees',   icon: '👥', route: '/admin/employees' },
    { label: 'Departments', icon: '🏢', route: '/admin/departments' },
    { label: 'Attendance',  icon: '📋', route: '/admin/attendance' },
    { label: 'Salaries',    icon: '💰', route: '/admin/salaries' },
    { label: 'Users',       icon: '🔑', route: '/admin/users' },
    { label: 'Tickets',     icon: '🎫', route: '/admin/tickets' },
  ];

  agentNav: NavItem[] = [
    { label: 'My Tickets',  icon: '🎫', route: '/agent/assigned-tickets' },
  ];

  userNav: NavItem[] = [
    { label: 'Dashboard',     icon: '🏠', route: '/user/dashboard' },
    { label: 'My Profile',    icon: '👤', route: '/user/profile' },
    { label: 'My Attendance', icon: '📋', route: '/user/my-attendance' },
    { label: 'My Salary',     icon: '💰', route: '/user/my-salary' },
    { label: 'My Tickets',    icon: '🎫', route: '/user/my-tickets' },
  ];

  navItems: NavItem[] = [];

  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.navItems = this.role === 'Admin' ? this.adminNav : this.role === 'SupportAgent' ? this.agentNav : this.userNav;
  }
}
