// this auth.guard.ts file is used to protect routes that require authentication. It checks if the user is logged in and has the necessary permissions to access the route. If not, it redirects the user to the login page or another appropriate page.
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state)=>{

    const auth = inject(Auth);
    const router = inject(Router);

    if(auth.isLoggedIn()){
        return true;
    }

    return router.createUrlTree(['/login'])


}

//router.createUrlTree(['/login']) return cheyyunnathaanu best
//  practice. Athu current navigation cancel cheythu clean aayi new URL-ilekku route cheyyum.