import { Service , computed, inject , signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';


export interface User{
    id :number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}


export interface LoginResponse{
    statusCode: number;
    data: User;
    message: string;
    success: boolean;
}

@Service()
export class Auth {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/auth`;

   // Private Writable Signal (Service-inte ullil mathram maattaan pattum)
    private _currentUser = signal <User | null>(null);

      //  Public Read-Only Signal (Components-inu read cheyyan mathram, update or set cheyyan pattilla!)
  readonly currentUser = this._currentUser.asReadonly();

    //  Computed Signals: currentUser maarumbol ithu automatically calculate aavum!
  readonly isLoggedIn = computed(() => !!this._currentUser());// for user
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');


    
login(credentials: { email: string; password: string }): Observable<LoginResponse> {
   
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    }).pipe( // data handle cheyyan pipe() use cheyyunnu- ethil tap() use cheyyunnu- ethil response handle cheyyunnu
      tap((response) => {
        if (response.success && response.data) {
          // Private signal mathram update cheyyunnu
          this._currentUser.set(response.data);
        }
      })
    );
  }


  logout(): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this._currentUser.set(null);
      })
    );
  }


  fetchCurrentUser(): Observable<LoginResponse> {
   
    return this.http.get<LoginResponse>(`${this.apiUrl}/me`, {
      withCredentials: true
    }).pipe(
      tap({
        next: (response) => {
          if (response.success && response.data) {
            this._currentUser.set(response.data);
          }
        },
        error: () => {
          this._currentUser.set(null);
        }
      })
    );
  }

// background il refresh token vechu puthiya access token edukkan ulla method
refreshToken(): Observable<any> {
  return this.http.post(`${this.apiUrl}/refresh-token`, {}, {
    withCredentials: true
  });
}
  
} // this method called in both app.config.ts and auth.interceptor.ts 



// • readonly isLoggedIn = computed(() => !!this._currentUser());
// ഇവിടെ നിങ്ങൾ രണ്ട് ആശ്ചര്യചിഹ്നങ്ങൾ (!!) ഉപയോഗിച്ചിട്ടുണ്ട്. ഇത് _currentUser-ൽ യൂസറുടെ ഡാറ്റ ഉണ്ടെങ്കിൽ true എന്നും, ഡാറ്റ ഇല്ലെങ്കിൽ (അതായത് null ആണെങ്കിൽ) false എന്നും തരും.
// 	• യൂസർ ഉണ്ടെങ്കിൽ: true
// 	• ലോഗൗട്ട് ചെയ്താൽ: false