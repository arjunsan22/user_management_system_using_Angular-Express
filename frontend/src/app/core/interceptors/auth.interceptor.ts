import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next)=> {

const auth = inject(Auth);
  const router = inject(Router);
// automatically ella request num attach cheyyum withcredentials: true
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (
        error.status === 401 &&
        !req.url.includes('/login') &&
        !req.url.includes('/refresh-token')
      ) {

        return auth.refreshToken().pipe(
          switchMap(() => {
            // ----- Puthiya Access Token kitti! Ippo pazhaya request veendum RETRY cheyyunnu!
            return next(authReq);
          }),
          catchError((refreshError) => {
            //  Refresh token-um theernnu (5 days kazhinju) -> Force Logout!
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