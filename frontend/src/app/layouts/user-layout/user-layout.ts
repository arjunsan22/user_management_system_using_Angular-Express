import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserHeader } from './components/user-header/user-header';
import { UserFooter } from './components/user-footer/user-footer';

@Component({
  imports: [RouterOutlet, UserHeader, UserFooter],
  selector: 'app-user-layout',
  styleUrl: './user-layout.css',
  templateUrl: './user-layout.html',
})
export class UserLayout {

  private router = inject(Router);

  onLogout(){
    console.log('user logged out ');
    this.router.navigate(['/login']);
  }
}
