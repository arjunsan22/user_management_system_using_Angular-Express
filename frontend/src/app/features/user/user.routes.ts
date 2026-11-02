import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    
    loadComponent: () => import('../../layouts/user-layout/user-layout').then(m => m.UserLayout),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.Profile)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];