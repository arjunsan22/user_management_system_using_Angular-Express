import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

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
}
