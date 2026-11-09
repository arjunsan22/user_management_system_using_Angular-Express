import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { User, ApiResponse } from '../../admin/services/admin';

export interface UpdateProfilePayload {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

@Service()
export class ProfileService {
    private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/profile`;

  //fetch profile/.....
  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(this.apiUrl);
  }

// update profile and passwordd.......
  updateProfile(data: UpdateProfilePayload): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(this.apiUrl, data);
  }
}
