import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-user-header',
  styleUrl: './user-header.css',
  templateUrl: './user-header.html',
})
export class UserHeader {

  logout = output<void>();

  onLogout(){
    this.logout.emit();
  }
}
