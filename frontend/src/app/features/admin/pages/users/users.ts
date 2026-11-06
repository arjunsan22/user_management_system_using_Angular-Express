import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Admin, User } from '../../services/admin'
import { ToastService } from '../../../../core/services/toast';
import { Spinner } from '../../../../shared/components/spinner/spinner';

@Component({
  imports: [ReactiveFormsModule, DatePipe, Spinner],
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users implements OnInit{

  private adminService = inject(Admin);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  users = signal<User[]>([]);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);

  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedUserId = signal<number | null>(null);

  // Delete Confirmation Modal Signals
  isDeleteModalOpen = signal<boolean>(false);
  userToDelete = signal<User | null>(null);
  
  //  Search using Angular computed() Signal
  
  filteredUsers = computed(() => {

    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.users();
    return this.users().filter(
  
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
  
      );
  });

    userForm = this.fb.nonNullable.group({

    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', [Validators.required]],
    password: [''] // Add mode-il mathram mandatory aakkum

  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.adminService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error(err.error?.message || 'Failed to load users');
      }
    });
  }

  // OPEN ADD MODAL
  openAddModal(): void {

    this.isEditMode.set(false);
    this.selectedUserId.set(null);
    this.userForm.reset({ role: 'user' });

    // Password field mandatory aakkunnu

    this.userForm.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.controls.password.updateValueAndValidity();

    this.isModalOpen.set(true);
  }

  
  // OPEN EDIT MODAL // patchValue upayogikkam - so data attched akum
  
  openEditModal(user: User): void {
  
    this.isEditMode.set(true);
    this.selectedUserId.set(user.id);
  
    // Form pre-fill cheyyunnu
  
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
  
    // Edit mode-il password field optional aakkunnu
    this.userForm.controls.password.clearValidators();
    this.userForm.controls.password.updateValueAndValidity();
    this.isModalOpen.set(true);
  
  }

  // Close Add/Edit Modal
  closeModal(): void {
    this.isModalOpen.set(false);
    this.userForm.reset();
  }

  // Save (Handles both Add & Edit!)
  
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    const formValues = this.userForm.getRawValue();
    
    if (this.isEditMode()) {
      // EDIT USER API
      const id = this.selectedUserId()!;
     
      this.adminService.updateUser(id, {

        name: formValues.name,
        email: formValues.email,
        role: formValues.role
      
      }).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.toast.success('User updated successfully!');
          this.closeModal();
          this.loadUsers(); // Refresh list
        },
      
        error: (err) => {
          this.isSubmitting.set(false);
          this.toast.error(err.error?.message || 'Failed to update user');
        }
      
      });
    } else {
      // ADD USER API
    
      this.adminService.addUser({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.toast.success('User created successfully!');
          this.closeModal();
          this.loadUsers(); 
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.toast.error(err.error?.message || 'Failed to create user');
        }
      });
    }
  }

  //  DELETE MODAL HANDLERS
  
  openDeleteModal(user: User): void {
    this.userToDelete.set(user);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.userToDelete.set(null);
  }

  confirmDelete(): void {

    const user = this.userToDelete();
    
    if (!user) return;
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.toast.success(`User "${user.name}" deleted successfully!`);
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to delete user');
        this.closeDeleteModal();
      }
    });
  }

}
