import { Component, inject, output } from '@angular/core';
import { Auth } from '../../../../core/services/auth';

@Component({
  imports: [],
  selector: 'app-admin-header',
  styleUrl: './admin-header.css',
  templateUrl: './admin-header.html',
})
export class AdminHeader {
  
  private auth = inject(Auth)

  currentUser = this.auth.currentUser;
  toggleSidebar = output<void>(); // parent admin-layout lekku kodukkunnu
  logout = output<void>();

  onToggle(){
    this.toggleSidebar.emit();
  }

  onLogout(){
    this.logout.emit();
  }

}
