import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";
import { adminGuard } from "../../core/guards/admin.guard";

export const ADMIN_ROUTES: Routes =[
    {
        path:'',
        canActivate:[authGuard, adminGuard],

        loadComponent:() => import('../../layouts/admin-layout/admin-layout')
        .then(m => m.AdminLayout),
        children:[
            {
                path:'dashboard',
                loadComponent:() => import('./pages/dashboard/dashboard').then(m=> m.Dashboard)
            },
            {
                path:'users',
                loadComponent:() => import('./pages/users/users').then(m=> m.Users)
            },
            {
                path:'',
                redirectTo:'dashboard',
                pathMatch:'full'
            }
        ]
    }
]