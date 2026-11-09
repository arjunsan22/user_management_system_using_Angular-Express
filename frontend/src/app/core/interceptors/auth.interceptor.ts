import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next)=> {

const auth = inject(Auth);
  const router = inject(Router);
  // 1. Ellaa outgoing requests-ilum automatically withCredentials: true attach cheyyunnu
  const authReq = req.clone({
    withCredentials: true
  });
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // 2. Backend 401 Unauthorized tharukayum, athu Login/Refresh request ALLENGILUM:
      if (
        error.status === 401 &&
        !req.url.includes('/login') &&
        !req.url.includes('/refresh-token')
      ) {
        // 3. User ariyathe background-il /api/auth/refresh-token call cheyyunnu
        return auth.refreshToken().pipe(
          switchMap(() => {
            // 4. Puthiya Access Token kitti! Ippo pazhaya request veendum RETRY cheyyunnu!
            return next(authReq);
          }),
          catchError((refreshError) => {
            // 5. Refresh token-um theernnu (5 days kazhinju) -> Force Logout!
            auth.logout().subscribe({
              next: () => router.navigate(['/login']),
              error: () => router.navigate(['/login'])
            });
            return throwError(() => refreshError);
          })
        );
      }
      // Baakki ella errors-um (400, 404, 500) normal pole throw cheyyunnu
      return throwError(() => error);
    })
  );
};


//notes ----------

//------ !req.url.includes('/login') enthinaanu?----------------
  
// User login page-il thettaya password adichal backend 401 Invalid Credentials tharum.

// Aa samayath refresh token call cheyyan nokkiyaal Infinite Loop aavum! Athukond /login-il ninnu varunna 401-ine nammal catch cheyyilla, direct aayi component-inu kodukkum.

  

  
//------ !req.url.includes('/refresh-token') enthinaanu?--------
  
// Refresh token request thanne 401 aaneel veendum refresh token vilikkaruthu! Direct aayi Logout aakkanam.

  

  
// ------ switchMap(() => next(authReq)): ------
  
// RxJS-inte ettavum powerful operator aanu switchMap.

// Refresh Token API success aayi kazhinja udan, nammal hold cheythu vecha pazhaya request-ine (authReq) veendum backend-ilekku switch cheythu execute cheyyunnu!