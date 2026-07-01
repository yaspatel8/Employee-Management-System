import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const token = localStorage.getItem('token');
  const role = authService.getUserRole();

  const curruntRole = route.data['Role'] as string[] | undefined;

  if (token && curruntRole?.includes(role?.toLowerCase()!)) {
    return true;
  }

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  router.navigate(['/404']);
  return false;

};
