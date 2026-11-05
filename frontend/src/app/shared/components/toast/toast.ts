import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../../core/services/toast';

@Component({
  imports: [],
  selector: 'app-toast',
  styleUrl: './toast.css',
  templateUrl: './toast.html',
})
export class Toast {

    toastService = inject(ToastService);
    
  getIcon(type: ToastType): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
    }
  }
}
