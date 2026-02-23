import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/admin/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'employees/new',
        loadComponent: () => import('./features/admin/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
      },
      {
        path: 'employees/edit/:id',
        loadComponent: () => import('./features/admin/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
      },
      {
        path: 'departments',
        loadComponent: () => import('./features/admin/departments/departments.component').then(m => m.DepartmentsComponent)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/admin/attendance/attendance.component').then(m => m.AttendanceComponent)
      },
      {
        path: 'salaries',
        loadComponent: () => import('./features/admin/salaries/salaries.component').then(m => m.SalariesComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent)
      },
    ]
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/user/dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'my-attendance',
        loadComponent: () => import('./features/user/my-attendance/my-attendance.component').then(m => m.MyAttendanceComponent)
      },
      {
        path: 'my-salary',
        loadComponent: () => import('./features/user/my-salary/my-salary.component').then(m => m.MySalaryComponent)
      },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
