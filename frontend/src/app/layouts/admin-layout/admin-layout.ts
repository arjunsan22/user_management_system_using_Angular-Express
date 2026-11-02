import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AdminSidebar} from './components/admin-sidebar/admin-sidebar';
import {AdminHeader} from './components/admin-header/admin-header';

@Component({
  imports: [RouterOutlet, AdminSidebar, AdminHeader],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {

  isSidebarOpen = signal<boolean>(true);

  toggleSidebar() {
    this.isSidebarOpen.update(prev => !prev);
  }// output from admin-header component

  onLogout(){
    console.log('  logged out');
    alert('Admin logged out successfully');
  }
}
