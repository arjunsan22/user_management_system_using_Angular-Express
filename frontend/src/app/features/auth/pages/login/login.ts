import { Component, inject, signal } from '@angular/core';
import {FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { ToastService } from '../../../../core/services/toast'

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private toast = inject(ToastService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);


  loginForm = this.fb.nonNullable.group({

    email:['', [Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.minLength(5)]]
  })

  get email(){
    return  this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }

  onSubmit(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.auth.login(credentials).subscribe({
      next: (response) =>{
        this.isLoading.set(false);
        const user = response.data;

          this.toast.success(`Welcome back, ${user.name}!`);

        if (user.role === "admin"){
          this.router.navigate(['/admin/dashboard']);
        }else{
          this.router.navigate(['/user/home']);
        }
      },
      error: (err)=>{
        this.isLoading.set(false);
        const backendMessage = err?.error?.message || 'Invalid Credentials';
        this.errorMessage.set(backendMessage);

      }
    })
  }

}
