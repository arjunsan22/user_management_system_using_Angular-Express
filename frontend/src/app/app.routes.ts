import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'',
        loadChildren:()=> import('./features/auth/auth.routes').then(m=> m.AUTH_ROUTES)
    },
    {
        path:'admin',
        loadChildren:() => import('./features/admin/admin.routes').then(m=> m.ADMIN_ROUTES)
    },
    {
        path:'user',
        loadChildren:()=> import('./features/user/user.routes').then(m => m.USER_ROUTES)
    },
    {
        path:'**',
        loadComponent:()=> import('./shared/components/not-found/not-found').then(m=> m.NotFound)
    }
];
