import { Service, signal } from '@angular/core';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

@Service()
export class ToastService {
  // Private Writable Signal (Active toasts store cheyyunnu)
  private _toasts = signal<Toast[]>([]);

  // Public Read-Only Signal
  readonly toasts = this._toasts.asReadonly();

  // Show Toast
  show(message: string, type: ToastType = 'info', duration: number = 3500) {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: Toast = { id, message, type, duration };

    // Add toast to array
    this._toasts.update((current) => [...current, newToast]);

    // Automatically remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  // Convenient Helper Methods
  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  // Dismiss / Remove Toast
  remove(id: string) {
    this._toasts.update((current) => current.filter((t) => t.id !== id));
  }
}