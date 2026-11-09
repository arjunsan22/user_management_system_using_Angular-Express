import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Auth } from '../../../../core/services/auth';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
   private auth = inject(Auth);
  
  currentUser = this.auth.currentUser;
}
