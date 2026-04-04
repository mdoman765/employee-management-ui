import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const agentGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn() && auth.isAgent()) return true;
  return inject(Router).parseUrl(auth.isAdmin() ? '/admin/dashboard' : '/user/dashboard');
};
