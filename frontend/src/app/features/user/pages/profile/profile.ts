import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProfileService } from '../../services/profile';
import { Auth } from '../../../../core/services/auth';
import { ToastService } from '../../../../core/services/toast';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile implements OnInit {

private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private auth = inject(Auth);
  private toast = inject(ToastService);
  currentUser = this.auth.currentUser;
  isUpdatingProfile = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);

  // personal information Form..........
  profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });
  
  // change Password Form/....
  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });
  ngOnInit(): void {

    // Current user details form- lee kuu attah cheyunnu 
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email
      });
    }
  }

  // Save Personal Details
  
  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isUpdatingProfile.set(true);
    const { name, email } = this.profileForm.getRawValue();
    this.profileService.updateProfile({ name, email }).subscribe({
      next: (res) => {
        this.isUpdatingProfile.set(false);
        this.toast.success('Profile updated successfully!');
        
        this.auth.fetchCurrentUser().subscribe();
      },
      error: (err) => {
        this.isUpdatingProfile.set(false);
        this.toast.error(err.error?.message || 'Failed to update profile');
      }
    });
  }
  
  // Change Password
  
  onChangePassword(): void {
  
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
  
    this.isChangingPassword.set(true);
    const user = this.currentUser();
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.profileService.updateProfile({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.toast.success('Password changed successfully!');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.toast.error(err.error?.message || 'Failed to change password');
      }
    });
  }
}
