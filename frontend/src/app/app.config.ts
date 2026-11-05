import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { firstValueFrom } from 'rxjs';
import { Auth } from './core/services/auth';

// 1. App start aavumbol background-il user-e check cheyyunna initializer function
function initializeAuth() {
  const auth = inject(Auth);
  // firstValueFrom: Observable-e Promise aakki convert cheyyunnu
  // .catch(() => null): User login allengil error throw cheyyaathe silent aayi vidunnu
  return firstValueFrom(auth.fetchCurrentUser()).catch(() => null);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    //interceptors add cheythu 
    provideHttpClient(withInterceptors([authInterceptor])),
 // 2. Angular 22 Native App Initializer: Route Guards run aavunnathinu mumb ithu run aavum!
    provideAppInitializer(initializeAuth)
  ]
};
