import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-user-footer',
  styleUrl: './user-footer.css',
  templateUrl: './user-footer.html',
})
export class UserFooter {
  currentYear: number = new Date().getFullYear();
}
