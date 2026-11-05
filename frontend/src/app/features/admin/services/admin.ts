import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  regularUsers: number;
}
export interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}
export interface StatsResponse {
  statusCode: number;
  data: {
    stats: DashboardStats;
    recentUsers: RecentUser[];
  };
  message: string;
  success: boolean;
}


@Service()
export class Admin {

 private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/users`;

  getDashboardStats(): Observable<StatsResponse> {
        //eni withcredentials venda . interceptor il cheythu..
    return this.http.get<StatsResponse>(`${this.apiUrl}/stats`);
    }

    // get all users
  getUsers(): Observable<ApiResponse<User[]>> {
   
    return this.http.get<ApiResponse<User[]>>(this.apiUrl);
  
  }

    // add new user
  addUser(userData: { name: string, email: string, password: string, role: string }): Observable<ApiResponse<User>> {
  
    return this.http.post<ApiResponse<User>>(this.apiUrl, userData);
  
  }

  // edit user

  updateUser(id: number, userData: { name: string; email: string; role: string }): Observable<ApiResponse<User>> {
   
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, userData);
  }

  // delete user
  deleteUser(id: number): Observable<ApiResponse<void>> {
    
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

}
