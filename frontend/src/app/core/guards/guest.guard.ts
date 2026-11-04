import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    const user = auth.currentUser();

    if (user?.role === 'admin') {
      return router.createUrlTree(['/admin/dashboard']);
    } else {
      return router.createUrlTree(['/user/home']);  
     }
  }

  return true; 
};