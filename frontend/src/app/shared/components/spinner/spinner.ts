import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-spinner',
  styleUrl: './spinner.css',
  templateUrl: './spinner.html',
})
export class Spinner {

  message = input<string>('Loading...'); // input data parent il ninnu child lekku vangan anu , evide parent data thannillengil default ayi loading... anu
  size = input<'sm' | 'md' | 'lg'>('md');
  isOverlay = input<boolean>(false);

}
