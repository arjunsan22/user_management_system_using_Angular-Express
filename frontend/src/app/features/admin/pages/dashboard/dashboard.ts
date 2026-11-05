import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Admin, DashboardStats, RecentUser } from '../../services/admin';
import { Auth } from '../../../../core/services/auth';
import { Spinner } from '../../../../shared/components/spinner/spinner';

@Component({
  imports: [RouterLink, DatePipe, Spinner],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit{

  private adminService = inject(Admin);
  private auth = inject(Auth);

  currentUser = this.auth.currentUser;

  stats = signal<DashboardStats | null>(null);
  recentUsers = signal<RecentUser[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);


 ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {

          this.stats.set(response.data.stats);
          this.recentUsers.set(response.data.recentUsers);

        }

        this.isLoading.set(false);
        
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load dashboard statistics.');
      }
    });
  }
  
}
