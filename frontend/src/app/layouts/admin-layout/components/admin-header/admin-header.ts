import { Component, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-admin-header',
  styleUrl: './admin-header.css',
  templateUrl: './admin-header.html',
})
export class AdminHeader {
  
  toggleSidebar = output<void>(); // parent admin-layout lekku kodukkunnu
  logout = output<void>();

  onToggle(){
    this.toggleSidebar.emit();
  }

  onLogout(){
    this.logout.emit();
  }


}
